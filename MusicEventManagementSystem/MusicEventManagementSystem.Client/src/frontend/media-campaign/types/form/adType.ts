export interface AdTypeCreateForm {
  typeName: string;
  typeDescription?: string;
  dimensions?: string;
  duration: number;
  fileFormat: string;
}

export interface AdTypeUpdateForm {
  typeName?: string;
  typeDescription?: string;
  dimensions?: string;
  duration?: number;
  fileFormat?: string;
}