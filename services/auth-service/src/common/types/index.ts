export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: Role;
}
