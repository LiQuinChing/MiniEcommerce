import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from the Go API via Gateway
  const fetchOrders = async (isManualRefresh = false) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8888/api/orders');
      const data = await response.json();

      // Only show the toast if we manually clicked refresh AND there are more orders
      if (isManualRefresh && data && data.length > orders.length) {
        // Grab the most recently added order (assuming it's the last one in the list)
         const latestOrder = data[data.length - 1];

         // Check if the Go service flagged the payment as failed
         if (latestOrder.payment_message.includes("Failed") || latestOrder.payment_status === "Pending Payment") {
             toast.error(`Order saved, but failed to send to payment service: ${latestOrder.payment_message}`, { duration: 10000 });
         } else {
             toast.success(`New order arrived! Order is sent to make the payment. ${latestOrder.payment_message}`, { duration: 10000 });
         }
      }

      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    setLoading(false);
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      await fetch(`http://localhost:8888/api/orders?id=${orderId}`, {
        method: 'DELETE',
      });
      // Refresh the list after deleting
      toast.success(`Order ${orderId} deleted successfully!`); 
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error(`Failed to delete order ${orderId}.`);
    }
  };

  // Load orders when the page first loads
  useEffect(() => {
    fetchOrders(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Order Dashboard</h1>
          <button 
            onClick={() => fetchOrders(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No orders found. Use Postman to create one!
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4 border-b">Order ID</th>
                  <th className="p-4 border-b">Items</th>
                  <th className="p-4 border-b">Total Price</th>
                  <th className="p-4 border-b">Payment Status</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 border-b">
                    <td className="p-4 font-semibold text-gray-700">{order.order_id}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {order.cart.map(item => (
                        <div key={item.product_id}>{item.quantity}x {item.product_name}</div>
                      ))}
                    </td>
                    <td className="p-4 font-bold text-green-600">${order.total_price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.payment_status.includes('Paid') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteOrder(order.order_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}