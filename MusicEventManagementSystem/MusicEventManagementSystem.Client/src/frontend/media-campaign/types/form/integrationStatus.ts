import type { StatusIntegration } from '../enums/MediaChampaign';  

export interface IntegrationStatusCreateForm {
  adId: number;
  channelId: number;
  status?: StatusIntegration;
  publicationDate?: string; // ISO date string
  error?: string;
  lastSynced?: string; // ISO date string
}

export interface IntegrationStatusUpdateForm {
  adId?: number;
  channelId?: number;
  status?: StatusIntegration;
  publicationDate?: string; // ISO date string
  error?: string;
  lastSynced?: string; // ISO date string
}