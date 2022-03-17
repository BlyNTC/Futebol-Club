import Club from '../database/models/Club';
import Match from '../database/models/Match';
// import { ResponseAndStatus } from '../interfaces';

export async function getAll(query: any) {
  if (query) {
    const inProgress = query.inProgress === 'true';
    const allMatchs: Match[] = await Match.findAll({
      where: { in_progress: inProgress },
      include: [
        { model: Club, as: 'awayClub', attributes: [['club_name', 'clubName']] },
        { model: Club, as: 'homeClub', attributes: [['club_name', 'clubName']] },
      ] });
    return { response: allMatchs, status: 200 };
  }
  const allMatchs: Match[] = await Match.findAll({
    include: [
      { model: Club, as: 'awayClub', attributes: [['club_name', 'clubName']] },
      { model: Club, as: 'homeClub', attributes: [['club_name', 'clubName']] },
    ] });
  return { response: allMatchs, status: 200 };
}

export async function getbyId(id: number | string) {
  console.log('---------------------------'
  + '--------------------------------------', typeof id !== 'number');
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

// export async function createMatch(reqBody): ResponseAndStatus {
//   return { response:  , status: 200 }
// }
