export interface CreateAdTypeForm {
  typeName: string;
  typeDescription?: string;
  dimensions?: string;
  duration: number;
  fileFormat: string;
  adIds?: number[];
  mediaWorkflowId: number;
}

export interface UpdateAdTypeForm {
  typeName?: string;
  typeDescription?: string;
  dimensions?: string;
  duration?: number;
  fileFormat?: string;
}