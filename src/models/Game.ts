import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes of our Game model
interface GameAttributes {
  id: number;
  date: string;
  time: string;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamScore?: number;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamScore?: number;
  venue: string;
  status: 'scheduled' | 'in_progress' | 'final';
  homeTeamMoneyline: number;
  awayTeamMoneyline: number;
  homeTeamSpread: number;
  homeTeamSpreadOdds: number;
  awayTeamSpreadOdds: number;
  overUnder: number;
  overOdds: number;
  underOdds: number;
}

// Define the attributes that can be null when creating a new Game
interface GameCreationAttributes extends Optional<GameAttributes, 'homeTeamScore' | 'awayTeamScore'> {}

// Define the Game model
class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: number;
  public date!: string;
  public time!: string;
  public homeTeamId!: number;
  public homeTeamName!: string;
  public homeTeamScore?: number;
  public awayTeamId!: number;
  public awayTeamName!: string;
  public awayTeamScore?: number;
  public venue!: string;
  public status!: 'scheduled' | 'in_progress' | 'final';
  public homeTeamMoneyline!: number;
  public awayTeamMoneyline!: number;
  public homeTeamSpread!: number;
  public homeTeamSpreadOdds!: number;
  public awayTeamSpreadOdds!: number;
  public overUnder!: number;
  public overOdds!: number;
  public underOdds!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false, // We'll use the ID from the sports data API
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    homeTeamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeTeamScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayTeamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    awayTeamScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'final'),
      allowNull: false,
    },
    homeTeamMoneyline: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    awayTeamMoneyline: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    homeTeamSpread: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    homeTeamSpreadOdds: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    awayTeamSpreadOdds: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    overUnder: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    overOdds: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    underOdds: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'games',
    timestamps: true,
  }
);

export default Game;
