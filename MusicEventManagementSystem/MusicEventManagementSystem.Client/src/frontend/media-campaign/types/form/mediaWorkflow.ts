import type { MediaTaskStatus } from "../enums/MediaChampaign";

export interface MediaTaskForm {
  taskName: string;
  order: number;
  taskStatus?: MediaTaskStatus;
}

export interface CreateMediaWorkflowForm {
  workflowDescription?: string;
  tasks?: MediaTaskForm[]; // Now expects MediaTask objects, not just IDs
  approvalId?: number;
  adId?: number;
}

export interface UpdateMediaWorkflowForm {
  workflowDescription?: string;
  tasks?: MediaTaskForm[]; // For updating tasks in workflow
  approvalId?: number;
  adId?: number;
}