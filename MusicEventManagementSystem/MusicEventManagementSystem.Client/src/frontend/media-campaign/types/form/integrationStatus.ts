import type { StatusIntegration } from '../enums/MediaChampaign';  

export interface CreateIntegrationStatusForm {
  adId: number;
  channelId: number;
  status?: StatusIntegration;
  publicationDate?: string; // ISO date string
  error?: string;
  lastSynced?: string; // ISO date string
}

export interface UpdateIntegrationStatusForm {
  adId?: number;
  channelId?: number;
  status?: StatusIntegration;
  publicationDate?: string; // ISO date string
  error?: string;
  lastSynced?: string; // ISO date string
}