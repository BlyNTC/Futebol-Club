import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from './database/models/User';
import Match from './database/models/Match';
import Club from './database/models/Club';
import { ResponseMatchs, ResultMatch, ClubResult } from './interfaces';

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

export function awayMatch(match: Match): ResultMatch {
  const { homeTeamGoals, awayTeamGoals, inProgress } = match;
  let points = awayTeamGoals > homeTeamGoals ? 3 : 0;
  if (homeTeamGoals === awayTeamGoals) {
    points = 1;
  }
  return { points, goalsFavor: awayTeamGoals, goalsOwn: homeTeamGoals, inProgress };
}

export function homeMatch(match: Match): ResultMatch {
  const { homeTeamGoals, awayTeamGoals, inProgress } = match;
  let points = homeTeamGoals > awayTeamGoals ? 3 : 0;
  if (homeTeamGoals === awayTeamGoals) {
    points = 1;
  }
  return { points, goalsFavor: homeTeamGoals, goalsOwn: awayTeamGoals, inProgress };
}

export function makeMatchsResults(allClubAndMatchs:object[]): any[] {
  const matchsResults = allClubAndMatchs.map((clubMatch: any) => {
    const { id, clubName, matchHome, matchAway } = clubMatch;
    const resultHome: Match[] = matchHome.map((match: Match) => homeMatch(match));
    const resultAway: Match[] = matchAway.map((match: Match) => awayMatch(match));
    return { id, clubName, resultMatchs: [...resultHome, ...resultAway] };
  });
  console.log('matchsResults ====================>>>>>>>>>>', matchsResults[0]);

  return matchsResults;
}

export function makeHomeResults(allClubAndMatchs:object[]): any[] {
  const matchsResults = allClubAndMatchs.map((clubMatch: any) => {
    const { id, clubName, matchHome } = clubMatch;
    const resultHome: Match[] = matchHome.map((match: Match) => homeMatch(match));
    return { id, clubName, resultMatchs: resultHome };
  });
  console.log('makeHomeResults ====================>>>>>>>>>>', matchsResults[0]);

  return matchsResults;
}

export function makeAwayResults(allClubAndMatchs:object[]): any[] {
  const matchsResults = allClubAndMatchs.map((clubMatch: any) => {
    const { id, clubName, matchAway } = clubMatch;
    const resultAway: Match[] = matchAway.map((match: Match) => awayMatch(match));
    return { id, clubName, resultMatchs: resultAway };
  });
  console.log('makeAwayResults ====================>>>>>>>>>>', matchsResults[0]);

  return matchsResults;
}

const initialAcc = () => ({
  name: '',
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: 0,
});

export function makeResult(MatchsResult: any) {
  const { resultMatchs, clubName } = MatchsResult;
  const acc = initialAcc();
  resultMatchs.forEach((res: ResultMatch) => {
    const { points, goalsFavor, goalsOwn, inProgress } = res;
    if (!inProgress) {
      acc.name = clubName;
      acc.totalPoints += points;
      acc.totalGames += 1;
      acc.totalVictories += (points === 3 ? 1 : 0);
      acc.totalDraws += (points === 1 ? 1 : 0);
      acc.totalLosses += (points === 0 ? 1 : 0);
      acc.goalsFavor += goalsFavor;
      acc.goalsOwn += goalsOwn;
      acc.goalsBalance = acc.goalsFavor - acc.goalsOwn;
      acc.efficiency = Number(((acc.totalPoints / (acc.totalGames * 3)) * 100).toFixed(2));
    }
  });
  return acc;
}

// 1º Total de Vitórias; 2º Saldo de gols; 3º Gols a favor; 4º Gols contra.

export function orderLeaderBoard(leaderBoard: any) {
  return leaderBoard.sort((
    { totalPoints: ap, totalVictories: av, goalsBalance: agb, goalsFavor: agf, goalsOwn: ago }
    :ClubResult,
    { totalPoints: bp, totalVictories: bv, goalsBalance: bsg, goalsFavor: bgf, goalsOwn: bgo }
    :ClubResult,
  ) => {
    if (ap !== bp) return bp - ap;
    if (av !== bv) return bv - av;
    if (agb !== bsg) return bsg - agb;
    if (agf !== bgf) return bgf - agf;
    if (ago !== bgo) return bgo - ago;
    return 0;
  });
}
