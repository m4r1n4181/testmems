import type { AdStatus } from '../enums/MediaChampaign';

export interface CreateAdForm {
  deadline: string; // ISO date string
  title: string;
  creationDate: string; // ISO date string
  currentPhase: AdStatus;
  publicationDate?: string; // ISO date string
  mediaWorkflowId: number;
  campaignId: number;
  adTypeId: number;
  mediaVersionIds?: number[];
  integrationStatusIds?: number[];
  createdByUserId?: string; // ID korisnika koji kreira oglas (set when submitting)
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