import swaggerUi from 'swagger-ui-express';
import { swaggerPaths } from './swaggerPaths.js';

// Create Swagger specification
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Manya Closet E-Commerce API',
    version: '1.0.0',
    description: 'Complete API documentation for Manya Closet e-commerce platform. All APIs are documented with request/response schemas, authentication requirements, and examples.',
    contact: {
      name: 'API Support',
      email: 'support@manyacloset.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:8000/api',
      description: 'Development server'
    },
    {
      url: 'https://api.manyacloset.com/api',
      description: 'Production server'
    }
  ],
  paths: swaggerPaths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token'
      }
    },
    schemas: {
      // User Schemas
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'User ID'
          },
          name: {
            type: 'string',
            description: 'User full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          phone: {
            type: 'string',
            description: 'User phone number'
          },
          role: {
            type: 'string',
            enum: ['customer', 'admin'],
            description: 'User role'
          },
          avatar: {
            type: 'string',
            nullable: true,
            description: 'User avatar URL'
          },
          isEmailVerified: {
            type: 'boolean',
            description: 'Email verification status'
          },
          isActive: {
            type: 'boolean',
            description: 'Account active status'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      SignupRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100
          },
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 6
          },
          phone: {
            type: 'string'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string'
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User'
              },
              token: {
                type: 'string',
                description: 'JWT access token'
              },
              refreshToken: {
                type: 'string',
                description: 'JWT refresh token'
              }
            }
          }
        }
      },
      // Product Schemas
      Product: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          slug: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          shortDescription: {
            type: 'string'
          },
          category: {
            type: 'string',
            description: 'Category ID'
          },
          price: {
            type: 'number',
            format: 'float'
          },
          compareAtPrice: {
            type: 'number',
            format: 'float',
            nullable: true
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          gender: {
            type: 'string',
            enum: ['men', 'women', 'kids', 'unisex']
          },
          brand: {
            type: 'string',
            nullable: true
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          rating: {
            type: 'object',
            properties: {
              average: {
                type: 'number',
                format: 'float'
              },
              count: {
                type: 'integer'
              }
            }
          },
          isActive: {
            type: 'boolean'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Cart Schemas
      CartItem: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          product: {
            $ref: '#/components/schemas/Product'
          },
          quantity: {
            type: 'integer',
            minimum: 1
          },
          price: {
            type: 'number',
            format: 'float'
          }
        }
      },
      Cart: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          user: {
            type: 'string',
            description: 'User ID (optional for guest carts)'
          },
          sessionId: {
            type: 'string',
            description: 'Session ID (optional for authenticated users)'
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CartItem'
            }
          },
          totalAmount: {
            type: 'number',
            format: 'float'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Order Schemas
      OrderItem: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          product: {
            type: 'string',
            description: 'Product ID'
          },
          name: {
            type: 'string'
          },
          quantity: {
            type: 'integer'
          },
          price: {
            type: 'number',
            format: 'float'
          },
          total: {
            type: 'number',
            format: 'float'
          }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          orderNumber: {
            type: 'string'
          },
          user: {
            type: 'string',
            description: 'User ID'
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem'
            }
          },
          shippingAddress: {
            type: 'string',
            description: 'Address ID'
          },
          billingAddress: {
            type: 'string',
            description: 'Address ID'
          },
          subtotal: {
            type: 'number',
            format: 'float'
          },
          shippingCost: {
            type: 'number',
            format: 'float'
          },
          tax: {
            type: 'number',
            format: 'float'
          },
          discount: {
            type: 'number',
            format: 'float'
          },
          coupon: {
            type: 'object',
            properties: {
              code: {
                type: 'string'
              },
              discount: {
                type: 'number',
                format: 'float'
              }
            }
          },
          totalAmount: {
            type: 'number',
            format: 'float'
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
          },
          paymentStatus: {
            type: 'string',
            enum: ['pending', 'paid', 'failed', 'refunded']
          },
          payment: {
            type: 'string',
            description: 'Payment ID',
            nullable: true
          },
          trackingNumber: {
            type: 'string',
            nullable: true
          },
          returnRequest: {
            type: 'object',
            nullable: true,
            properties: {
              requestedAt: {
                type: 'string',
                format: 'date-time'
              },
              reason: {
                type: 'string'
              },
              status: {
                type: 'string',
                enum: ['pending', 'approved', 'rejected', 'completed']
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Payment Schemas
      Payment: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          order: {
            type: 'string',
            description: 'Order ID'
          },
          user: {
            type: 'string',
            description: 'User ID'
          },
          amount: {
            type: 'number',
            format: 'float'
          },
          currency: {
            type: 'string',
            default: 'INR'
          },
          method: {
            type: 'string',
            enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod', 'wallet', 'razorpay']
          },
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'completed', 'paid', 'failed', 'refunded', 'cancelled']
          },
          razorpayOrderId: {
            type: 'string',
            nullable: true
          },
          transactionId: {
            type: 'string',
            nullable: true
          },
          paymentGateway: {
            type: 'string',
            enum: ['razorpay', 'stripe', 'paypal', 'cod', null],
            nullable: true
          },
          refundAmount: {
            type: 'number',
            format: 'float',
            default: 0
          },
          refundedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true
          },
          paidAt: {
            type: 'string',
            format: 'date-time',
            nullable: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Review Schemas
      Review: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          user: {
            type: 'string',
            description: 'User ID'
          },
          product: {
            type: 'string',
            description: 'Product ID'
          },
          order: {
            type: 'string',
            description: 'Order ID'
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5
          },
          comment: {
            type: 'string'
          },
          isVerifiedPurchase: {
            type: 'boolean'
          },
          isApproved: {
            type: 'boolean'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Coupon Schemas
      Coupon: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          code: {
            type: 'string',
            description: 'Coupon code (uppercase)'
          },
          description: {
            type: 'string'
          },
          discountType: {
            type: 'string',
            enum: ['percentage', 'fixed']
          },
          discountValue: {
            type: 'number',
            format: 'float'
          },
          minimumPurchase: {
            type: 'number',
            format: 'float',
            default: 0
          },
          maximumDiscount: {
            type: 'number',
            format: 'float',
            nullable: true
          },
          validFrom: {
            type: 'string',
            format: 'date-time'
          },
          validUntil: {
            type: 'string',
            format: 'date-time'
          },
          usageLimit: {
            type: 'integer',
            nullable: true
          },
          usageCount: {
            type: 'integer',
            default: 0
          },
          perUserLimit: {
            type: 'integer',
            default: 1
          },
          isActive: {
            type: 'boolean',
            default: true
          },
          applicableCategories: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          applicableProducts: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          excludedCategories: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          excludedProducts: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Inventory Schemas
      Inventory: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          product: {
            type: 'string',
            description: 'Product ID'
          },
          quantity: {
            type: 'integer',
            minimum: 0
          },
          reservedQuantity: {
            type: 'integer',
            minimum: 0,
            default: 0
          },
          availableQuantity: {
            type: 'integer',
            description: 'Calculated: quantity - reservedQuantity'
          },
          lowStockThreshold: {
            type: 'integer',
            default: 10
          },
          isInStock: {
            type: 'boolean'
          },
          lastRestocked: {
            type: 'string',
            format: 'date-time',
            nullable: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Address Schemas
      Address: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          user: {
            type: 'string',
            description: 'User ID'
          },
          type: {
            type: 'string',
            enum: ['home', 'work', 'other'],
            default: 'home'
          },
          fullName: {
            type: 'string'
          },
          phone: {
            type: 'string'
          },
          addressLine1: {
            type: 'string'
          },
          addressLine2: {
            type: 'string',
            nullable: true
          },
          city: {
            type: 'string'
          },
          state: {
            type: 'string'
          },
          postalCode: {
            type: 'string'
          },
          country: {
            type: 'string',
            default: 'India'
          },
          isDefault: {
            type: 'boolean',
            default: false
          },
          isActive: {
            type: 'boolean',
            default: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Wishlist Schemas
      Wishlist: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          user: {
            type: 'string',
            description: 'User ID'
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: {
                  $ref: '#/components/schemas/Product'
                },
                addedAt: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Error Schemas
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            default: false
          },
          message: {
            type: 'string'
          },
          error: {
            type: 'string',
            nullable: true
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            default: true
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

export { swaggerSpec, swaggerUi };
