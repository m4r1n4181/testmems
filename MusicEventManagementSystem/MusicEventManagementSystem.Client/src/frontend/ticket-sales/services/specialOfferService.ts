export interface SpecialOffer {
  specialOfferId: number;
  name?: string;
  description?: string;
  offerType?: string;
  startDate: Date;
  endDate: Date;
  applicationCondition?: string;
  discountValue: number;
  ticketLimit: number;
}

export interface CreateSpecialOfferDto {
  name?: string;
  description?: string;
  offerType?: string;
  startDate: Date;
  endDate: Date;
  applicationCondition?: string;
  discountValue: number;
  ticketLimit: number;
}

const API_BASE_URL = 'https://localhost:7050/api/SpecialOffer';

export const specialOfferService = {
  // Get all special offers
  getAllSpecialOffers: async (): Promise<SpecialOffer[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Convert date strings to Date objects
      return data.map((offer: any) => ({
        ...offer,
        startDate: new Date(offer.startDate),
        endDate: new Date(offer.endDate)
      }));
    } catch (error) {
      console.error('Error fetching special offers:', error);
      throw error;
    }
  },

  // Get special offer by ID
  getSpecialOfferById: async (id: number): Promise<SpecialOffer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Special offer not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      };
    } catch (error) {
      console.error('Error fetching special offer:', error);
      throw error;
    }
  },

  // Create new special offer
  createSpecialOffer: async (specialOffer: CreateSpecialOfferDto): Promise<SpecialOffer> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...specialOffer,
          startDate: specialOffer.startDate.toISOString(),
          endDate: specialOffer.endDate.toISOString()
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      };
    } catch (error) {
      console.error('Error creating special offer:', error);
      throw error;
    }
  },

  // Update special offer
  updateSpecialOffer: async (id: number, specialOffer: SpecialOffer): Promise<SpecialOffer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...specialOffer,
          startDate: specialOffer.startDate.toISOString(),
          endDate: specialOffer.endDate.toISOString()
        }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Special offer not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      };
    } catch (error) {
      console.error('Error updating special offer:', error);
      throw error;
    }
  },

  // Delete special offer
  deleteSpecialOffer: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Special offer not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting special offer:', error);
      throw error;
    }
  },
};