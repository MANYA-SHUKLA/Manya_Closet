import { validate } from './validator.js';

// Validation rules for auth endpoints
export const validateSignup = validate({
  body: {
    name: {
      required: true,
      type: 'string',
      min: 2,
      max: 100,
      sanitize: 'string'
    },
    email: {
      required: true,
      type: 'email',
      sanitize: 'string'
    },
    password: {
      required: true,
      type: 'string',
      min: 6,
      max: 100,
      custom: (value) => {
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;
      }
    },
    phone: {
      required: false,
      type: 'string',
      max: 20,
      sanitize: 'string'
    }
  }
});

export const validateLogin = validate({
  body: {
    email: {
      required: true,
      type: 'email',
      sanitize: 'string'
    },
    password: {
      required: true,
      type: 'string'
    }
  }
});

