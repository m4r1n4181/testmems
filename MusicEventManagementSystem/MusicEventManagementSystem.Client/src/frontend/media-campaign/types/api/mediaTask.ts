export interface MediaTask {
  mediaTaskId: number;
  taskName?: string;
  order: number;
  taskStatus?: string;
  workflowId: number;
  approvalId?: number;
  managerId?: string;
  adId?: number;
  taskStartedAt?: string;
  taskCompletedAt?: string;
  submittedForApprovalAt?: string;
}