import type { AdStatus } from '../enums/MediaChampaign';

export interface CreateAdForm {
  Deadline: string;
  Title: string;
  CreationDate: string;
  CurrentPhase: AdStatus;
  PublicationDate?: string;
  MediaWorkflowId: number;
  CampaignId: number;
  AdTypeId: number;
  MediaVersionIds?: number[];
  IntegrationStatusIds?: number[];
  CreatedById: string;
}

export interface UpdateAdForm {
  deadline?: string; // ISO date string
  title?: string;
  creationDate?: string; // ISO date string
  currentPhase?: AdStatus;
  publicationDate?: string; // ISO date string
  mediaWorkflowId?: number;
  campaignId?: number;
  adTypeId?: number;
  mediaVersionIds?: number[];
  integrationStatusIds?: number[];
}