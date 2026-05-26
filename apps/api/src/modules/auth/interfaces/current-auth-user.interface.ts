export interface CurrentAuthUser {
  userId: string;
  firmId: string;
  email: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
}
