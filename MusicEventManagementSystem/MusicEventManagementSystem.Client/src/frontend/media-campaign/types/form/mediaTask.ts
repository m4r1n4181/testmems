export interface MediaTaskCreateForm {
  taskName: string;
  order: number;
  taskStatus?: string;
  workflowId: number;
}

export interface MediaTaskUpdateForm {
  taskName?: string;
  order?: number;
  taskStatus?: string;
  workflowId?: number;
}