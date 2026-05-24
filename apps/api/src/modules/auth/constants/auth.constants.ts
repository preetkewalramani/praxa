export const AUTH_ACCESS_TOKEN_TTL = '15m';
export const AUTH_REFRESH_TOKEN_TTL_DAYS = 30;
export const AUTH_BCRYPT_ROUNDS = 12;
export const AUTH_AUDIT_ACTIONS = {
  loginFailure: 'LOGIN_FAILURE',
  loginSuccess: 'LOGIN_SUCCESS',
  logout: 'LOGOUT',
  sessionRevoked: 'SESSION_REVOKED',
  tokenRefresh: 'TOKEN_REFRESH',
} as const;
