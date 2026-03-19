package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type CartItem struct {
	ProductID   string  `json:"product_id"`
	ProductName string  `json:"product_name"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
}

type OrderRequest struct {
	Cart []CartItem `json:"cart"`
}

type OrderResponse struct {
	OrderID        string     `json:"order_id"`
	Cart           []CartItem `json:"cart"`
	TotalPrice     float64    `json:"total_price"`
	OrderStatus    string     `json:"order_status"`
	PaymentStatus  string     `json:"payment_status"`
	PaymentMessage string     `json:"payment_message"`
}

// In-memory database to store orders for the GET request
var ordersDB []OrderResponse

func orderHandler(w http.ResponseWriter, r *http.Request) {
	// CORS Headers for React Frontend
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// ==========================================
	// GET API: View all orders (Admin View)
	// ==========================================
	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(ordersDB)
		return
	}

	// ==========================================
	// DELETE API: Delete an order by ID
	// ==========================================
	if r.Method == http.MethodDelete {
		orderID := r.URL.Query().Get("id")
		if orderID == "" {
			http.Error(w, `{"error": "Missing order id"}`, http.StatusBadRequest)
			return
		}

		// Filter out the deleted order
		var updatedDB []OrderResponse
		for _, order := range ordersDB {
			if order.OrderID != orderID {
				updatedDB = append(updatedDB, order)
			}
		}
		ordersDB = updatedDB

		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"message": "Order %s deleted successfully"}`, orderID)
		return
	}

	// ==========================================
	// POST API: Create order & Call Payment
	// ==========================================
	if r.Method == http.MethodPost {
		var req OrderRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		var totalAmount float64
		for _, item := range req.Cart {
			totalAmount += float64(item.Quantity) * item.UnitPrice
		}
		orderID := fmt.Sprintf("ORD-%d", time.Now().Unix())

		// INTER-SERVICE COMMUNICATION
		paymentURL := os.Getenv("PAYMENT_SERVICE_URL")
		if paymentURL == "" {
			paymentURL = "http://payment-service.default.svc.cluster.local:80/api/payments"
		}

		paymentPayload, _ := json.Marshal(map[string]interface{}{
			"order_id": orderID,
			"amount":   totalAmount,
		})

		resp, err := http.Post(paymentURL, "application/json", bytes.NewBuffer(paymentPayload))

		paymentStatus := "Pending Payment"
		paymentMessage := "Failed to reach payment service"

		if err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			paymentData, _ := io.ReadAll(resp.Body)

			// Extract transaction ID from Payment Service JSON
			var paymentJSON map[string]interface{}
			json.Unmarshal(paymentData, &paymentJSON)
			if txnID, ok := paymentJSON["transaction_id"].(string); ok {
				paymentStatus = fmt.Sprintf("Paid (%s)", txnID)
			}
			paymentMessage = "Order is sent to make the payment"
		}

		newOrder := OrderResponse{
			OrderID:        orderID,
			Cart:           req.Cart,
			TotalPrice:     totalAmount,
			OrderStatus:    "Confirmed",
			PaymentStatus:  paymentStatus,
			PaymentMessage: paymentMessage,
		}

		// Save to database
		ordersDB = append(ordersDB, newOrder)

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newOrder)
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Healthy")
}

func receiveProducts(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	response := map[string]string{
		"message": "Products sent to the order",
	}

	json.NewEncoder(w).Encode(response)

}

func main() {
	http.HandleFunc("/api/orders", orderHandler)
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/orders/receive-products", receiveProducts)

	fmt.Println("Order Service is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
