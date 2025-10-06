export interface CreateApprovalForm {
  approvalStatus: string;
  comment?: string;
  approvalDate: string; // ISO date string
  mediaTaskId: number;
  submittedMediaVersionId?: number;
}

export interface UpdateApprovalForm {
  approvalStatus?: string;
  comment?: string;
  approvalDate?: string; // ISO date string
  mediaTaskId?: number;
  submittedMediaVersionId?: number;
}