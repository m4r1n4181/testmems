export interface CreateCampaignForm {
  eventId: number;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalBudget: number;
  adIds?: number[];
}

export interface UpdateCampaignForm {
  eventId?: number;
  name?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  totalBudget?: number;
  adIds?: number[];
}