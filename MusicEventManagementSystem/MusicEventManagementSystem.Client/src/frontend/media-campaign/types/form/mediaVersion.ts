export interface MediaVersionCreateForm {
  versionFileName: string;
  fileType?: string;
  fileURL?: string;
  isFinalVersion: boolean;
  adId: number;
}

export interface MediaVersionUpdateForm {
  versionFileName?: string;
  fileType?: string;
  fileURL?: string;
  isFinalVersion?: boolean;
  adId?: number;
}