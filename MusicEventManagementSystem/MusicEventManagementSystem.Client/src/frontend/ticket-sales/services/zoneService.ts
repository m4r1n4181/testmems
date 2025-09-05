export interface Zone {
  zoneId: number;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  position: string;
}

export interface CreateZoneDto {
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  position: string;
}

class ZoneService {
  private readonly baseUrl = 'https://localhost:7050/api/zone'; // Adjust port as needed

  // Get all zones
  async getAllZones(): Promise<Zone[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching zones:', error);
      throw error;
    }
  }

  // Get zone by ID
  async getZoneById(id: number): Promise<Zone> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Zone not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching zone:', error);
      throw error;
    }
  }

  // Create new zone
  async createZone(zone: CreateZoneDto): Promise<Zone> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zone),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating zone:', error);
      throw error;
    }
  }

  // Update zone
  async updateZone(id: number, zone: CreateZoneDto): Promise<Zone> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zone),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Zone not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating zone:', error);
      throw error;
    }
  }

  // Delete zone
  async deleteZone(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Zone not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const zoneService = new ZoneService();