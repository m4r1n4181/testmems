import type { MediaTaskStatus } from '../enums/MediaChampaign';
export interface MediaTask {
  mediaTaskId: number;
  taskName?: string;
  order: number;
  taskStatus: MediaTaskStatus;
  workflowId: number;
  approvalId?: number;
  managerId?: string;
  adId?: number;
  taskStartedAt?: string;
  taskCompletedAt?: string;
  submittedForApprovalAt?: string;
}