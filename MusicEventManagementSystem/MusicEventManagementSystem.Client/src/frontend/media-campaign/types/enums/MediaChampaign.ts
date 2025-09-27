export const AdStatus = {
  InPreparation: 1,
  PendingApproval: 2,
  ScheduledPublication: 3,
  Published: 4
} as const;

export const StatusIntegration = {
  Pending: 1,
  InProgress: 2,
  Success: 3,
  Failed: 4,
  Retry: 5
} as const;

export type AdStatus = typeof AdStatus[keyof typeof AdStatus];
export type StatusIntegration = typeof StatusIntegration[keyof typeof StatusIntegration];