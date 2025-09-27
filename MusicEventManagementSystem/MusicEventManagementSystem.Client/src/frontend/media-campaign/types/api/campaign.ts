export interface Campaign {
  campaignId: number;
  eventId: number;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalBudget: number;
  adIds?: number[];
}