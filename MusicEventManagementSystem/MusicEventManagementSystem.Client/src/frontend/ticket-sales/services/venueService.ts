export interface VenueResponseDto {
  venueId: number;
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  venueType: number;
}

export interface VenueCreateDto {
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  venueType: number;
}

export interface VenueUpdateDto {
  name?: string;
  description?: string;
  city?: string;
  address?: string;
  capacity?: number;
  venueType?: number;
}

class VenueService {
  private readonly baseUrl = 'https://localhost:7050/api/venue'; // Adjust port as needed

  // Get all venues
  async getAllVenues(): Promise<VenueResponseDto[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  }

  // Get venue by ID
  async getVenueById(id: number): Promise<VenueResponseDto> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Venue not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching venue:', error);
      throw error;
    }
  }

  // Create new venue
  async createVenue(venue: VenueCreateDto): Promise<VenueResponseDto> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venue),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating venue:', error);
      throw error;
    }
  }

  // Update venue
  async updateVenue(id: number, venue: VenueUpdateDto): Promise<VenueResponseDto> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venue),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Venue not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  }

  // Delete venue
  async deleteVenue(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Venue not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const venueService = new VenueService();