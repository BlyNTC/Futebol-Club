import { Model, DataTypes } from 'sequelize';
import db from '.';
import Club from './Club';

class Match extends Model {
  public id: number;

  public homeTeam: number;

  public homeTeamGoals: number;

  public awayTeam: number;

  public awayTeamGoals: number;

  public inProgress: boolean;

  public dataValues: any;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeam: {
    field: 'home_team',
    type: DataTypes.INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'clubs',
      key: 'id',
    },
  },
  homeTeamGoals: {
    field: 'home_team_goals',
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeam: {
    field: 'away_team',
    type: DataTypes.INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'clubs',
      key: 'id',
    },
  },
  awayTeamGoals: {
    field: 'away_team_goals',
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    field: 'in_progress',
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Match',
  tableName: 'matchs',
  timestamps: false,
});

Match.belongsTo(Club, { foreignKey: 'home_team', targetKey: 'id', as: 'homeClub' });
Match.belongsTo(Club, { foreignKey: 'away_team', targetKey: 'id', as: 'awayClub' });

Club.hasMany(Match, { foreignKey: 'home_team', as: 'matchHome' });
Club.hasMany(Match, { foreignKey: 'away_team', as: 'matchAway' });

export default Match;
