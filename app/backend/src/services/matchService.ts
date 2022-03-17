import { Request } from 'express';
import Match from '../database/models/Match';
import { ResponseAndStatus } from '../interfaces';
import { getAllMatchs, getAllMatchsFiltered, camelCaseConvert } from '../utils';

export async function getAll(query: any) {
  console.log('QUERY ============>>>>>>>>>>', query.inProgress !== undefined);

  if (query.inProgress !== undefined) {
    const inProgress = query.inProgress === 'true';
    const allMatchs = await getAllMatchsFiltered(inProgress);
    const response = allMatchs.response.map((match) => camelCaseConvert(match));
    return { response, status: allMatchs.status };
  }
  const allMatchs = await getAllMatchs();
  const response = allMatchs.response.map((match) => camelCaseConvert(match));
  return { response, status: allMatchs.status };
}

export async function getbyId(id: number | string) {
  console.log('--------------------------'
  + '------------------------------------', typeof id !== 'number');
  console.log(`ID ========================>>>>>>>  ${id}`);

  if (typeof id !== 'number') {
    return { response: { message: 'id must be a number' }, status: 403 };
  }
  const MatchsFinded: Match | null = await Match.findOne({ raw: true, where: { id } });
  if (!MatchsFinded) {
    return { response: { message: 'not found' }, status: 404 };
  }
  return { response: MatchsFinded, status: 200 };
}

export async function createMatch(req: Request): Promise<ResponseAndStatus> {
  return { response: req.body, status: 200 };
}
