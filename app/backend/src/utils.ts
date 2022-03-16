import * as jwt from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';
import User from './database/models/User';

const jwtSecret = 'super_senha';

export async function verifyPassword(string: string | null, hash:string | null) {
  console.log('STRING ==========>>>', string, 'HASH =========>>', hash);
  return !bcrypt.compare(string || 'ffh', hash || 'asd');
}

export async function createToken(payload: any) {
  const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: '7d' });
  console.log('TOKEN ======================>>>', token);
  return token;
}

export function validateToken(token:string): any {
  try {
    jwt.verify(token, jwtSecret);
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return false;
  }
}

export async function createLoginResponse(userResponse: User): Promise<any> {
  const id = await userResponse.getDataValue('id');
  const email = await userResponse.getDataValue('email');
  const username = await userResponse.getDataValue('username');
  const role = await userResponse.getDataValue('role');
  const user = { id, email, username, role };
  const token = await createToken(user);
  return { user, token };
}
