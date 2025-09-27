import type { MediaChannel } from '../types/api/mediaChannel';
import type { 
  CreateMediaChannelForm, 
  UpdateMediaChannelForm 
} from '../types/form/mediaChannel';

const API_BASE_URL = 'https://localhost:7050/api';

export class MediaChannelService {
  private static readonly BASE_URL = `${API_BASE_URL}/MediaChannel`;

  // GET: api/MediaChannel
  static async getAllMediaChannels(): Promise<MediaChannel[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media channels:', error);
      throw new Error('Failed to fetch media channels');
    }
  }

  // GET: api/MediaChannel/{id}
  static async getMediaChannelById(id: number): Promise<MediaChannel> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaChannel with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media channel ${id}:`, error);
      throw error;
    }
  }

  // POST: api/MediaChannel
  static async createMediaChannel(createForm: CreateMediaChannelForm): Promise<MediaChannel> {
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
      console.error('Error creating media channel:', error);
      throw new Error('Failed to create media channel');
    }
  }

  // PUT: api/MediaChannel/{id}
  static async updateMediaChannel(id: number, updateForm: UpdateMediaChannelForm): Promise<MediaChannel> {
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
          throw new Error(`MediaChannel with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating media channel ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/MediaChannel/{id}
  static async deleteMediaChannel(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaChannel with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting media channel ${id}:`, error);
      throw error;
    }
  }

  // GET: api/MediaChannel/platformType/{platformType}
  static async getByPlatformType(platformType: string): Promise<MediaChannel[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/platformType/${encodeURIComponent(platformType)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media channels by platform type ${platformType}:`, error);
      throw new Error(`Failed to fetch media channels by platform type ${platformType}`);
    }
  }

  // GET: api/MediaChannel/apiKey/{apiKey}
  static async getByAPIKey(apiKey: string): Promise<MediaChannel[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/apiKey/${encodeURIComponent(apiKey)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media channels by API key:`, error);
      throw new Error('Failed to fetch media channels by API key');
    }
  }

  // GET: api/MediaChannel/apiURL/{apiURL}
  static async getByAPIURL(apiURL: string): Promise<MediaChannel[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/apiURL/${encodeURIComponent(apiURL)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media channels by API URL ${apiURL}:`, error);
      throw new Error(`Failed to fetch media channels by API URL ${apiURL}`);
    }
  }

  // GET: api/MediaChannel/apiVersion/{apiVersion}
  static async getByAPIVersion(apiVersion: string): Promise<MediaChannel[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/apiVersion/${encodeURIComponent(apiVersion)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media channels by API version ${apiVersion}:`, error);
      throw new Error(`Failed to fetch media channels by API version ${apiVersion}`);
    }
  }
}

export default MediaChannelService;