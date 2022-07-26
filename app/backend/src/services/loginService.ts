import User from '../database/models/User';
import { validateToken, verifyPassword, createLoginResponse, validateUser } from '../utils';

export async function login(email:string, password: string) {
  if (validateUser(email, password)) {
    return { response: { message: 'All fields must be filled' }, status: 401 };
  }
  const userFinded: User | null = await User.findOne({ where: { email }, raw: true });

  if (!userFinded) return { response: { message: 'Incorrect email or password' }, status: 401 };
  const passwordVerified = await verifyPassword(password, userFinded.password);
  if (passwordVerified) {
    return {
      response: { message: 'Incorrect email or password' }, status: 401,
    };
  }
  const response = await createLoginResponse(userFinded);
  return { response, status: 200 };
}

export async function validate(token: any) {
  const tokenValidated = validateToken(token);

  if (!tokenValidated) {
    return { response: { message: 'token invalid' }, status: 401 };
  }
  const { role } = tokenValidated.payload;
  return { response: role, status: 200 };
}
