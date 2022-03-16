import { Request, Response } from 'express';
import { ResponseAndStatus } from '../interfaces';
import * as loginService from '../services/loginService';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const userFinded: ResponseAndStatus = await loginService.login(email, password);
  res.status(userFinded.status).json(userFinded.response);
}

export async function validate(req: Request, res: Response): Promise<void> {
  const { authorization } = req.headers;
  const validateToken = await loginService.validate(authorization);
  res.status(validateToken.status).send(validateToken.response);
}
