/**
 * Pricing Service
 * Handles pricing tiers and usage tracking
 */

// Define pricing tiers
const PricingTier = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium'
};

// Define tier limits
const TierLimits = {
  [PricingTier.BASIC]: {
    monthlyPrice: 29,
    maxInteractions: 500,
    maxKnowledgeBaseItems: 100,
    features: {
      customization: true,
      analytics: true,
      multiPlatform: false,
      appointmentScheduling: false,
      productCatalog: false,
      advancedAnalytics: false
    }
  },
  [PricingTier.STANDARD]: {
    monthlyPrice: 59,
    maxInteractions: 2000,
    maxKnowledgeBaseItems: 500,
    features: {
      customization: true,
      analytics: true,
      multiPlatform: true,
      appointmentScheduling: true,
      productCatalog: true,
      advancedAnalytics: false
    }
  },
  [PricingTier.PREMIUM]: {
    monthlyPrice: 99,
    maxInteractions: 5000,
    maxKnowledgeBaseItems: 1000,
    features: {
      customization: true,
      analytics: true,
      multiPlatform: true,
      appointmentScheduling: true,
      productCatalog: true,
      advancedAnalytics: true
    }
  }
};

class PricingService {
  /**
   * Check if a feature is available for a tier
   * @param {string} tier - Pricing tier
   * @param {string} feature - Feature name
   * @returns {boolean} - Whether feature is available
   */
  isFeatureAvailable(tier, feature) {
    try {
      // Validate tier
      if (!Object.values(PricingTier).includes(tier)) {
        throw new Error(`Invalid tier: ${tier}`);
      }
      
      // Get tier limits
      const tierLimits = TierLimits[tier];
      
      // Check if feature exists
      if (!Object.prototype.hasOwnProperty.call(tierLimits.features, feature)) {
        throw new Error(`Unknown feature: ${feature}`);
      }
      
      // Return feature availability
      return tierLimits.features[feature];
    } catch (error) {
      console.error('Feature availability check error:', error);
      return false;
    }
  }
  
  /**
   * Check if usage is within tier limits
   * @param {string} tier - Pricing tier
   * @param {string} limitType - Type of limit to check
   * @param {number} currentUsage - Current usage
   * @returns {boolean} - Whether usage is within limits
   */
  isWithinLimits(tier, limitType, currentUsage) {
    try {
      // Validate tier
      if (!Object.values(PricingTier).includes(tier)) {
        throw new Error(`Invalid tier: ${tier}`);
      }
      
      // Get tier limits
      const tierLimits = TierLimits[tier];
      
      // Check limit type
      switch (limitType) {
        case 'interactions':
          return currentUsage <= tierLimits.maxInteractions;
        
        case 'knowledgeBaseItems':
          return currentUsage <= tierLimits.maxKnowledgeBaseItems;
        
        default:
          throw new Error(`Unknown limit type: ${limitType}`);
      }
    } catch (error) {
      console.error('Limit check error:', error);
      return false;
    }
  }
  
  /**
   * Get remaining usage for a tier
   * @param {string} tier - Pricing tier
   * @param {string} limitType - Type of limit to check
   * @param {number} currentUsage - Current usage
   * @returns {number} - Remaining usage
   */
  getRemainingUsage(tier, limitType, currentUsage) {
    try {
      // Validate tier
      if (!Object.values(PricingTier).includes(tier)) {
        throw new Error(`Invalid tier: ${tier}`);
      }
      
      // Get tier limits
      const tierLimits = TierLimits[tier];
      
      // Check limit type
      switch (limitType) {
        case 'interactions':
          return Math.max(0, tierLimits.maxInteractions - currentUsage);
        
        case 'knowledgeBaseItems':
          return Math.max(0, tierLimits.maxKnowledgeBaseItems - currentUsage);
        
        default:
          throw new Error(`Unknown limit type: ${limitType}`);
      }
    } catch (error) {
      console.error('Remaining usage calculation error:', error);
      return 0;
    }
  }
  
  /**
   * Get upgrade recommendations
   * @param {string} currentTier - Current pricing tier
   * @param {Object} usage - Current usage statistics
   * @returns {Object} - Upgrade recommendations
   */
  getUpgradeRecommendations(currentTier, usage) {
    try {
      // Validate tier
      if (!Object.values(PricingTier).includes(currentTier)) {
        throw new Error(`Invalid tier: ${currentTier}`);
      }
      
      // Get current tier limits
      const currentLimits = TierLimits[currentTier];
      
      // Check if upgrade is needed
      const recommendations = {
        shouldUpgrade: false,
        reasons: [],
        nextTier: null
      };
      
      // Check interactions usage
      if (usage.interactions > currentLimits.maxInteractions * 0.8) {
        recommendations.shouldUpgrade = true;
        recommendations.reasons.push(`You're using ${usage.interactions} out of ${currentLimits.maxInteractions} interactions (${Math.round(usage.interactions / currentLimits.maxInteractions * 100)}%).`);
      }
      
      // Check knowledge base items usage
      if (usage.knowledgeBaseItems > currentLimits.maxKnowledgeBaseItems * 0.8) {
        recommendations.shouldUpgrade = true;
        recommendations.reasons.push(`You're using ${usage.knowledgeBaseItems} out of ${currentLimits.maxKnowledgeBaseItems} knowledge base items (${Math.round(usage.knowledgeBaseItems / currentLimits.maxKnowledgeBaseItems * 100)}%).`);
      }
      
      // Check feature needs
      if (usage.featureNeeds) {
        for (const feature in usage.featureNeeds) {
          if (usage.featureNeeds[feature] && !currentLimits.features[feature]) {
            recommendations.shouldUpgrade = true;
            recommendations.reasons.push(`You need the ${feature} feature, which is not available in your current plan.`);
          }
        }
      }
      
      // Determine next tier
      if (recommendations.shouldUpgrade) {
        if (currentTier === PricingTier.BASIC) {
          recommendations.nextTier = PricingTier.STANDARD;
        } else if (currentTier === PricingTier.STANDARD) {
          recommendations.nextTier = PricingTier.PREMIUM;
        }
      }
      
      return recommendations;
    } catch (error) {
      console.error('Upgrade recommendations error:', error);
      return {
        shouldUpgrade: false,
        reasons: [],
        nextTier: null
      };
    }
  }
  
  /**
   * Get tier details
   * @param {string} tier - Pricing tier
   * @returns {Object} - Tier details
   */
  getTierDetails(tier) {
    try {
      // Validate tier
      if (!Object.values(PricingTier).includes(tier)) {
        throw new Error(`Invalid tier: ${tier}`);
      }
      
      // Return tier details
      return {
        name: tier.charAt(0).toUpperCase() + tier.slice(1),
        price: TierLimits[tier].monthlyPrice,
        maxInteractions: TierLimits[tier].maxInteractions,
        maxKnowledgeBaseItems: TierLimits[tier].maxKnowledgeBaseItems,
        features: { ...TierLimits[tier].features }
      };
    } catch (error) {
      console.error('Tier details error:', error);
      return null;
    }
  }
  
  /**
   * Get all tier details
   * @returns {Object} - All tier details
   */
  getAllTierDetails() {
    try {
      const tiers = {};
      
      // Get details for each tier
      Object.values(PricingTier).forEach(tier => {
        tiers[tier] = this.getTierDetails(tier);
      });
      
      return tiers;
    } catch (error) {
      console.error('All tier details error:', error);
      return {};
    }
  }
}

// Export pricing service and constants
export {
  PricingService,
  PricingTier,
  TierLimits
};
