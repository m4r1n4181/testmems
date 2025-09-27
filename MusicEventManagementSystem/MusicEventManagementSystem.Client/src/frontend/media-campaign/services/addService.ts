import type { Ad } from '../types/api/ad';
import type { CreateAdForm, UpdateAdForm } from '../types/form/ad';
import { AdStatus } from '../types/enums/MediaChampaign';

const API_BASE_URL = 'https://localhost:7050/api';

export class AdService {
  private static readonly BASE_URL = `${API_BASE_URL}/Ad`;

  // GET: api/Ad
  static async getAllAds(): Promise<Ad[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw new Error('Failed to fetch ads');
    }
  }

  // GET: api/Ad/{id}
  static async getAdById(id: number): Promise<Ad> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Ad with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ad ${id}:`, error);
      throw error;
    }
  }

  // POST: api/Ad
  static async createAd(createForm: CreateAdForm): Promise<Ad> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating ad:', error);
      throw new Error('Failed to create ad');
    }
  }

  // PUT: api/Ad/{id}
  static async updateAd(id: number, updateForm: UpdateAdForm): Promise<Ad> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Ad with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating ad ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/Ad/{id}
  static async deleteAd(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Ad with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting ad ${id}:`, error);
      throw error;
    }
  }

  // GET: api/Ad/deadline/{deadline}
  static async getByDeadline(deadline: Date): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/deadline/${deadline.toISOString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by deadline:', error);
      throw new Error('Failed to fetch ads by deadline');
    }
  }

  // GET: api/Ad/title/{title}
  static async getByTitle(title: string): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/title/${encodeURIComponent(title)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by title:', error);
      throw new Error('Failed to fetch ads by title');
    }
  }

  // GET: api/Ad/creationDate/{creationDate}
  static async getByCreationDate(creationDate: Date): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/creationDate/${creationDate.toISOString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by creation date:', error);
      throw new Error('Failed to fetch ads by creation date');
    }
  }

  // GET: api/Ad/currentPhase/{currentPhase}
  static async getByCurrentPhase(currentPhase: AdStatus): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/currentPhase/${currentPhase}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by current phase:', error);
      throw new Error('Failed to fetch ads by current phase');
    }
  }

  // GET: api/Ad/publicationDate/{publicationDate}
  static async getByPublicationDate(publicationDate: Date): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/publicationDate/${publicationDate.toISOString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by publication date:', error);
      throw new Error('Failed to fetch ads by publication date');
    }
  }

  // GET: api/Ad/mediaWorkflowId/{mediaWorkflowId}
  static async getByMediaWorkflowId(mediaWorkflowId: number): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/mediaWorkflowId/${mediaWorkflowId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by media workflow ID:', error);
      throw new Error('Failed to fetch ads by media workflow ID');
    }
  }

  // GET: api/Ad/campaignId/{campaignId}
  static async getByCampaignId(campaignId: number): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/campaignId/${campaignId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by campaign ID:', error);
      throw new Error('Failed to fetch ads by campaign ID');
    }
  }

  // GET: api/Ad/adTypeId/{adTypeId}
  static async getByAdTypeId(adTypeId: number): Promise<Ad[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/adTypeId/${adTypeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads by ad type ID:', error);
      throw new Error('Failed to fetch ads by ad type ID');
    }
  }
}