import { EventStatus } from '../enums/EventOrganization';

export interface EventResponse {
  id: number;
  name: string;
  description: string;
  eventInterval: Date;
  status: EventStatus;
  createdById: string;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  ticketTypes?: number[];
  pricingRules?: number[];
}