import type { StatusIntegration } from '../enums/MediaChampaign';

export interface IntegrationStatus {
  integrationStatusId: number;
  adId: number;
  channelId: number;
  status?: StatusIntegration;
  publicationDate?: string; // ISO date string
  error?: string;
  lastSynced?: string; // ISO date string
}