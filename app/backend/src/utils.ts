import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from './database/models/User';
import Match from './database/models/Match';
import Club from './database/models/Club';
import { ResponseMatchs } from './interfaces';

const jwtSecret = 'super_senha';

export function validateUser(email:string, password: string): boolean {
  return !email || !password;
}

export async function verifyPassword(string: string | null, hash:string | null) {
  return !bcrypt.compare(string || 'asd', hash || 'asd');
}

export async function createToken(payload: any) {
  const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: '7d' });
  return token;
}

export function fixBody(reqBody: any) {
  const newBody = reqBody;

  const { awayTeam, homeTeam } = reqBody;
  if (awayTeam === 0) {
    newBody.awayTeam = 1;
  }
  if (homeTeam === 0) {
    newBody.homeTeam = 1;
  }
  return newBody;
}

export function validateToken(token:string | undefined): any {
  try {
    if (token === undefined) {
      throw new Error('deu ruim');
    }
    jwt.verify(token, jwtSecret);
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return false;
  }
}

export async function createLoginResponse(userResponse: User): Promise<any> {
  const { id, email, username, role } = userResponse;
  const user = { id, email, username, role };
  const token = await createToken(user);
  return { user, token };
}

export async function getAllMatchsFiltered(inProgress:boolean) {
  console.log('========= GETALLMATCHSFILTERED UTILS =========');

  const allMatchs: Match[] = await Match.findAll({
    where: { in_progress: inProgress },
    attributes: { exclude: ['home_team', 'away_team'] },
    include: [
      { model: Club,
        as: 'awayClub',
        attributes: [['club_name', 'clubName']] },
      { model: Club,
        as: 'homeClub',
        attributes: [['club_name', 'clubName']] },
    ] });
  return { response: allMatchs, status: 200 };
}

export async function getAllMatchs() {
  console.log('========= GETALLMATCHS UTILS =========');

  const allMatchs: Match[] = await Match.findAll({
    attributes: { exclude: ['home_team', 'away_team'] },
    include: [
      { model: Club,
        as: 'awayClub',
        attributes: [['club_name', 'clubName']] },
      { model: Club,
        as: 'homeClub',
        attributes: [['club_name', 'clubName']] },
    ] });
  return { response: allMatchs, status: 200 };
}

export function camelCaseConvert(match: any): ResponseMatchs {
  const { id, home_team: homeTeam, home_team_goals: homeTeamGoals,
    away_team: awayTeam, away_team_goals: awayTeamGoals,
    in_progress: inProgress, awayClub, homeClub } = match;
  return { id, homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress, homeClub, awayClub };
}

export function verifyDuplicateTeam(reqBody: any): boolean {
  const { homeTeam, awayTeam } = reqBody;
  return homeTeam === awayTeam;
}
export async function verifyClubExist(reqBody: any): Promise<boolean> {
  console.log('========= VERIFYCLUBEXIST UTILS =========');
  const clubs = await Club.findAll({
    raw: true,
    where: { id: { [Op.or]: [reqBody.awayTeam, reqBody.homeTeam] } },
  });
  console.log('FINDALL DOS TIMES', clubs.length === 2);

  return clubs.length !== 2;
}
