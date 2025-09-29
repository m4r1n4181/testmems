export interface CreateMediaTaskForm {
  taskName: string;
  order: number;
  taskStatus?: string;
  workflowId: number;
  approvalId?: number;
  managerId?: string;
  adId?: number;
}

export interface UpdateMediaTaskForm {
  taskName?: string;
  order?: number;
  taskStatus?: string;
  workflowId?: number;
  approvalId?: number;
}