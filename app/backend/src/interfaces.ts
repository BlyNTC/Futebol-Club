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
