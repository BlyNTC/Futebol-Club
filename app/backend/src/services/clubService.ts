import Club from '../database/models/Club';

export async function getAll() {
  const allClubs: Club[] = await Club.findAll({ raw: true,
    attributes: ['id', ['club_name', 'clubName']] });
  return { response: allClubs, status: 200 };
}

export async function getbyId(id: number | string) {
  if (Number.isNaN(id)) {
    return { response: { message: 'id must be a number' }, status: 403 };
  }
  const clubsFinded: Club | null = await Club.findOne({ where: { id },
    attributes: ['id', ['club_name', 'clubName']] });
  if (!clubsFinded) {
    return { response: { message: 'not found' }, status: 404 };
  }
  return { response: clubsFinded, status: 200 };
}
