export interface MediaVersion {
  mediaVersionId: number;
  versionFileName?: string;
  fileType?: string;
  fileURL?: string;
  isFinalVersion: boolean;
  adId: number;
  createdAt: string;
  mediaTaskId?: number;
}