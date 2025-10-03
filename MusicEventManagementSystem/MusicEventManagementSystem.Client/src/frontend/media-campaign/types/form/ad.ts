import type { AdStatus } from '../enums/MediaChampaign';

export interface CreateAdForm {
  deadline: string;
  title: string;
  creationDate: string;
  currentPhase: AdStatus;
  publicationDate?: string;
  mediaWorkflowId: number;
  campaignId: number;
  adTypeId: number;
  mediaVersionIds?: number[];
  integrationStatusIds?: number[];
  createdById: string;
}

export interface UpdateAdForm {
  deadline?: string;
  title?: string;
  creationDate?: string;
  currentPhase?: AdStatus;
  publicationDate?: string;
  mediaWorkflowId?: number;
  campaignId?: number;
  adTypeId?: number;
  mediaVersionIds?: number[];
  integrationStatusIds?: number[];
}