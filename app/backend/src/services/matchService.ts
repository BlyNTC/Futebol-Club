import { Request } from 'express';
import Match from '../database/models/Match';
import { ResponseAndStatus } from '../interfaces';
import { getAllMatchs, getAllMatchsFiltered, verifyDuplicateTeam,
  verifyClubExist, fixBody } from '../utils';

export async function getAll(query: any) {
  if (query.inProgress !== undefined) {
    const inProgress = query.inProgress === 'true';
    const allMatchs = await getAllMatchsFiltered(inProgress);
    const { response } = allMatchs;
    return { response, status: allMatchs.status };
  }
  const allMatchs = await getAllMatchs();
  const { response } = allMatchs;
  return { response, status: allMatchs.status };
}

export async function getbyId(id: number | string) {
  if (Number.isNaN(id)) {
    return { response: { message: 'id must be a number' }, status: 403 };
  }
  const MatchsFinded: Match | null = await Match.findOne({ where: { id } });
  if (!MatchsFinded) {
    return { response: { message: 'not found' }, status: 404 };
  }
  return { response: MatchsFinded, status: 200 };
}

export async function createMatch(req: Request): Promise<ResponseAndStatus> {
  const newBody = fixBody(req.body);
  if (verifyDuplicateTeam(newBody)) {
    return { response: { message: 'It is not possible to create a match with two equal teams' },
      status: 401 };
  }
  const verifiedAwayAndHomeTeam = await verifyClubExist(newBody);
  if (verifiedAwayAndHomeTeam) {
    return { response: { message: 'There is no team with such id!' }, status: 401 };
  }
  const createdMatch = await Match.create(newBody);
  console.log('===== MATCH.CREATE =====');

  return { response: createdMatch, status: 201 };
}
export async function finishMatch(id: number | string) {
  const MatchsFinded = await Match.update({ inProgress: false }, { where: { id } });
  return { response: MatchsFinded, status: 200 };
}

export async function updateMatch(req: Request) {
  const { body, params: { id } } = req;
  if (!body.homeTeamGoals) {
    const updatedMatch = await Match.update({ inProgress: false }, { where: { id: +id } });
    return { response: updatedMatch, status: 200 };
  }
  const updatedMatch = await Match.update(body, { where: { id: +id } });
  return { response: updatedMatch, status: 200 };
}
