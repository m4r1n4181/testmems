
export const EventStatus = {
  Planned: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4
} as const;

export type EventStatus = typeof EventStatus[keyof typeof EventStatus];