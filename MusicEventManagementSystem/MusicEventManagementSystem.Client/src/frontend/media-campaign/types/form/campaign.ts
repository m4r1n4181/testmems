export interface CampaignCreateForm {
  eventId: number;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalBudget: number;
}

export interface CampaignUpdateForm {
  eventId?: number;
  name?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  totalBudget?: number;
}