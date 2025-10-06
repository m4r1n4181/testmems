import type { MediaTaskStatus } from '../enums/MediaChampaign';
export interface CreateMediaTaskForm {
  taskName: string;
  order: number;
  taskStatus: MediaTaskStatus;
  workflowId: number;
  approvalId?: number;
  managerId?: string;
  adId?: number;
}

export interface UpdateMediaTaskForm {
  taskName?: string;
  order?: number;
  taskStatus?: MediaTaskStatus;
  workflowId?: number;
  approvalId?: number;
  taskStartedAt?: string;
  taskCompletedAt?: string;
  submittedForApprovalAt?: string;
}