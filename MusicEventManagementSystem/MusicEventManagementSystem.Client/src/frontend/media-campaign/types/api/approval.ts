import type { MediaVersion } from './mediaVersion';

export interface Approval {
  approvalId: number;
  approvalStatus?: string;
  comment?: string;
  approvalDate: string; // ISO date string
  mediaTaskId: number;
  submittedMediaVersionId?: number;
  submittedMediaVersion?: MediaVersion;
}
