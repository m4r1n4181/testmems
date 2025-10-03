import type { IntegrationStatus } from '../types/api/integrationStatus';
import type { 
  CreateIntegrationStatusForm, 
  UpdateIntegrationStatusForm 
} from '../types/form/integrationStatus';
import type { StatusIntegration } from '../types/enums/MediaChampaign';


const API_BASE_URL = 'http://localhost:5255/api'; // Promeni na svoj API URL

export class IntegrationStatusService {
  private static readonly BASE_URL = `${API_BASE_URL}/IntegrationStatus`;

  // GET: api/IntegrationStatus
  static async getAllIntegrationStatuses(): Promise<IntegrationStatus[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching integration statuses:', error);
      throw new Error('Failed to fetch integration statuses');
    }
  }

  // GET: api/IntegrationStatus/{id}
  static async getIntegrationStatusById(id: number): Promise<IntegrationStatus> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`IntegrationStatus with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching integration status ${id}:`, error);
      throw error;
    }
  }

  // POST: api/IntegrationStatus
  static async createIntegrationStatus(createForm: CreateIntegrationStatusForm): Promise<IntegrationStatus> {
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
      console.error('Error creating integration status:', error);
      throw new Error('Failed to create integration status');
    }
  }

  // PUT: api/IntegrationStatus/{id}
  static async updateIntegrationStatus(id: number, updateForm: UpdateIntegrationStatusForm): Promise<IntegrationStatus> {
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
          throw new Error(`IntegrationStatus with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating integration status ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/IntegrationStatus/{id}
  static async deleteIntegrationStatus(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`IntegrationStatus with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting integration status ${id}:`, error);
      throw error;
    }
  }

  // GET: api/IntegrationStatus/adId/{adId}
  static async getByAdId(adId: number): Promise<IntegrationStatus[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/adId/${adId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching integration statuses by ad ID ${adId}:`, error);
      throw new Error(`Failed to fetch integration statuses by ad ID ${adId}`);
    }
  }

  // GET: api/IntegrationStatus/channelId/{channelId}
  static async getByChannelId(channelId: number): Promise<IntegrationStatus[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/channelId/${channelId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching integration statuses by channel ID ${channelId}:`, error);
      throw new Error(`Failed to fetch integration statuses by channel ID ${channelId}`);
    }
  }

  // GET: api/IntegrationStatus/status/{status}
  static async getByStatus(status: StatusIntegration): Promise<IntegrationStatus[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/status/${status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching integration statuses by status ${status}:`, error);
      throw new Error(`Failed to fetch integration statuses by status ${status}`);
    }
  }

  // GET: api/IntegrationStatus/publicationDate/{publicationDate}
  static async getByPublicationDate(publicationDate: Date): Promise<IntegrationStatus[]> {
    try {
      const dateString = publicationDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const response = await fetch(`${this.BASE_URL}/publicationDate/${dateString}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching integration statuses by publication date ${publicationDate}:`, error);
      throw new Error(`Failed to fetch integration statuses by publication date ${publicationDate}`);
    }
  }

  // GET: api/IntegrationStatus/lastSynced/{lastSynced}
  static async getByLastSynced(lastSynced: Date): Promise<IntegrationStatus[]> {
    try {
      const dateString = lastSynced.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const response = await fetch(`${this.BASE_URL}/lastSynced/${dateString}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching integration statuses by last synced ${lastSynced}:`, error);
      throw new Error(`Failed to fetch integration statuses by last synced ${lastSynced}`);
    }
  }

  // GET: api/IntegrationStatus/error/{error}
  static async getByError(error: string): Promise<IntegrationStatus[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/error/${encodeURIComponent(error)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (fetchError) {
      console.error(`Error fetching integration statuses by error ${error}:`, fetchError);
      throw new Error(`Failed to fetch integration statuses by error ${error}`);
    }
  }
}

export default IntegrationStatusService;