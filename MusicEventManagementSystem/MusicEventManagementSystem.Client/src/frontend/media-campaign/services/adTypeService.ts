import type { AdType } from '../types/api/adType';
import type { CreateAdTypeForm, UpdateAdTypeForm } from '../types/form/adType';

const API_BASE_URL = 'http://localhost:5255/api';

export class AdTypeService {
  private static readonly BASE_URL = `${API_BASE_URL}/AdType`;

  // GET: api/AdType
  static async getAllAdTypes(): Promise<AdType[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ad types:', error);
      throw new Error('Failed to fetch ad types');
    }
  }

  // GET: api/AdType/{id}
  static async getAdTypeById(id: number): Promise<AdType> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`AdType with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ad type ${id}:`, error);
      throw error;
    }
  }

  // POST: api/AdType
  static async createAdType(createForm: CreateAdTypeForm): Promise<AdType> {
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
      console.error('Error creating ad type:', error);
      throw new Error('Failed to create ad type');
    }
  }

  // PUT: api/AdType/{id}
  static async updateAdType(id: number, updateForm: UpdateAdTypeForm): Promise<AdType> {
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
          throw new Error(`AdType with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating ad type ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/AdType/{id}
  static async deleteAdType(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`AdType with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting ad type ${id}:`, error);
      throw error;
    }
  }

  // GET: api/AdType/typeName/{typeName}
  static async getByTypeName(typeName: string): Promise<AdType[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/typeName/${encodeURIComponent(typeName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ad types by type name:', error);
      throw new Error('Failed to fetch ad types by type name');
    }
  }

  // GET: api/AdType/typeDescription/{typeDescription}
  static async getByTypeDescription(typeDescription: string): Promise<AdType[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/typeDescription/${encodeURIComponent(typeDescription)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ad types by type description:', error);
      throw new Error('Failed to fetch ad types by type description');
    }
  }

  // GET: api/AdType/dimensions/{dimensions}
  static async getByDimensions(dimensions: string): Promise<AdType[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/dimensions/${encodeURIComponent(dimensions)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ad types by dimensions:', error);
      throw new Error('Failed to fetch ad types by dimensions');
    }
  }

  // GET: api/AdType/duration/{duration}
  static async getByDuration(duration: number): Promise<AdType[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/duration/${duration}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ad types by duration:', error);
      throw new Error('Failed to fetch ad types by duration');
    }
  }

  // GET: api/AdType/fileFormat/{fileFormat}
  static async getByFileFormat(fileFormat: string): Promise<AdType[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/fileFormat/${encodeURIComponent(fileFormat)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ad types by file format:', error);
      throw new Error('Failed to fetch ad types by file format');
    }
  }
}