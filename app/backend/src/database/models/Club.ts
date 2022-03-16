import { Model, DataTypes } from 'sequelize';
import db from '.';

class Club extends Model {
  static associate(models: any) {
    Club.hasMany(models.Match, { foreignKey: 'id' });
  }
}

Club.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  club_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'Club',
  tableName: 'clubs',
  timestamps: false,
});

export default Club;
