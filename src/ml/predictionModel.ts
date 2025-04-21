import * as tf from '@tensorflow/tfjs';
// Conditionally import tfjs-node if we're in a Node.js environment
if (typeof window === 'undefined') {
  // We're on the server
  try {
    require('@tensorflow/tfjs-node');
  } catch (e) {
    console.warn('Could not load @tensorflow/tfjs-node. Using CPU only.');
  }
}

import { Game, Team } from '../models';
import { Op } from 'sequelize';

/**
 * Machine Learning model for predicting game outcomes
 */
class PredictionModel {
  private model: tf.LayersModel | null = null;
  private isTraining: boolean = false;
  private lastTrainedDate: Date | null = null;
  
  constructor() {
    // Initialize the model
    this.initModel();
  }
  
  /**
   * Initialize the TensorFlow model
   */
  private async initModel() {
    try {
      // Try to load an existing model
      this.model = await this.loadModel();
      
      if (!this.model) {
        // Create a new model if none exists
        this.model = this.createModel();
        console.log('Created new prediction model');
      } else {
        console.log('Loaded existing prediction model');
        // Check when the model was last trained
        const modelInfo = await tf.io.listModels();
        const modelPath = Object.keys(modelInfo).find(path => path.includes('sports-prediction-model'));
        if (modelPath && modelInfo[modelPath].dateSaved) {
          this.lastTrainedDate = new Date(modelInfo[modelPath].dateSaved);
          console.log(`Model was last trained on ${this.lastTrainedDate.toLocaleString()}`);
        }
      }
    } catch (error) {
      console.error('Error initializing prediction model:', error);
      // Create a new model as fallback
      this.model = this.createModel();
      console.log('Created new prediction model (fallback)');
    }
  }
  
