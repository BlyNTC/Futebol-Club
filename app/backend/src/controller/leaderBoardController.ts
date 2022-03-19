import { Request, Response } from 'express';
import { ResponseAndStatus } from '../interfaces';
import * as leaderBoardService from '../services/leaderBoardService';

export async function getHome(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await leaderBoardService.getHomeOrAway(true);
  res.status(userFinded.status).json(userFinded.response);
}

export async function getAway(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await leaderBoardService.getHomeOrAway(false);
  res.status(userFinded.status).json(userFinded.response);
}

export async function getAll(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await leaderBoardService.getAll();
  res.status(userFinded.status).json(userFinded.response);
}
