export interface PricingRule {
  pricingRuleId: number;
  name?: string;
  description?: string;
  minimumPrice: number;
  maximumPrice: number;
  occupancyPercentage1: number;
  occupancyPercentage2: number;
  occupancyThreshold1: number;
  occupancyThreshold2: number;
  earlyBirdPercentage: number;
  dynamicCondition?: string;
  modifier: number;
}

export interface CreatePricingRuleDto {
  name?: string;
  description?: string;
  minimumPrice: number;
  maximumPrice: number;
  occupancyPercentage1: number;
  occupancyPercentage2: number;
  occupancyThreshold1: number;
  occupancyThreshold2: number;
  earlyBirdPercentage: number;
  dynamicCondition?: string;
  modifier: number;
}

const API_BASE_URL = 'https://localhost:7050/api/PricingRule';

export const pricingRuleService = {
  // Get all pricing rules
  getAllPricingRules: async (): Promise<PricingRule[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      throw error;
    }
  },

  // Get pricing rule by ID
  getPricingRuleById: async (id: number): Promise<PricingRule> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pricing rule not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pricing rule:', error);
      throw error;
    }
  },

  // Create new pricing rule
  createPricingRule: async (pricingRule: CreatePricingRuleDto): Promise<PricingRule> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingRule),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating pricing rule:', error);
      throw error;
    }
  },

  // Update pricing rule
  updatePricingRule: async (id: number, pricingRule: PricingRule): Promise<PricingRule> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingRule),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pricing rule not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating pricing rule:', error);
      throw error;
    }
  },

  // Delete pricing rule
  deletePricingRule: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pricing rule not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      throw error;
    }
  },
};