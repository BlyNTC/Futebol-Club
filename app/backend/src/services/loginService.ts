import User from '../database/models/User';
import { createToken, validateToken } from '../utils';

function validateUser(email:string, password: string): boolean {
  return !email || !password;
}

export async function login(email:string, password: string) {
  if (validateUser(email, password)) {
    return { response: { message: 'All fields must be filled' }, status: 401 };
  }
  const userFinded: User | null = await User.findOne({
    raw: true,
    where: { email, password },
    attributes: { exclude: ['password'] },
  });
  if (!userFinded) {
    return { response: { message: 'Incorrect email or password' }, status: 401 };
  }
  return { response: { user: userFinded, token: await createToken(userFinded) }, status: 200 };
}

export async function validate(token: any) {
  const tokenValidated = validateToken(token);
  console.log('VALIDATED TOKEN -----------------------', tokenValidated);

  if (!tokenValidated) {
    return { response: { message: 'token invalid' }, status: 401 };
  }
  const { role } = tokenValidated.payload;
  return { response: role, status: 200 };
}
