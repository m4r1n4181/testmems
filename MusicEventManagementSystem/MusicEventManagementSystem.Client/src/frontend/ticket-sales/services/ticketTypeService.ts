export interface TicketType {
  ticketTypeId: number;
  name?: string;
  description?: string;
  status?: string;
  availableQuantity: number;
}

const API_BASE_URL = 'https://localhost:7050/api/TicketType';

export const ticketTypeService = {
  // Get all ticket types
  getAllTicketTypes: async (): Promise<TicketType[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket types:', error);
      throw error;
    }
  },

  // Get ticket type by ID
  getTicketTypeById: async (id: number): Promise<TicketType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket type:', error);
      throw error;
    }
  },

  // Create new ticket type
  createTicketType: async (ticketType: Omit<TicketType, 'ticketTypeId'>): Promise<TicketType> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketType),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating ticket type:', error);
      throw error;
    }
  },

  // Update ticket type
  updateTicketType: async (id: number, ticketType: TicketType): Promise<TicketType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketType),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating ticket type:', error);
      throw error;
    }
  },

  // Delete ticket type
  deleteTicketType: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting ticket type:', error);
      throw error;
    }
  },
};
