import * as jwt from 'jsonwebtoken';

const jwtSecret = 'super_senha';

export async function createToken(payload: any) {
  const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: '7d' });
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