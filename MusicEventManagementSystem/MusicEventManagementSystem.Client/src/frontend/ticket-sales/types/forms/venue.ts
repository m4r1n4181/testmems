import { VenueType } from '../enums/TicketSales';

export interface VenueCreateForm {
  name: string;
  description?: string;
  city: string;
  address: string;
  capacity: number;
  venueType: VenueType;
}

export interface VenueUpdateForm {
  name?: string;
  description?: string;
  city?: string;
  address?: string;
  capacity?: number;
  venueType?: VenueType;
}