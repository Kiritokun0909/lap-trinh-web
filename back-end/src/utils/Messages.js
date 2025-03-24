module.exports = {
  // Error Messages
  ERROR: {
    EMAIL_ALREADY_IN_USE: { code: 1001, message: 'Email already in use' },
    EMAIL_NOT_FOUND: { code: 1002, message: 'Email not found' },
    EMAIL_REQUIRED: { code: 1003, message: 'Email is required' },
    USER_NOT_FOUND: { code: 1004, message: 'User not found' },
    INVALID_CREDENTIALS: { code: 1005, message: 'Invalid credentials' },
    INVALID_PASSWORD: { code: 1006, message: 'Invalid password' },
    INVALID_TOKEN: { code: 1007, message: 'Invalid token' },
    PASSWORDS_DO_NOT_MATCH: { code: 1008, message: 'Passwords do not match' },
    TOKEN_EXPIRED: { code: 2001, message: 'Token expired' },
    TOKEN_INVALID: { code: 2002, message: 'Invalid token' },
    TOKEN_REQUIRED: { code: 2003, message: 'Token is required' },
    REFRESH_TOKEN_REQUIRED: { code: 2004, message: 'Refresh token is required' },
    ACCESS_DENIED_NO_TOKEN: { code: 3001, message: 'Access denied. No token provided' },
    ACCESS_DENIED_NO_PERMISSION: {
      code: 3002,
      message: 'Access denied. You do not have permission to access this resource',
    },
    ACCOUNT_BLOCKED: { code: 3003, message: 'Account is blocked' },
    OTP_NOT_FOUND: { code: 3004, message: 'OTP not found' },
    OTP_NOT_MATCHED: { code: 3005, message: 'OTP not matched' },
    OTP_EXPIRED: { code: 3006, message: 'OTP expired' },
  },

  // Success Messages
  SUCCESS: {
    RESET_PASSWORD_SUCCESS: { code: 4001, message: 'Password reset successful' },
    RESET_ALL_PASSWORDS_SUCCESS: { code: 4002, message: 'All passwords reset successful' },
    REGISTER_SUCCESS: { code: 4003, message: 'User registered successfully' },
  },
};
