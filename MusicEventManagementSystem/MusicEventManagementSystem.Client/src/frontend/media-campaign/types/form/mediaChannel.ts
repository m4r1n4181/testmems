export interface CreateMediaChannelForm {
  platformType: string;
  apiKey?: string;
  apiURL?: string;
  apiVersion?: string;
}

export interface UpdateMediaChannelForm {
  platformType?: string;
  apiKey?: string;
  apiURL?: string;
  apiVersion?: string;
}