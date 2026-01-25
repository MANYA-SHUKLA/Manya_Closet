import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for Gmail SMTP
// Configured for Gmail App Passwords (port 587 with secure: false)
// To use Gmail App Password:
// 1. Enable 2-Step Verification on your Google Account
// 2. Go to Google Account > Security > App passwords
// 3. Generate an app password for "Mail"
// 4. Use that app password (16 characters) as EMAIL_PASSWORD
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // false for port 587 (TLS), true for port 465 (SSL)
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (e.g., yourname@gmail.com)
    pass: process.env.EMAIL_PASSWORD // Gmail App Password (16 characters, not your regular password)
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

/**
 * Send welcome email on signup/login
 */
export const sendWelcomeEmail = async (email, name, isAdmin = false) => {
  try {
    const subject = `Welcome to Manya Closet${isAdmin ? ' (Admin)' : ''}!`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Manya Closet!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for joining Manya Closet${isAdmin ? ' as an administrator' : ''}!</p>
            <p>We're excited to have you on board. Start exploring our latest collections and find your perfect style.</p>
            ${!isAdmin ? '<a href="http://localhost:5173" class="button">Start Shopping</a>' : '<a href="http://localhost:5173/admin/dashboard" class="button">Go to Dashboard</a>'}
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>The Manya Closet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order confirmation email (after successful payment)
 */
export const sendOrderConfirmationEmail = async (userEmail, userName, orderNumber, orderTotal, adminEmail = null) => {
  try {
    const subject = `Order Confirmation - Order #${orderNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .order-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .success-badge { display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Thank you for your order! Your payment has been received and your order is confirmed.</p>
            <div class="order-info">
              <p class="order-number">Order #${orderNumber}</p>
              <p><strong>Status:</strong> <span class="success-badge">Confirmed</span></p>
              <p><strong>Total Amount:</strong> ₹${orderTotal.toFixed(2)}</p>
            </div>
            <p>We're preparing your order and will notify you when it ships.</p>
            <a href="http://localhost:5173/orders" class="button">View Order</a>
            <p>If you have any questions about your order, feel free to reach out to us.</p>
            <p>Best regards,<br>The Manya Closet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail} for order ${orderNumber}`);

    // Send admin notification email if admin email is provided
    if (adminEmail) {
      const adminSubject = `New Order Received - Order #${orderNumber}`;
      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .order-number { font-size: 24px; font-weight: bold; color: #667eea; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Order Received</h1>
            </div>
            <div class="content">
              <h2>Admin Notification</h2>
              <p>A new order has been received and payment has been confirmed.</p>
              <div class="order-info">
                <p class="order-number">Order #${orderNumber}</p>
                <p><strong>Customer:</strong> ${userName}</p>
                <p><strong>Customer Email:</strong> ${userEmail}</p>
                <p><strong>Total Amount:</strong> ₹${orderTotal.toFixed(2)}</p>
              </div>
              <p>Please process this order as soon as possible.</p>
              <a href="http://localhost:5173/admin/orders" class="button">View Orders</a>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const adminMailOptions = {
        from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml
      };

      await transporter.sendMail(adminMailOptions);
      console.log(`Admin notification email sent to ${adminEmail} for order ${orderNumber}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order status update email
 */
export const sendOrderStatusEmail = async (email, name, orderNumber, status, trackingNumber = null) => {
  try {
    const statusMessages = {
      'shipped': {
        subject: `Your Order #${orderNumber} Has Been Shipped!`,
        title: 'Your Order is on the Way!',
        message: 'Great news! Your order has been shipped and is on its way to you.',
        action: 'Track Your Order'
      },
      'delivered': {
        subject: `Your Order #${orderNumber} Has Been Delivered!`,
        title: 'Your Order Has Been Delivered!',
        message: 'Your order has been successfully delivered. We hope you love your purchase!',
        action: 'View Order'
      }
    };

    const statusInfo = statusMessages[status.toLowerCase()];
    if (!statusInfo) {
      return { success: false, error: 'Invalid status' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .order-info p { margin: 10px 0; }
          .order-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .status { display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>${statusInfo.message}</p>
            <div class="order-info">
              <p class="order-number">Order #${orderNumber}</p>
              <p><strong>Status:</strong> <span class="status">${status.toUpperCase()}</span></p>
              ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
            </div>
            <a href="http://localhost:5173/orders" class="button">${statusInfo.action}</a>
            <p>If you have any questions about your order, feel free to reach out to us.</p>
            <p>Best regards,<br>The Manya Closet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: statusInfo.subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status email sent to ${email} for order ${orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending order status email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send review notification email to admin
 */
export const sendReviewNotificationEmail = async (adminEmail, userName, userEmail, productName, rating, comment, orderNumber) => {
  try {
    const subject = `New Review Received - ${productName} (${rating}⭐)`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .review-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .rating { font-size: 24px; color: #fbbf24; margin: 10px 0; }
          .product-name { font-size: 20px; font-weight: bold; color: #667eea; margin: 10px 0; }
          .comment { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea; }
          .user-info { color: #6b7280; font-size: 14px; margin: 10px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Review Received</h1>
          </div>
          <div class="content">
            <h2>Admin Notification</h2>
            <p>A new review has been submitted for a product.</p>
            <div class="review-info">
              <p class="product-name">${productName}</p>
              <div class="rating">${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</div>
              <div class="user-info">
                <p><strong>Reviewed by:</strong> ${userName} (${userEmail})</p>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
              </div>
              ${comment ? `<div class="comment"><strong>Review:</strong><br>${comment}</div>` : '<p><em>No comment provided</em></p>'}
            </div>
            <p>You can view and manage reviews in the admin panel.</p>
            <a href="http://localhost:5173/admin/reviews" class="button">View All Reviews</a>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Review notification email sent to ${adminEmail} for review by ${userName}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending review notification email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send return status update email
 */
export const sendReturnStatusEmail = async (email, name, orderNumber, status, message = '') => {
  try {
    const statusMessages = {
      'requested': {
        subject: `Return Request Submitted - Order #${orderNumber}`,
        title: 'Return Request Received',
        message: 'Your return request has been received and is under review.',
        color: '#667eea'
      },
      'approved': {
        subject: `Return Request Approved - Order #${orderNumber}`,
        title: 'Return Request Approved',
        message: 'Your return request has been approved. We will schedule a pickup soon.',
        color: '#10b981'
      },
      'rejected': {
        subject: `Return Request Rejected - Order #${orderNumber}`,
        title: 'Return Request Rejected',
        message: message || 'Your return request has been rejected.',
        color: '#ef4444'
      },
      'picked_up': {
        subject: `Return Picked Up - Order #${orderNumber}`,
        title: 'Return Picked Up',
        message: 'Your return has been picked up and is being processed.',
        color: '#10b981'
      },
      'qc_passed': {
        subject: `Quality Check Passed - Order #${orderNumber}`,
        title: 'Quality Check Passed',
        message: 'Your return has passed quality check. Refund will be processed soon.',
        color: '#10b981'
      },
      'qc_failed': {
        subject: `Quality Check Failed - Order #${orderNumber}`,
        title: 'Quality Check Failed',
        message: message || 'Your return did not pass quality check.',
        color: '#ef4444'
      },
      'refunded': {
        subject: `Refund Processed - Order #${orderNumber}`,
        title: 'Refund Processed',
        message: message || 'Your refund has been processed successfully.',
        color: '#10b981'
      }
    };

    const statusInfo = statusMessages[status.toLowerCase()];
    if (!statusInfo) {
      return { success: false, error: 'Invalid return status' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${statusInfo.color}; }
          .order-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .status { display: inline-block; padding: 8px 16px; background: ${statusInfo.color}; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>${statusInfo.message}</p>
            ${message ? `<p>${message}</p>` : ''}
            <div class="status-info">
              <p class="order-number">Order #${orderNumber}</p>
              <p><strong>Status:</strong> <span class="status">${status.toUpperCase().replace('_', ' ')}</span></p>
            </div>
            <a href="http://localhost:5173/orders" class="button">View Orders</a>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>The Manya Closet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: statusInfo.subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Return status email sent to ${email} for order ${orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending return status email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send stock notification email when wishlist item is back in stock
 */
export const sendStockNotificationEmail = async (email, name, productName, productSlug, stockQuantity) => {
  try {
    const subject = `${productName} is Back in Stock!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .product-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981; }
          .product-name { font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0; }
          .stock-badge { display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; margin: 10px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Great News!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Good news! A product from your wishlist is back in stock.</p>
            <div class="product-info">
              <p class="product-name">${productName}</p>
              <p><span class="stock-badge">In Stock</span></p>
              <p><strong>Available Quantity:</strong> ${stockQuantity} ${stockQuantity === 1 ? 'item' : 'items'}</p>
            </div>
            <p>Hurry! This product might sell out quickly.</p>
            <a href="http://localhost:5173/product/${productSlug}" class="button">View Product</a>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>The Manya Closet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p><a href="#" style="color: #667eea;">Manage notification preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Manya Closet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Stock notification email sent to ${email} for product ${productName}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending stock notification email:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;
