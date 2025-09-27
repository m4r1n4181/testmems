export interface ApprovalCreateForm {
  approvalStatus: string;
  comment?: string;
  approvalDate: string; // ISO date string
  mediaTaskId: number;
}

export interface ApprovalUpdateForm {
  approvalStatus?: string;
  comment?: string;
  approvalDate?: string; // ISO date string
  mediaTaskId?: number;
}