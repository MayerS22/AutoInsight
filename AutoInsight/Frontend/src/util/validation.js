export function isEmail(value) {
    return value.includes('@');
  }
  export function isEmailValid(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[cC][oO][mM]$/;
    return emailRegex.test(value);
  }
  export function isPasswordValid(value) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
    return passwordRegex.test(value)
  
  }
  
  export function isNotEmpty(value) {
    return value.trim() !== '';
  }
  
  export function hasMinLength(value, minLength) {
    return value.length >= minLength;
  }
  
  export function isEqualsToOtherValue(value, otherValue) {
    return value === otherValue;
  }