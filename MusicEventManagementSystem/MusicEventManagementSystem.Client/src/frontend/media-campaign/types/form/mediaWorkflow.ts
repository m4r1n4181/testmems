export interface CreateMediaWorkflowForm {
  workflowDescription?: string;
  taskIds?: number[];
  approvalId?: number;
  adId?: number;
}

export interface UpdateMediaWorkflowForm {
  workflowDescription?: string;
  taskIds?: number[];
  approvalId?: number;
  adId?: number;
}