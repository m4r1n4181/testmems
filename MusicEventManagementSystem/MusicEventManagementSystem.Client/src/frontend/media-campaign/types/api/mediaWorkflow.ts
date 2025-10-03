import type { MediaTask } from './mediaTask';

export interface MediaWorkflow {
  mediaWorkflowId: number;
  workflowDescription?: string;
  taskIds?: number[];
  tasks?: MediaTask[];
  approvalId?: number;
  adId?: number;
}