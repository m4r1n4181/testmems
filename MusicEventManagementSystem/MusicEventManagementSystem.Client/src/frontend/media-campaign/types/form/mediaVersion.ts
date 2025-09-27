export interface CreateMediaVersionForm {
  versionFileName: string;
  fileType?: string;
  fileURL?: string;
  isFinalVersion: boolean;
  adId: number;
}

export interface UpdateMediaVersionForm {
  versionFileName?: string;
  fileType?: string;
  fileURL?: string;
  isFinalVersion?: boolean;
  adId?: number;
}