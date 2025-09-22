import axios from 'axios';
import type { Event, Location } from '../types/types';

const API_URL = 'https://localhost:7050/api/events';
const LOCATION_API_URL = 'https://localhost:7050/api/locations';

const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await axios.get(API_URL);
      // Provjeri je li response.data array
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API did not return an array:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createEvent: async (event: Event): Promise<Event> => {
    const response = await axios.post(API_URL, event);
    return response.data;
  },

  updateEvent: async (id: number, event: Event): Promise<Event> => {
    const response = await axios.put(`${API_URL}/${id}`, event);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  getAllLocations: async (): Promise<Location[]> => {
    try {
      const response = await axios.get(LOCATION_API_URL);
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API did not return an array for locations:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  getLocationById: async (id: number): Promise<Location> => {
    const response = await axios.get(`${LOCATION_API_URL}/${id}`);
    return response.data;
  },

  createLocation: async (location: Location): Promise<Location> => {
    const response = await axios.post(LOCATION_API_URL, location);
    return response.data;
  },

  updateLocation: async (id: number, location: Location): Promise<Location> => {
    const response = await axios.put(`${LOCATION_API_URL}/${id}`, location);
    return response.data;
  },

  deleteLocation: async (id: number): Promise<void> => {
    await axios.delete(`${LOCATION_API_URL}/${id}`);
  },
};

export default eventService;