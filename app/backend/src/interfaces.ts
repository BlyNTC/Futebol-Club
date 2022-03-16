import User from './database/models/User';

export interface LoginRequest {
  email: string,
  password: string,
}

export interface UserFounded extends User {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com'
}

export interface ResponseAndStatus {
  response: any,
  status: number,
}
