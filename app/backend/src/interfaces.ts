import User from './database/models/User';

export interface LoginRequest {
  email: string,
  password: string,
}

export interface UserFounded extends User {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com'
}

export interface ResponseAndStatus {
  response: any,
  status: number,
}

export interface ClubName {
  clubName: string
}

export interface ResultMatch {
  name?: string,
  points: number,
  goalsFavor: number,
  goalsOwn: number,
  inProgress: boolean,
}

export interface MatchData {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface MatchsResulsInt {
  id: number,
  clubName: string,
  resultMatchs: ResultMatch[]
}

export interface ClubMatch {
  id: number,
  clubName: string,
  points: number,
  matchHome: MatchData[],
  matchAway: MatchData[],
  inProgress: boolean,
}

export interface ResponseMatchs {
  id: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: number;
  homeClub: ClubName;
  awayClub: ClubName;
}

export interface ClubResult {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number,
}
