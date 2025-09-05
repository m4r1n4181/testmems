export interface RecordedSale {
  recordedSaleId: number;
  totalAmount: number;
  paymentMethod?: string;
  saleDate: Date;
  transactionStatus?: string;
}

const API_BASE_URL = "https://localhost:7050/api/RecordedSale";

export const recordedSaleService = {
  // Get all recorded sales
  getAllRecordedSales: async (): Promise<RecordedSale[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching recorded sales:", error);
      throw error;
    }
  },

  // Get recorded sale by ID
  getRecordedSaleById: async (id: number): Promise<RecordedSale> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching recorded sale:", error);
      throw error;
    }
  },

  // Create new recorded sale
  createRecordedSale: async (
    recordedSale: Omit<RecordedSale, "recordedSaleId">
  ): Promise<RecordedSale> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordedSale),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating recorded sale:", error);
      throw error;
    }
  },

  // Update recorded sale
  updateRecordedSale: async (
    id: number,
    recordedSale: RecordedSale
  ): Promise<RecordedSale> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordedSale),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating recorded sale:", error);
      throw error;
    }
  },

  // Delete recorded sale
  deleteRecordedSale: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting recorded sale:", error);
      throw error;
    }
  },
};
