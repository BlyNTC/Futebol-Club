import { Request, Response } from 'express';
import { ResponseAndStatus } from '../interfaces';
import * as clubService from '../services/clubService';

export async function getAll(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await clubService.getAll();
  res.status(userFinded.status).json(userFinded.response);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await clubService.getbyId(parseInt(req.params.id, 10));
  res.status(userFinded.status).json(userFinded.response);
}
