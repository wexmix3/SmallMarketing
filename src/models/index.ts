import sequelize from '../config/database';
import Pick from './Pick';
import Game from './Game';
import Team from './Team';

// Define relationships between models
Game.hasMany(Pick, {
  foreignKey: 'gameId',
  as: 'picks',
});

Pick.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

// Function to sync all models with the database
export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing database:', error);
    return false;
  }
};

export { Pick, Game, Team };
