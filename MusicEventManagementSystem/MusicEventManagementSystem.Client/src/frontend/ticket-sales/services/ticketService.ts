export interface Ticket {
  ticketId: number;
  uniqueCode?: string;
  qrCode?: string;
  issueDate: Date;
  finalPrice: number;
  status?: string;
}

const API_BASE_URL = 'https://localhost:7050/api/ticket';

export const ticketService = {
  // Get all tickets
  getAllTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Get ticket by ID
  getTicketById: async (id: number): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  // Create new ticket
  createTicket: async (ticket: Omit<Ticket, 'ticketId'>): Promise<Ticket> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Update ticket
  updateTicket: async (id: number, ticket: Ticket): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Delete ticket
  deleteTicket: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },
};