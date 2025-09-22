export interface Location {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  interval: string; // Ili Date ako parsiraš
  status: 'PLANNED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED';
  locationId: number;
  location?: Location; // Dodaj ovo ako backend vraća location objekat
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Filters {
  dateFrom: string;
  dateTo: string;
  status: string;
  location: string;
}