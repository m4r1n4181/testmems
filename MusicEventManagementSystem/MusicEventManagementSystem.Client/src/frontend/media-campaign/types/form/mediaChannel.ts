export interface MediaChannelCreateForm {
  platformType: string;
  apiKey?: string;
  apiURL?: string;
  apiVersion?: string;
}

export interface MediaChannelUpdateForm {
  platformType?: string;
  apiKey?: string;
  apiURL?: string;
  apiVersion?: string;
}