import PDFDocument from 'pdfkit';
import Order from '../models/Order.js';

/**
 * Generate PDF invoice for an order
 * @param {Object} order - Order document with populated fields
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateInvoicePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('MANYA CLOSET', 50, 50, { align: 'center' })
        .fontSize(12)
        .font('Helvetica')
        .text('Invoice', 50, 80, { align: 'center' })
        .moveDown(2);

      // Invoice details
      doc
        .fontSize(10)
        .text(`Invoice Number: ${order.orderNumber}`, 50, 120)
        .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`, 50, 135)
        .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`, 50, 150);

      // Billing Address
      const billingAddress = order.billingAddress;
      if (billingAddress) {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('Bill To:', 350, 120)
          .font('Helvetica')
          .text(billingAddress.fullName || '', 350, 135)
          .text(billingAddress.addressLine1 || '', 350, 150)
          .text(billingAddress.addressLine2 || '', 350, 165)
          .text(`${billingAddress.city || ''}, ${billingAddress.state || ''} ${billingAddress.postalCode || ''}`, 350, 180)
          .text(billingAddress.country || '', 350, 195);
      }

      // Shipping Address
      const shippingAddress = order.shippingAddress;
      if (shippingAddress && shippingAddress._id.toString() !== billingAddress?._id?.toString()) {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('Ship To:', 350, 220)
          .font('Helvetica')
          .text(shippingAddress.fullName || '', 350, 235)
          .text(shippingAddress.addressLine1 || '', 350, 250)
          .text(shippingAddress.addressLine2 || '', 350, 265)
          .text(`${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}`, 350, 280)
          .text(shippingAddress.country || '', 350, 295);
      }

      // Order Items Table
      let yPosition = 250;
      if (shippingAddress && shippingAddress._id.toString() !== billingAddress?._id?.toString()) {
        yPosition = 320;
      }

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, yPosition)
        .text('Quantity', 300, yPosition)
        .text('Price', 400, yPosition)
        .text('Total', 500, yPosition)
        .moveTo(50, yPosition + 15)
        .lineTo(550, yPosition + 15)
        .stroke();

      yPosition += 25;

      // Order Items
      order.items.forEach((item) => {
        const itemName = item.name || item.product?.name || 'Product';
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const total = item.total || (price * quantity);

        doc
          .fontSize(9)
          .font('Helvetica')
          .text(itemName.substring(0, 40), 50, yPosition, { width: 240 })
          .text(quantity.toString(), 300, yPosition)
          .text(`₹${price.toFixed(2)}`, 400, yPosition)
          .text(`₹${total.toFixed(2)}`, 500, yPosition);

        yPosition += 20;
      });

      // Totals
      yPosition += 10;
      doc
        .moveTo(50, yPosition)
        .lineTo(550, yPosition)
        .stroke();

      yPosition += 15;

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', 400, yPosition)
        .text(`₹${order.subtotal?.toFixed(2) || '0.00'}`, 500, yPosition);

      if (order.shippingCost > 0) {
        yPosition += 15;
        doc
          .text('Shipping:', 400, yPosition)
          .text(`₹${order.shippingCost.toFixed(2)}`, 500, yPosition);
      }

      if (order.tax > 0) {
        yPosition += 15;
        doc
          .text('Tax:', 400, yPosition)
          .text(`₹${order.tax.toFixed(2)}`, 500, yPosition);
      }

      if (order.discount > 0) {
        yPosition += 15;
        doc
          .text('Discount:', 400, yPosition)
          .text(`-₹${order.discount.toFixed(2)}`, 500, yPosition);
      }

      yPosition += 15;
      doc
        .moveTo(400, yPosition)
        .lineTo(550, yPosition)
        .stroke();

      yPosition += 15;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total:', 400, yPosition)
        .text(`₹${order.totalAmount?.toFixed(2) || '0.00'}`, 500, yPosition);

      // Payment Status
      yPosition += 30;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Payment Status:', 50, yPosition)
        .font('Helvetica')
        .text(order.paymentStatus?.toUpperCase() || 'PENDING', 150, yPosition);

      // Order Status
      yPosition += 15;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Order Status:', 50, yPosition)
        .font('Helvetica')
        .text(order.status?.toUpperCase() || 'PENDING', 150, yPosition);

      // Tracking Number
      if (order.trackingNumber) {
        yPosition += 15;
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('Tracking Number:', 50, yPosition)
          .font('Helvetica')
          .text(order.trackingNumber, 150, yPosition);
      }

      // Footer
      const pageHeight = doc.page.height;
      doc
        .fontSize(8)
        .font('Helvetica')
        .text('Thank you for your business!', 50, pageHeight - 50, { align: 'center' })
        .text('For any queries, please contact us at support@manyacloset.com', 50, pageHeight - 35, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

