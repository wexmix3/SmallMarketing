import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes of our Team model
interface TeamAttributes {
  id: number;
  name: string;
  abbreviation: string;
  location: string;
  conference: string;
  division: string;
  wins: number;
  losses: number;
  winPercentage: number;
  pointsPerGame: number;
  pointsAllowedPerGame: number;
  homeAdvantage: number;
}

// Define the Team model
class Team extends Model<TeamAttributes> implements TeamAttributes {
  public id!: number;
  public name!: string;
  public abbreviation!: string;
  public location!: string;
  public conference!: string;
  public division!: string;
  public wins!: number;
  public losses!: number;
  public winPercentage!: number;
  public pointsPerGame!: number;
  public pointsAllowedPerGame!: number;
  public homeAdvantage!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false, // We'll use the ID from the sports data API
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    losses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    winPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pointsPerGame: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pointsAllowedPerGame: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    homeAdvantage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 3.5, // Default home court advantage in points
    },
  },
  {
    sequelize,
    tableName: 'teams',
    timestamps: true,
  }
);

export default Team;
