import type { MediaVersion } from '../types/api/mediaVersion';
import type { 
  CreateMediaVersionForm, 
  UpdateMediaVersionForm 
} from '../types/form/mediaVersion';

const API_BASE_URL = 'https://localhost:7050/api';

export class MediaVersionService {
  private static readonly BASE_URL = `${API_BASE_URL}/MediaVersion`;

  // GET: api/MediaVersion
  static async getAllMediaVersions(): Promise<MediaVersion[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media versions:', error);
      throw new Error('Failed to fetch media versions');
    }
  }

  // GET: api/MediaVersion/{id}
  static async getMediaVersionById(id: number): Promise<MediaVersion> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaVersion with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media version ${id}:`, error);
      throw error;
    }
  }

  // POST: api/MediaVersion
  static async createMediaVersion(createForm: CreateMediaVersionForm): Promise<MediaVersion> {
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
      console.error('Error creating media version:', error);
      throw new Error('Failed to create media version');
    }
  }

  // PUT: api/MediaVersion/{id}
  static async updateMediaVersion(id: number, updateForm: UpdateMediaVersionForm): Promise<MediaVersion> {
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
          throw new Error(`MediaVersion with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating media version ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/MediaVersion/{id}
  static async deleteMediaVersion(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaVersion with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting media version ${id}:`, error);
      throw error;
    }
  }

  // GET: api/MediaVersion/versionFileName/{versionFileName}
  static async getByVersionFileName(versionFileName: string): Promise<MediaVersion[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/versionFileName/${encodeURIComponent(versionFileName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media versions by version file name ${versionFileName}:`, error);
      throw new Error(`Failed to fetch media versions by version file name ${versionFileName}`);
    }
  }

  // GET: api/MediaVersion/fileType/{fileType}
  static async getByFileType(fileType: string): Promise<MediaVersion[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/fileType/${encodeURIComponent(fileType)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media versions by file type ${fileType}:`, error);
      throw new Error(`Failed to fetch media versions by file type ${fileType}`);
    }
  }

  // GET: api/MediaVersion/fileURL/{fileURL}
  static async getByFileURL(fileURL: string): Promise<MediaVersion[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/fileURL/${encodeURIComponent(fileURL)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media versions by file URL ${fileURL}:`, error);
      throw new Error(`Failed to fetch media versions by file URL ${fileURL}`);
    }
  }

  // GET: api/MediaVersion/isFinalVersion/{isFinalVersion}
  static async getByIsFinalVersion(isFinalVersion: boolean): Promise<MediaVersion[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/isFinalVersion/${isFinalVersion}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media versions by final version status ${isFinalVersion}:`, error);
      throw new Error(`Failed to fetch media versions by final version status ${isFinalVersion}`);
    }
  }

  // GET: api/MediaVersion/adId/{adId}
  static async getByAdId(adId: number): Promise<MediaVersion[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/adId/${adId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media versions by ad ID ${adId}:`, error);
      throw new Error(`Failed to fetch media versions by ad ID ${adId}`);
    }
  }
}

export default MediaVersionService;