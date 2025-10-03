import type { AdStatus } from '../enums/MediaChampaign';

export interface Ad {
  adId: number;
  deadline: string; // ISO date string
  title?: string;
  creationDate: string; // ISO date string
  currentPhase: AdStatus;
  publicationDate?: string; // ISO date string
  mediaWorkflowId: number;
  campaignId: number;
  adTypeId: number;
  mediaVersionIds?: number[];
  integrationStatusIds?: number[];
  createdById: string;
}