import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/OrderPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Order Page */}
        <Route path="/orders" element={<OrderPage />} />

        {/* Optional Home Route */}
        <Route
          path="/"
          element={
            <div style={{ padding: "20px" }}>
              <h1>Welcome to the App</h1>
              <p>Navigate to /orders to view the Order Page</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;