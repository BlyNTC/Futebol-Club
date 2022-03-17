import { Model, DataTypes } from 'sequelize';
import db from '.';
import Club from './Club';

class Match extends Model {
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  home_team: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'clubs',
      key: 'id',
    },
  },
  home_team_goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  away_team: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'clubs',
      key: 'id',
    },
  },
  away_team_goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  in_progress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'Match',
  tableName: 'matchs',
  timestamps: false,
});

Match.belongsTo(Club, { foreignKey: 'home_team', targetKey: 'id', as: 'homeClub' });
Match.belongsTo(Club, { foreignKey: 'away_team', targetKey: 'id', as: 'awayClub' });

export default Match;
