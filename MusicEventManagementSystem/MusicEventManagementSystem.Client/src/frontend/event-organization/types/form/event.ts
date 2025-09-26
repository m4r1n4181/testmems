import { EventStatus } from '../enums/EventOrganization';

export interface EventCreateForm {
  name: string;
  description: string;
  eventInterval: Date;
  status: EventStatus;
  createdById: string;
  locationId: number;
}

export interface EventUpdateForm {
  name?: string;
  description?: string;
  eventInterval?: Date;
  status?: EventStatus;
  locationId?: number;
}