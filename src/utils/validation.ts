/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
};

/**
 * Validate and sanitize name input
 */
export const validateName = (
  name: string
): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Name must be less than 50 characters' };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { valid: true };
};

/**
 * Validate email input
 */
export const validateEmail = (
  email: string
): { valid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 100) {
    return { valid: false, error: 'Email must be less than 100 characters' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please provide a valid email address' };
  }

  return { valid: true };
};

/**
 * Validate password input
 */
export const validatePassword = (
  password: string
): { valid: boolean; error?: string } => {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      error:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  return { valid: true };
};

/**
 * Validate age input
 */
export const validateAge = (
  age: string | number | undefined
): { valid: boolean; value?: number; error?: string } => {
  if (age === undefined || age === null || age === '') {
    return { valid: true }; // Age is optional
  }

  const numAge = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(numAge)) {
    return { valid: false, error: 'Age must be a valid number' };
  }

  if (numAge < 0) {
    return { valid: false, error: 'Age cannot be negative' };
  }

  if (numAge > 150) {
    return { valid: false, error: 'Age must be less than 150' };
  }

  if (!Number.isInteger(numAge)) {
    return { valid: false, error: 'Age must be a whole number' };
  }

  return { valid: true, value: numAge };
};

/**
 * Sanitize number input
 */
export const sanitizeNumber = (input: string | number): number | undefined => {
  if (input === undefined || input === null || input === '') {
    return undefined;
  }

  const num = typeof input === 'string' ? parseInt(input, 10) : input;

  if (isNaN(num)) {
    return undefined;
  }

  return num;
};
