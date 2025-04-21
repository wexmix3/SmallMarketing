import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes of our Pick model
interface PickAttributes {
  id: string;
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  betType: 'moneyline' | 'spread' | 'over_under';
  betSelection: 'home' | 'away' | 'over' | 'under';
  odds: number;
  prediction: string;
  confidence: number;
  reasoning: string;
  dateCreated: Date;
  result?: 'win' | 'loss' | 'push' | 'pending';
  tweetId?: string;
}

// Define the attributes that can be null when creating a new Pick
interface PickCreationAttributes extends Optional<PickAttributes, 'result' | 'tweetId'> {}

// Define the Pick model
class Pick extends Model<PickAttributes, PickCreationAttributes> implements PickAttributes {
  public id!: string;
  public gameId!: number;
  public homeTeam!: string;
  public awayTeam!: string;
  public betType!: 'moneyline' | 'spread' | 'over_under';
  public betSelection!: 'home' | 'away' | 'over' | 'under';
  public odds!: number;
  public prediction!: string;
  public confidence!: number;
  public reasoning!: string;
  public dateCreated!: Date;
  public result?: 'win' | 'loss' | 'push' | 'pending';
  public tweetId?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Pick.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    homeTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    awayTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    betType: {
      type: DataTypes.ENUM('moneyline', 'spread', 'over_under'),
      allowNull: false,
    },
    betSelection: {
      type: DataTypes.ENUM('home', 'away', 'over', 'under'),
      allowNull: false,
    },
    odds: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    prediction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    result: {
      type: DataTypes.ENUM('win', 'loss', 'push', 'pending'),
      allowNull: false,
      defaultValue: 'pending',
    },
    tweetId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'picks',
    timestamps: true,
  }
);

export default Pick;
