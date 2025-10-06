export const AdStatus = {
  InPreparation: 1,
  PendingApproval: 2,
  ScheduledPublication: 3,
  Published: 4
} as const;

export const StatusIntegration = {
  Published: 1,
  Failed: 2
} as const;

export const MediaTaskStatus = {
  InPreparation: 1,
  PendingApproval: 2,
  Approved: 3,
  Rejected: 4,
} as const;

export type AdStatus = typeof AdStatus[keyof typeof AdStatus];
export type StatusIntegration = typeof StatusIntegration[keyof typeof StatusIntegration];
export type MediaTaskStatus = typeof MediaTaskStatus[keyof typeof MediaTaskStatus];