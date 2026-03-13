from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

@app.route('/api/payments', methods=['POST'])
def process_payment():
    data = request.json
    order_id = data.get('order_id')
    amount = data.get('amount')
    
    # Mocking the payment processing logic
    if not order_id or not amount:
        return jsonify({"error": "Missing order_id or amount"}), 400

    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"
    
    return jsonify({
        "status": "Success",
        "transaction_id": transaction_id,
        "amount_paid": amount,
        "message": "Payment processed successfully!"
    }), 200

if __name__ == '__main__':
    # Listen on port 5000 inside the container
    app.run(host='0.0.0.0', port=5000)