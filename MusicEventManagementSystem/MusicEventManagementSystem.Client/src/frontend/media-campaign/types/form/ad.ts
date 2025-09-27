import type { AdStatus } from '../enums/MediaChampaign';

export interface AdCreateForm {
  deadline: string; // ISO date string
  title: string;
  creationDate: string; // ISO date string
  currentPhase: AdStatus;
  publicationDate?: string; // ISO date string
  mediaWorkflowId: number;
  campaignId: number;
  adTypeId: number;
}

export interface AdUpdateForm {
  deadline?: string; // ISO date string
  title?: string;
  creationDate?: string; // ISO date string
  currentPhase?: AdStatus;
  publicationDate?: string; // ISO date string
  mediaWorkflowId?: number;
  campaignId?: number;
  adTypeId?: number;
}