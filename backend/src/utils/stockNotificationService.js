import Wishlist from '../models/Wishlist.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendStockNotificationEmail } from './emailService.js';

/**
 * Check stock for wishlist items and send notifications
 * This should be run periodically (e.g., via cron job)
 */
export const checkAndNotifyStockUpdates = async () => {
  try {
    console.log('Checking stock for wishlist items...');
    
    // Get all wishlists
    const wishlists = await Wishlist.find({})
      .populate('user', 'name email notificationPreferences')
      .populate('items.product', 'name images slug price');

    let notificationsSent = 0;

    for (const wishlist of wishlists) {
      // Check if user has stock alerts enabled
      if (!wishlist.user.notificationPreferences?.stockAlerts) {
        continue;
      }

      for (const item of wishlist.items) {
        const product = item.product;
        if (!product) continue;

        // Get inventory for this product
        const inventory = await Inventory.findOne({ product: product._id });
        
        if (!inventory) continue;

        // Check if product was out of stock before and is now in stock
        const wasOutOfStock = inventory.quantity === 0 || !inventory.isInStock;
        const isNowInStock = inventory.quantity > 0 && inventory.isInStock;

        if (wasOutOfStock && isNowInStock) {
          // Product is back in stock - send notification
          try {
            await sendStockNotificationEmail(
              wishlist.user.email,
              wishlist.user.name,
              product.name,
              product.slug || product._id.toString(),
              inventory.quantity
            );
            notificationsSent++;
            console.log(`Stock notification sent to ${wishlist.user.email} for product ${product.name}`);
          } catch (emailError) {
            console.error(`Error sending stock notification to ${wishlist.user.email}:`, emailError);
          }
        }
      }
    }

    console.log(`Stock check completed. ${notificationsSent} notifications sent.`);
    return { success: true, notificationsSent };
  } catch (error) {
    console.error('Error checking stock updates:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check stock for a specific product and notify users who have it in wishlist
 */
export const checkProductStockAndNotify = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
      return { success: false, error: 'Inventory not found' };
    }

    // Find all wishlists containing this product
    const wishlists = await Wishlist.find({
      'items.product': productId
    })
      .populate('user', 'name email notificationPreferences');

    let notificationsSent = 0;

    for (const wishlist of wishlists) {
      // Check if user has stock alerts enabled
      if (!wishlist.user.notificationPreferences?.stockAlerts) {
        continue;
      }

      // Check if product is now in stock
      if (inventory.quantity > 0 && inventory.isInStock) {
        try {
          await sendStockNotificationEmail(
            wishlist.user.email,
            wishlist.user.name,
            product.name,
            product.slug || product._id.toString(),
            inventory.quantity
          );
          notificationsSent++;
        } catch (emailError) {
          console.error(`Error sending stock notification to ${wishlist.user.email}:`, emailError);
        }
      }
    }

    return { success: true, notificationsSent };
  } catch (error) {
    console.error('Error checking product stock:', error);
    return { success: false, error: error.message };
  }
};

