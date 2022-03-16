import Match from '../database/models/Match';
import Club from '../database/models/Club';

export async function getAll() {
  const allMatchs: any[] = await Match.findAll({ include: Club });
  console.log('ALLMATCHS =====================>>>', allMatchs);
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
