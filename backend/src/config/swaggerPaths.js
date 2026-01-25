// Swagger API Paths Documentation
// This file contains all API endpoint definitions for Swagger documentation

export const swaggerPaths = {
  // ==================== AUTHENTICATION ====================
  '/api/auth/signup': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Create a new user account with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignupRequest'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login user',
      description: 'Authenticate user with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              }
            }
          }
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description: 'Get a new access token using refresh token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Token refreshed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      refreshToken: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Invalid refresh token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout user',
      description: 'Invalidate refresh token and logout user',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                refreshToken: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Logged out successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get current user',
      description: 'Get authenticated user information',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User information',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['Authentication'],
      summary: 'Update user profile',
      description: 'Update current user profile information',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                phone: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // ==================== PRODUCTS ====================
  '/api/products': {
    get: {
      tags: ['Products'],
      summary: 'Get all products',
      description: 'Get list of products with optional filtering and pagination',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        },
        {
          name: 'category',
          in: 'query',
          schema: { type: 'string' }
        },
        {
          name: 'gender',
          in: 'query',
          schema: { type: 'string', enum: ['men', 'women', 'kids', 'unisex'] }
        },
        {
          name: 'minPrice',
          in: 'query',
          schema: { type: 'number' }
        },
        {
          name: 'maxPrice',
          in: 'query',
          schema: { type: 'number' }
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'List of products',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      products: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Product'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Products'],
      summary: 'Create product (Admin)',
      description: 'Create a new product (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Product'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Product created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      product: {
                        $ref: '#/components/schemas/Product'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Get product by ID',
      description: 'Get detailed information about a specific product',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Product details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      product: {
                        $ref: '#/components/schemas/Product'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Product not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['Products'],
      summary: 'Update product (Admin)',
      description: 'Update product information (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Product'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Product updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      product: {
                        $ref: '#/components/schemas/Product'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete product (Admin)',
      description: 'Delete a product (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Product deleted successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // ==================== CART ====================
  '/api/cart': {
    get: {
      tags: ['Cart'],
      summary: 'Get cart',
      description: 'Get user cart or guest cart (requires sessionId header for guests)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'x-session-id',
          in: 'header',
          schema: { type: 'string' },
          description: 'Session ID for guest cart (optional)'
        }
      ],
      responses: {
        200: {
          description: 'Cart retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      cart: {
                        $ref: '#/components/schemas/Cart'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Cart'],
      summary: 'Clear cart',
      description: 'Remove all items from cart',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'x-session-id',
          in: 'header',
          schema: { type: 'string' },
          description: 'Session ID for guest cart (optional)'
        }
      ],
      responses: {
        200: {
          description: 'Cart cleared successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/cart/add': {
    post: {
      tags: ['Cart'],
      summary: 'Add item to cart',
      description: 'Add product to cart (supports both authenticated and guest users)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer', default: 1, minimum: 1 },
                sessionId: { type: 'string', description: 'For guest cart (optional)' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Item added to cart successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      cart: {
                        $ref: '#/components/schemas/Cart'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/cart/remove': {
    post: {
      tags: ['Cart'],
      summary: 'Remove item from cart or update quantity',
      description: 'Remove item from cart or update its quantity',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer', description: 'If provided, update quantity. If not, remove item' },
                sessionId: { type: 'string', description: 'For guest cart (optional)' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Cart updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      cart: {
                        $ref: '#/components/schemas/Cart'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/cart/merge': {
    post: {
      tags: ['Cart'],
      summary: 'Merge guest cart with user cart',
      description: 'Merge guest cart items into user cart on login',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['sessionId'],
              properties: {
                sessionId: { type: 'string', description: 'Guest cart session ID' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Cart merged successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      cart: {
                        $ref: '#/components/schemas/Cart'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  // ==================== CHECKOUT ====================
  '/api/checkout/summary': {
    get: {
      tags: ['Checkout'],
      summary: 'Get checkout summary',
      description: 'Get cart and addresses for checkout',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Checkout summary',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      cart: {
                        $ref: '#/components/schemas/Cart'
                      },
                      addresses: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Address'
                        }
                      },
                      summary: {
                        type: 'object',
                        properties: {
                          subtotal: { type: 'number' },
                          shippingFee: { type: 'number' },
                          taxAmount: { type: 'number' },
                          grandTotal: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/checkout': {
    post: {
      tags: ['Checkout'],
      summary: 'Create checkout order',
      description: 'Create order from cart items',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['shippingAddressId'],
              properties: {
                shippingAddressId: { type: 'string' },
                billingAddressId: { type: 'string', description: 'Optional, uses shipping address if not provided' },
                paymentMethod: { type: 'string', default: 'razorpay' },
                couponCode: { type: 'string', description: 'Optional coupon code' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Order created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      order: {
                        $ref: '#/components/schemas/Order'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // ==================== PAYMENTS ====================
  '/api/payment/create': {
    post: {
      tags: ['Payments'],
      summary: 'Create Razorpay payment order',
      description: 'Create Razorpay order for payment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['orderId'],
              properties: {
                orderId: { type: 'string', description: 'Order ID to pay for' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Payment order created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      orderId: { type: 'string', description: 'Razorpay order ID' },
                      amount: { type: 'number' },
                      currency: { type: 'string' },
                      key: { type: 'string', description: 'Razorpay key ID' },
                      paymentId: { type: 'string', description: 'Payment record ID' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/payment/create-order': {
    post: {
      tags: ['Payments'],
      summary: 'Create Razorpay payment order (alias)',
      description: 'Alias for /api/payment/create',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['orderId'],
              properties: {
                orderId: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Payment order created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      orderId: { type: 'string' },
                      amount: { type: 'number' },
                      currency: { type: 'string' },
                      key: { type: 'string' },
                      paymentId: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/payment/verify': {
    post: {
      tags: ['Payments'],
      summary: 'Verify payment (Webhook)',
      description: 'Verify Razorpay payment webhook or direct payment',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                razorpay_order_id: { type: 'string' },
                razorpay_payment_id: { type: 'string' },
                razorpay_signature: { type: 'string' },
                event: { type: 'string', description: 'Webhook event type' },
                payload: { type: 'object', description: 'Webhook payload' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Payment verified successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        400: {
          description: 'Invalid payment signature',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/payment/status/{orderId}': {
    get: {
      tags: ['Payments'],
      summary: 'Get payment status',
      description: 'Get payment status for an order',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Payment status',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      orderId: { type: 'string' },
                      orderNumber: { type: 'string' },
                      paymentStatus: { type: 'string' },
                      orderStatus: { type: 'string' },
                      payment: {
                        $ref: '#/components/schemas/Payment'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  // ==================== ORDERS ====================
  '/api/orders': {
    get: {
      tags: ['Orders'],
      summary: 'Get user orders',
      description: 'Get all orders for authenticated user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of orders',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      orders: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Order'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/orders/{orderId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get order by ID',
      description: 'Get detailed information about a specific order',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Order details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      order: {
                        $ref: '#/components/schemas/Order'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Order not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/orders/{orderId}/cancel': {
    post: {
      tags: ['Orders'],
      summary: 'Cancel order',
      description: 'Cancel an order (only for pending/confirmed/processing orders)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                reason: { type: 'string', description: 'Cancellation reason' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Order cancelled successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      order: {
                        $ref: '#/components/schemas/Order'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Order cannot be cancelled',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/orders/{orderId}/return': {
    post: {
      tags: ['Orders'],
      summary: 'Request return',
      description: 'Request return for a delivered order',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                reason: { type: 'string', description: 'Return reason' },
                items: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Array of item IDs to return'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Return request submitted',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        400: {
          description: 'Order cannot be returned',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/orders/{orderId}/invoice': {
    get: {
      tags: ['Orders'],
      summary: 'Download invoice PDF',
      description: 'Download invoice PDF for an order',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Invoice PDF',
          content: {
            'application/pdf': {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        },
        404: {
          description: 'Order not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // ==================== WISHLIST ====================
  '/api/wishlist': {
    get: {
      tags: ['Wishlist'],
      summary: 'Get wishlist',
      description: 'Get user wishlist',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Wishlist retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      wishlist: {
                        $ref: '#/components/schemas/Wishlist'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/wishlist/add': {
    post: {
      tags: ['Wishlist'],
      summary: 'Add to wishlist',
      description: 'Add product to wishlist',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId'],
              properties: {
                productId: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Product added to wishlist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/wishlist/remove': {
    delete: {
      tags: ['Wishlist'],
      summary: 'Remove from wishlist',
      description: 'Remove product from wishlist',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId'],
              properties: {
                productId: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Product removed from wishlist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/wishlist/check/{productId}': {
    get: {
      tags: ['Wishlist'],
      summary: 'Check if product is in wishlist',
      description: 'Check if a product is in user wishlist',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Wishlist check result',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      isInWishlist: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  // ==================== REVIEWS ====================
  '/api/reviews/{productId}': {
    get: {
      tags: ['Reviews'],
      summary: 'Get product reviews',
      description: 'Get all reviews for a product',
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        }
      ],
      responses: {
        200: {
          description: 'Product reviews',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      reviews: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Review'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/reviews': {
    post: {
      tags: ['Reviews'],
      summary: 'Create review',
      description: 'Create a review for a product (only for delivered orders)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['product', 'order', 'rating'],
              properties: {
                product: { type: 'string', description: 'Product ID' },
                order: { type: 'string', description: 'Order ID' },
                rating: { type: 'integer', minimum: 1, maximum: 5 },
                comment: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Review created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      review: {
                        $ref: '#/components/schemas/Review'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // ==================== COUPONS ====================
  '/api/coupons/apply': {
    post: {
      tags: ['Coupons'],
      summary: 'Apply coupon',
      description: 'Apply coupon code and calculate discount',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'subtotal'],
              properties: {
                code: { type: 'string', description: 'Coupon code' },
                subtotal: { type: 'number', description: 'Order subtotal' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Coupon applied successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      coupon: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string' },
                          code: { type: 'string' },
                          discountType: { type: 'string' },
                          discountValue: { type: 'number' },
                          maximumDiscount: { type: 'number' }
                        }
                      },
                      discount: { type: 'number' },
                      finalAmount: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid coupon or validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // ==================== ADMIN ROUTES ====================
  // Admin Orders
  '/api/admin/orders': {
    get: {
      tags: ['Admin - Orders'],
      summary: 'Get all orders (Admin)',
      description: 'Get all orders with filtering and pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        },
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
          }
        },
        {
          name: 'paymentStatus',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'paid', 'failed', 'refunded']
          }
        }
      ],
      responses: {
        200: {
          description: 'List of orders',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      orders: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Order'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/orders/{orderId}/status': {
    put: {
      tags: ['Admin - Orders'],
      summary: 'Update order status (Admin)',
      description: 'Update order status and tracking number',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
                },
                trackingNumber: { type: 'string', description: 'Optional tracking number' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Order status updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      order: {
                        $ref: '#/components/schemas/Order'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // Admin Products
  // (Already documented in Products section above)
  // Admin Inventory
  '/api/admin/inventory': {
    get: {
      tags: ['Admin - Inventory'],
      summary: 'Get all inventory (Admin)',
      description: 'Get inventory for all products',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        }
      ],
      responses: {
        200: {
          description: 'List of inventory',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      inventory: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Inventory'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/inventory/{productId}': {
    get: {
      tags: ['Admin - Inventory'],
      summary: 'Get product inventory (Admin)',
      description: 'Get inventory for a specific product',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Product inventory',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      inventory: {
                        $ref: '#/components/schemas/Inventory'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['Admin - Inventory'],
      summary: 'Update inventory (Admin)',
      description: 'Update inventory for a product',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                quantity: { type: 'integer', minimum: 0 },
                lowStockThreshold: { type: 'integer', minimum: 0 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Inventory updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      inventory: {
                        $ref: '#/components/schemas/Inventory'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  // Admin Users
  '/api/admin/users': {
    get: {
      tags: ['Admin - Users'],
      summary: 'Get all users (Admin)',
      description: 'Get all users with filtering and pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        },
        {
          name: 'role',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['customer', 'admin']
          }
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' }
        },
        {
          name: 'isActive',
          in: 'query',
          schema: { type: 'boolean' }
        }
      ],
      responses: {
        200: {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      users: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/users/{userId}': {
    get: {
      tags: ['Admin - Users'],
      summary: 'Get user by ID (Admin)',
      description: 'Get detailed information about a user',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'User details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // Admin Payments
  '/api/admin/payments': {
    get: {
      tags: ['Admin - Payments'],
      summary: 'Get all payments (Admin)',
      description: 'Get all payments with filtering and pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        },
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'processing', 'completed', 'paid', 'failed', 'refunded', 'cancelled']
          }
        },
        {
          name: 'method',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod', 'wallet', 'razorpay']
          }
        }
      ],
      responses: {
        200: {
          description: 'List of payments',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      payments: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Payment'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/payments/{paymentId}/refund': {
    post: {
      tags: ['Admin - Payments'],
      summary: 'Process refund (Admin)',
      description: 'Process full or partial refund for a payment',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'paymentId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                amount: { type: 'number', description: 'Refund amount (optional, defaults to full refund)' },
                reason: { type: 'string', description: 'Refund reason' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Refund processed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      payment: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string' },
                          amount: { type: 'number' },
                          refundAmount: { type: 'number' },
                          status: { type: 'string' },
                          refundedAt: { type: 'string', format: 'date-time' }
                        }
                      },
                      refund: {
                        type: 'object',
                        properties: {
                          amount: { type: 'number' },
                          refundId: { type: 'string', nullable: true },
                          reason: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // Admin Coupons
  '/api/admin/coupons': {
    get: {
      tags: ['Admin - Coupons'],
      summary: 'Get all coupons (Admin)',
      description: 'Get all coupons with filtering and pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' }
        },
        {
          name: 'isActive',
          in: 'query',
          schema: { type: 'boolean' }
        }
      ],
      responses: {
        200: {
          description: 'List of coupons',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      coupons: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Coupon'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Admin - Coupons'],
      summary: 'Create coupon (Admin)',
      description: 'Create a new coupon',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Coupon'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Coupon created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      coupon: {
                        $ref: '#/components/schemas/Coupon'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/coupons/{couponId}': {
    get: {
      tags: ['Admin - Coupons'],
      summary: 'Get coupon by ID (Admin)',
      description: 'Get detailed information about a coupon',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'couponId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Coupon details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      coupon: {
                        $ref: '#/components/schemas/Coupon'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Coupon not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['Admin - Coupons'],
      summary: 'Update coupon (Admin)',
      description: 'Update coupon information',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'couponId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Coupon'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Coupon updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      coupon: {
                        $ref: '#/components/schemas/Coupon'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Admin - Coupons'],
      summary: 'Delete coupon (Admin)',
      description: 'Delete a coupon',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'couponId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Coupon deleted successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  // Admin Reviews
  '/api/admin/reviews': {
    get: {
      tags: ['Admin - Reviews'],
      summary: 'Get all reviews (Admin)',
      description: 'Get all reviews with filtering and pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 }
        },
        {
          name: 'isApproved',
          in: 'query',
          schema: { type: 'boolean' }
        }
      ],
      responses: {
        200: {
          description: 'List of reviews',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      reviews: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Review'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        403: {
          description: 'Forbidden - Admin access required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  }
};

