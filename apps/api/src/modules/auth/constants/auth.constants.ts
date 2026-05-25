export const AUTH_ACCESS_TOKEN_TTL = '15m';
export const AUTH_REFRESH_TOKEN_TTL_DAYS = 30;
export const AUTH_BCRYPT_ROUNDS = 12;
export const AUTH_PERMISSION_CACHE_TTL_SECONDS = 300;

export const AUTH_AUDIT_ACTIONS = {
  loginFailure: 'LOGIN_FAILURE',
  loginSuccess: 'LOGIN_SUCCESS',
  logout: 'LOGOUT',
  roleAssigned: 'ROLE_ASSIGNED',
  roleRemoved: 'ROLE_REMOVED',
  sessionRevoked: 'SESSION_REVOKED',
  tokenRefresh: 'TOKEN_REFRESH',
  tokenReplayDetected: 'TOKEN_REPLAY_DETECTED',
} as const;
