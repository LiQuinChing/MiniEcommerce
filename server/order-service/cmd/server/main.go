package main

import (
	"bytes"
	"encoding/json"
	"fmt"
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
		// Java expects orderId as a Long (Number), so we use a Unix timestamp integer
		numericOrderID := time.Now().Unix()
		stringOrderID := fmt.Sprintf("ORD-%d", numericOrderID) // Keep string version for your DB

		// INTER-SERVICE COMMUNICATION
		paymentURL := os.Getenv("PAYMENT_SERVICE_URL")
		if paymentURL == "" {
			paymentURL = "http://payment-service.default.svc.cluster.local:80/api/payments"
		}

		// Updated to match Java's PaymentRequest.java DTO exactly!
		paymentPayload, _ := json.Marshal(map[string]interface{}{
			"orderId":       numericOrderID,
			"userId":        1, // Hardcoded user ID for now
			"amount":        totalAmount,
			"paymentMethod": "CREDIT_CARD", // Added required field
		})

		// Use http.NewRequest so we can add headers if needed for Spring Security
		reqPayment, _ := http.NewRequest("POST", paymentURL, bytes.NewBuffer(paymentPayload))
		reqPayment.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(reqPayment)

		paymentStatus := "Pending Payment"
		paymentMessage := "Failed to reach payment service"

		if err == nil {
			defer resp.Body.Close()
			if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
				paymentStatus = "Paid Successfully"
				paymentMessage = "Order is sent to make the payment. Java Service Confirmed!"
			} else {
				paymentMessage = fmt.Sprintf("Java Service returned error code: %d", resp.StatusCode)
			}
		}

		newOrder := OrderResponse{
			OrderID:        stringOrderID,
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

func main() {
	http.HandleFunc("/api/orders", orderHandler)
	http.HandleFunc("/health", healthHandler)

	fmt.Println("Order Service is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