  /**
   * Create a new TensorFlow model
   */
  private createModel(): tf.LayersModel {
    const model = tf.sequential();
    
    // Input layer - features:
    // 1. Home team win percentage
    // 2. Away team win percentage
    // 3. Home team points per game
    // 4. Away team points per game
    // 5. Home team points allowed per game
    // 6. Away team points allowed per game
    // 7. Home court advantage (binary)
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      inputShape: [7]
    }));
    
    // Hidden layer
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    // Output layer - probability of home team winning
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }
  
  /**
   * Load a saved model from localStorage or IndexedDB
   */
  private async loadModel(): Promise<tf.LayersModel | null> {
    try {
      // Try to load the model from IndexedDB
      return await tf.loadLayersModel('indexeddb://sports-prediction-model');
    } catch (error) {
      console.warn('Could not load model from IndexedDB:', error);
      try {
        // Try to load from localStorage as fallback
        return await tf.loadLayersModel('localstorage://sports-prediction-model');
      } catch (error) {
        console.warn('Could not load model from localStorage:', error);
        return null;
      }
    }
  }
  
  /**
   * Save the model to localStorage or IndexedDB
   */
  private async saveModel() {
    if (!this.model) return;
    
    try {
      // Try to save to IndexedDB
      await this.model.save('indexeddb://sports-prediction-model');
      console.log('Model saved to IndexedDB');
    } catch (error) {
      console.warn('Could not save model to IndexedDB:', error);
      try {
        // Try to save to localStorage as fallback
        await this.model.save('localstorage://sports-prediction-model');
        console.log('Model saved to localStorage');
      } catch (error) {
        console.error('Could not save model:', error);
      }
    }
    
    // Update last trained date
    this.lastTrainedDate = new Date();
  }
  
  /**
   * Train the model using historical game data
   */
  async trainModel() {
    if (this.isTraining) {
      console.log('Model is already training');
      return;
    }
    
    this.isTraining = true;
    
    try {
      // Get historical game data from the database
      const games = await Game.findAll({
        where: {
          status: 'final',
          homeTeamScore: { [Op.ne]: null },
          awayTeamScore: { [Op.ne]: null }
        },
        limit: 1000, // Limit to 1000 games for performance
        order: [['date', 'DESC']]
      });
      
      if (games.length === 0) {
        console.warn('No historical game data available for training');
        this.isTraining = false;
        return;
      }
      
      console.log(`Training model with ${games.length} historical games`);
      
      // Prepare training data
      const trainingData = [];
      const trainingLabels = [];
      
      for (const game of games) {
        const gameData = game.toJSON();
        
        // Get team data
        const homeTeam = await Team.findByPk(gameData.homeTeamId);
        const awayTeam = await Team.findByPk(gameData.awayTeamId);
        
        if (!homeTeam || !awayTeam) continue;
        
        const homeTeamData = homeTeam.toJSON();
        const awayTeamData = awayTeam.toJSON();
        
        // Create feature vector
        const features = [
          homeTeamData.winPercentage,
          awayTeamData.winPercentage,
          homeTeamData.pointsPerGame,
          awayTeamData.pointsPerGame,
          homeTeamData.pointsAllowedPerGame,
          awayTeamData.pointsAllowedPerGame,
          1.0 // Home court advantage (always 1 for now)
        ];
        
        // Create label (1 if home team won, 0 if away team won)
        const homeTeamWon = gameData.homeTeamScore > gameData.awayTeamScore ? 1 : 0;
        
        trainingData.push(features);
        trainingLabels.push(homeTeamWon);
      }
      
      // Convert to tensors
      const xs = tf.tensor2d(trainingData);
      const ys = tf.tensor2d(trainingLabels, [trainingLabels.length, 1]);
      
      // Train the model
      await this.model?.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.acc?.toFixed(4)}`);
          }
        }
      });
      
      // Save the trained model
      await this.saveModel();
      
      // Clean up tensors
      xs.dispose();
      ys.dispose();
      
      console.log('Model training completed');
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      this.isTraining = false;
    }
  }
  
  /**
   * Predict the outcome of a game
   * @param homeTeam - Home team data
   * @param awayTeam - Away team data
   * @returns Probability of home team winning (0-1)
   */
  async predictGameOutcome(homeTeam: any, awayTeam: any): Promise<number> {
    if (!this.model) {
      console.warn('Model not initialized, using fallback prediction');
      return 0.5 + (Math.random() * 0.2 - 0.1); // Random value between 0.4 and 0.6
    }
    
    try {
      // Create feature vector
      const features = [
        homeTeam.winPercentage || homeTeam.winLoss?.winPercentage || 0.5,
        awayTeam.winPercentage || awayTeam.winLoss?.winPercentage || 0.5,
        homeTeam.pointsPerGame || homeTeam.stats?.pointsPerGame || 110,
        awayTeam.pointsPerGame || awayTeam.stats?.pointsPerGame || 110,
        homeTeam.pointsAllowedPerGame || homeTeam.stats?.pointsAllowedPerGame || 110,
        awayTeam.pointsAllowedPerGame || awayTeam.stats?.pointsAllowedPerGame || 110,
        1.0 // Home court advantage (always 1 for now)
      ];
      
      // Convert to tensor
      const xs = tf.tensor2d([features]);
      
      // Make prediction
      const prediction = this.model.predict(xs) as tf.Tensor;
      const result = await prediction.data();
      
      // Clean up tensors
      xs.dispose();
      prediction.dispose();
      
      return result[0];
    } catch (error) {
      console.error('Error making prediction:', error);
      return 0.5 + (Math.random() * 0.2 - 0.1); // Random value between 0.4 and 0.6
    }
  }
  
  /**
   * Check if the model needs training
   * @returns True if the model needs training
   */
  needsTraining(): boolean {
    // Train if never trained before
    if (!this.lastTrainedDate) return true;
    
    // Train if it's been more than 7 days since last training
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.lastTrainedDate < sevenDaysAgo;
  }
}

// Export a singleton instance
const predictionModel = new PredictionModel();
export default predictionModel;
