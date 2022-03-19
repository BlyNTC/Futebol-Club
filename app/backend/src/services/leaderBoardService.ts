import { makeHomeResults, makeAwayResults, makeMatchsResults,
  makeResult, orderLeaderBoard } from '../utils';
import Club from '../database/models/Club';
import Match from '../database/models/Match';
import { MatchsResulsInt } from '../interfaces';

export async function getHomeOrAway(home: boolean) {
  const homeOrAway = home ? 'matchHome' : 'matchAway';
  const allClubAndMatchs: Club[] = await Club.findAll({
    include:
    [
      { model: Match, as: homeOrAway, attributes: { exclude: ['home_team', 'away_team'] } },
    ],
  });

  const clubsData: object[] = allClubAndMatchs.map((club) => club.toJSON());
  console.log('CLUBS JSON  ====================>>>>>>>>', clubsData[1]);

  const matchsResults = home ? makeHomeResults(clubsData) : makeAwayResults(clubsData);
  const leaderboardData = matchsResults.map((result: MatchsResulsInt) => (
    makeResult(result)));

  const leaderBoardSorted = orderLeaderBoard(leaderboardData);

  console.log('RESULTADO DA MAÇAROCA =============>>>>', leaderboardData[0]);
  return { response: leaderBoardSorted, status: 200 };
}

export async function getAll() {
  const allClubAndMatchs: Club[] = await Club.findAll({
    include:
    [
      { model: Match, as: 'matchHome', attributes: { exclude: ['home_team', 'away_team'] } },
      { model: Match, as: 'matchAway', attributes: { exclude: ['home_team', 'away_team'] } },
    ],
  });

  const clubsData: object[] = allClubAndMatchs.map((club) => club.toJSON());
  console.log('CLUBS JSON  ====================>>>>>>>>', clubsData[1]);

  const matchsResults = makeMatchsResults(clubsData);
  const leaderboardData = matchsResults.map((result: MatchsResulsInt) => (
    makeResult(result)));

  const leaderBoardSorted = orderLeaderBoard(leaderboardData);

  console.log('RESULTADO DA MAÇAROCA =============>>>>', leaderboardData[0]);
  return { response: leaderBoardSorted, status: 200 };
}
/*
----------------------------------
      ESPERADO
    "name": "Palmeiras",
    "totalPoints": 13,
    "totalGames": 5,
    "totalVictories": 4,
    "totalDraws": 1,
    "totalLosses": 0,
    "goalsFavor": 17,
    "goalsOwn": 5,
    "goalsBalance": 12,
    "efficiency": 86.67
*/

export async function getbyId(id: number | string) {
  const leaderBoardsFinded: Club | null = await Club.findOne({ where: { id },
    attributes: ['id', ['leaderBoard_name', 'leaderBoardName']] });
  return { response: leaderBoardsFinded, status: 200 };
}
