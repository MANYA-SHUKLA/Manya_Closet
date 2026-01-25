// Input validation and sanitization utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

export const sanitizeNumber = (num) => {
  if (typeof num === 'string') {
    const parsed = parseFloat(num);
    return isNaN(parsed) ? null : parsed;
  }
  return typeof num === 'number' ? num : null;
};

export const sanitizeInteger = (num) => {
  if (typeof num === 'string') {
    const parsed = parseInt(num, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return typeof num === 'number' && Number.isInteger(num) ? num : null;
};

// Validation middleware factory
export const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body, params, and query
    const sources = {
      body: req.body,
      params: req.params,
      query: req.query
    };

    for (const [source, fields] of Object.entries(rules)) {
      if (!sources[source]) continue;

      for (const [field, rules_list] of Object.entries(fields)) {
        const value = sources[source][field];

        // Required validation
        if (rules_list.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }

        // Skip other validations if field is optional and empty
        if (!rules_list.required && (value === undefined || value === null || value === '')) {
          continue;
        }

        // Type validation
        if (rules_list.type) {
          if (rules_list.type === 'email' && !validateEmail(value)) {
            errors.push(`${field} must be a valid email`);
          } else if (rules_list.type === 'number' && isNaN(Number(value))) {
            errors.push(`${field} must be a number`);
          } else if (rules_list.type === 'integer' && !Number.isInteger(Number(value))) {
            errors.push(`${field} must be an integer`);
          } else if (rules_list.type === 'string' && typeof value !== 'string') {
            errors.push(`${field} must be a string`);
          } else if (rules_list.type === 'boolean' && typeof value !== 'boolean') {
            errors.push(`${field} must be a boolean`);
          } else if (rules_list.type === 'array' && !Array.isArray(value)) {
            errors.push(`${field} must be an array`);
          }
        }

        // Min/Max validation
        if (rules_list.min !== undefined) {
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue < rules_list.min) {
            errors.push(`${field} must be at least ${rules_list.min}`);
          } else if (typeof value === 'string' && value.length < rules_list.min) {
            errors.push(`${field} must be at least ${rules_list.min} characters`);
          }
        }

        if (rules_list.max !== undefined) {
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue > rules_list.max) {
            errors.push(`${field} must be at most ${rules_list.max}`);
          } else if (typeof value === 'string' && value.length > rules_list.max) {
            errors.push(`${field} must be at most ${rules_list.max} characters`);
          }
        }

        // Custom validation
        if (rules_list.custom && typeof rules_list.custom === 'function') {
          const customError = rules_list.custom(value);
          if (customError) {
            errors.push(customError);
          }
        }

        // Sanitization
        if (rules_list.sanitize) {
          if (rules_list.sanitize === 'string') {
            sources[source][field] = sanitizeString(value);
          } else if (rules_list.sanitize === 'number') {
            sources[source][field] = sanitizeNumber(value);
          } else if (rules_list.sanitize === 'integer') {
            sources[source][field] = sanitizeInteger(value);
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

