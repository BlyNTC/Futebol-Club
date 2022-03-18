import { Request, Response } from 'express';
import { ResponseAndStatus } from '../interfaces';
import * as matchService from '../services/matchService';
// import { validateToken } from '../utils';

export async function getAll(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await matchService.getAll(req.query);
  console.log('REQ.QUERY ========================>>', req.query);
  res.status(userFinded.status).json(userFinded.response);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await matchService.getbyId(+req.params.id);
  res.status(userFinded.status).json(userFinded.response);
}

export async function createMatch(req: Request, res: Response): Promise<void> {
  const MatchCreated = await matchService.createMatch(req);
  res.status(MatchCreated.status).json(MatchCreated.response);
}

export async function finishMatch(req: Request, res: Response): Promise<void> {
  const userFinded: ResponseAndStatus = await matchService.finishMatch(+req.params.id);
  res.status(userFinded.status).json(userFinded.response);
}
