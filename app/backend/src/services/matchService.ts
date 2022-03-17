import { Request } from 'express';
import Match from '../database/models/Match';
import { ResponseAndStatus } from '../interfaces';
import { getAllMatchs, getAllMatchsFiltered, camelCaseConvert,
  validateToken, verifyDuplicateTeam, verifyClubExist } from '../utils';

export async function getAll(query: any) {
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
  const tokenValidate = validateToken(req.headers.authorization);
  if (!tokenValidate) {
    return { response: { message: 'token not found' }, status: 401 };
  }
  if (verifyDuplicateTeam(req.body)) {
    return { response:
      { message: 'It is not possible to create a match with two equal teams' },
    status: 200 };
  }
  if ((await verifyClubExist(req.body)).length !== 2) {
    return { response: { message: 'Team not found' }, status: 401 };
  }
  const createdMatch = await Match.create(req.body);
  console.log(createdMatch);
  return { response: createdMatch, status: 200 };
}
