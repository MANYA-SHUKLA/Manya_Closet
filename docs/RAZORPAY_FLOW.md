# 💳 Razorpay Payment Flow Documentation

## Payment Flow Overview

This document outlines the complete Razorpay payment integration flow for Manya Closet e-commerce application.

---

## ✅ Payment Flow Steps

### 1. User Clicks "Place Order"
- User is on checkout page
- Fills in shipping/billing addresses
- Clicks "Proceed to Payment" button
- `handleSubmit` function is triggered

### 2. Backend Creates Order
**Endpoint:** `POST /api/checkout`
- Creates order with status: `pending`
- Payment status: `pending`
- Locks inventory (reserves quantity)
- Clears user's cart
- Returns order object with `_id`

### 3. Backend Creates Razorpay Order
**Endpoint:** `POST /api/payment/create`
- Receives: `{ orderId: <internal_order_id> }`
- Creates Payment record in MongoDB with status: `pending`
- Creates Razorpay order via Razorpay SDK
- Stores `razorpayOrderId` in Payment record
- Returns:
  ```json
  {
    "success": true,
    "data": {
      "orderId": "order_xxxxx",  // Razorpay order ID
      "amount": 50000,            // Amount in paise
      "currency": "INR",
      "key": "rzp_test_xxxxx"     // Razorpay key ID
    }
  }
  ```

### 4. Frontend Opens Razorpay Checkout
- Frontend receives Razorpay order data
- Loads Razorpay checkout script (if not already loaded)
- Opens Razorpay payment modal with:
  - Razorpay order ID
  - Amount
  - Currency
  - Merchant key
- User completes payment in Razorpay modal

### 5. Payment Success/Failure
**On Success:**
- Razorpay SDK `handler` function is called
- Frontend redirects to `/orders?payment=success`
- ✅ **Frontend does NOT confirm payment**
- ✅ **Frontend does NOT update order status**

**On Failure:**
- Razorpay SDK `payment.failed` event is triggered
- Frontend redirects to `/orders?payment=failed`
- Order remains in `pending` status

### 6. Razorpay Webhook Hits Backend
**Endpoint:** `POST /api/payment/verify`
- Razorpay sends webhook with payment details:
  - `razorpay_order_id`
  - `razorpay_payment_id`
  - `razorpay_signature`
- ⚠️ **No authentication** (webhook from Razorpay)

### 7. Backend Verifies Signature
- Finds Payment record by `razorpayOrderId`
- Verifies signature using Razorpay secret key
- Uses HMAC SHA256: `razorpay_order_id|razorpay_payment_id`
- If signature invalid → returns error

### 8. Backend Updates Order Status
**Only if signature is valid:**
- Updates Payment record:
  - `status: 'paid'`
  - `transactionId: razorpay_payment_id`
  - `paidAt: current_date`
- Updates Order:
  - `paymentStatus: 'paid'`
  - `status: 'confirmed'` (changed from `pending`)
  - Links Payment to Order
- Sends confirmation emails:
  - To user: Order confirmation
  - To admin: New order notification

---

## 🔒 Security Principles

### ✅ Frontend Never Confirms Payment
- Frontend only opens Razorpay checkout
- Frontend only redirects after payment
- Frontend does NOT call any payment verification endpoint
- Frontend does NOT update order status

### ✅ Backend Controls Order State
- Only backend can mark orders as PAID
- Payment verification happens in webhook handler
- Signature verification ensures payment authenticity
- Order status changes only after successful payment verification

### ✅ Webhook Security
- Webhook endpoint is public (no auth)
- Security comes from signature verification
- Only Razorpay can generate valid signatures
- Invalid signatures are rejected

---

## 📋 Code Implementation

### Backend: Create Payment
```javascript
// POST /api/payment/create
export const createPayment = async (req, res) => {
  // 1. Get order
  const order = await Order.findById(orderId);
  
  // 2. Create Payment record
  const payment = await Payment.create({
    order: orderId,
    user: userId,
    amount: order.totalAmount,
    status: 'pending'
  });
  
  // 3. Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency: 'INR',
    receipt: order.orderNumber
  });
  
  // 4. Store Razorpay order ID
  payment.razorpayOrderId = razorpayOrder.id;
  await payment.save();
  
  // 5. Return Razorpay order data
  res.json({
    orderId: razorpayOrder.id,  // Razorpay order ID
    amount: razorpayOrder.amount,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID
  });
};
```

### Backend: Verify Payment (Webhook)
```javascript
// POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  // 1. Find payment
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  
  // 2. Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  
  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }
  
  // 3. Update payment
  payment.status = 'paid';
  payment.transactionId = razorpay_payment_id;
  payment.paidAt = new Date();
  await payment.save();
  
  // 4. Update order
  const order = await Order.findById(payment.order);
  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  await order.save();
  
  // 5. Send emails
  await sendOrderConfirmationEmail(...);
  
  res.json({ success: true });
};
```

### Frontend: Open Checkout
```javascript
const openRazorpayCheckout = (paymentData) => {
  const options = {
    key: paymentData.key,
    amount: paymentData.amount,
    currency: 'INR',
    order_id: paymentData.razorpayOrderId,  // Razorpay order ID
    handler: function (response) {
      // ✅ Just redirect - webhook will verify payment
      navigate('/orders?payment=success');
    }
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

---

## 🔄 Order Status Flow

```
User Places Order
    ↓
Order Created: status='pending', paymentStatus='pending'
    ↓
Payment Created: status='pending'
    ↓
Razorpay Order Created
    ↓
User Pays in Razorpay Modal
    ↓
Razorpay Webhook → Backend
    ↓
Signature Verified ✅
    ↓
Payment Updated: status='paid'
    ↓
Order Updated: paymentStatus='paid', status='confirmed'
    ↓
Emails Sent
```

---

## ⚠️ Important Notes

1. **Frontend Never Confirms Payment**
   - The `handler` function only redirects
   - No API calls to verify payment from frontend
   - Order status is controlled by backend only

2. **Webhook is Required**
   - Razorpay sends webhook automatically
   - Webhook URL must be configured in Razorpay dashboard
   - Webhook URL: `https://yourdomain.com/api/payment/verify`

3. **Development Setup**
   - Use Razorpay test keys for development
   - Use webhook testing tools (like ngrok) for local development
   - Test webhook endpoint: `POST /api/payment/verify`

4. **Production Setup**
   - Use Razorpay live keys
   - Configure webhook URL in Razorpay dashboard
   - Ensure webhook endpoint is publicly accessible
   - Monitor webhook delivery in Razorpay dashboard

---

## ✅ Verification Checklist

- [x] Frontend opens Razorpay checkout
- [x] Backend creates Razorpay order
- [x] Webhook endpoint receives payment data
- [x] Signature verification implemented
- [x] Order marked PAID only after webhook verification
- [x] Frontend does NOT confirm payment
- [x] Backend controls order state
- [x] Email notifications sent on payment success

---

**Status:** ✅ Implementation Complete
**Last Updated:** 2024

