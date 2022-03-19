import { Model, DataTypes } from 'sequelize';
import db from '.';

class Club extends Model {
  public dataValues: any;
}

Club.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  clubName: {
    field: 'club_name',
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
