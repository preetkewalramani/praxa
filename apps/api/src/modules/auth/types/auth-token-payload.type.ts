export interface AuthTokenPayload {
  sub: string;
  firmId: string;
  email: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
  tokenVersion: 1;
}
