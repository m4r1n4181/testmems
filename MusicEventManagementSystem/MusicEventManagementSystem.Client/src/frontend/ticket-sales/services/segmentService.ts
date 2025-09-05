export interface Segment {
  segmentId: number;
  name: string;
  description: string;
  capacity: number;
  segmentType: string;
}

export interface CreateSegmentDto {
  name: string;
  description: string;
  capacity: number;
  segmentType: string;
}

class SegmentService {
  private readonly baseUrl = 'https://localhost:7050/api/segment'; // Adjust port as needed

  // Get all segments
  async getAllSegments(): Promise<Segment[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }
  }

  // Get segment by ID
  async getSegmentById(id: number): Promise<Segment> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Segment not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching segment:', error);
      throw error;
    }
  }

  // Create new segment
  async createSegment(segment: CreateSegmentDto): Promise<Segment> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    }
  }

  // Update segment
  async updateSegment(id: number, segment: CreateSegmentDto): Promise<Segment> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segment),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Segment not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  }

  // Delete segment
  async deleteSegment(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Segment not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting segment:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const segmentService = new SegmentService();