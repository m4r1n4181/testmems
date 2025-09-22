import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import eventService from '../services/eventsService';
import type { Event, Location, Filters } from '../types/types';

const EventOrgEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filters, setFilters] = useState<Filters>({ 
    dateFrom: 'All dates', 
    dateTo: 'All dates', 
    status: 'All statuses', 
    location: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Expected array but got:', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await eventService.getAllLocations();
      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        console.error('Expected array for locations but got:', data);
        setLocations([]);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      setLocations([]);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredEvents = Array.isArray(events)
    ? events.filter(event => {
        const [start] = event.interval.split('-');
        const dateFromMatch = filters.dateFrom === 'All dates' || 
                             new Date(start) >= new Date(filters.dateFrom);
        const dateToMatch = filters.dateTo === 'All dates' || 
                           (event.interval.includes('-') ? new Date(event.interval.split('-')[1]) <= new Date(filters.dateTo) : true);
        const statusMatch = filters.status === 'All statuses' || event.status === filters.status;
        const locationMatch = filters.location === '' || 
                             event.location?.name?.toLowerCase().includes(filters.location.toLowerCase());
        return dateFromMatch && dateToMatch && statusMatch && locationMatch;
      })
    : [];

  const handleAddEvent = () => {
    console.log('Add new event');
    // Add navigation or modal logic here if needed
  };

  if (loading) {
    return (
      <div className="text-white h-full flex items-center justify-center p-6 bg-neutral-900/80 backdrop-blur-sm rounded-2xl m-4 border border-neutral-800">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white h-full flex items-center justify-center p-6 bg-neutral-900/80 backdrop-blur-sm rounded-2xl m-4 border border-neutral-800">
        <div className="text-xl text-red-400 mb-4">{error}</div>
        <button 
          onClick={fetchEvents} 
          className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition-all duration-200 border border-pink-400/30"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-white h-full flex flex-col p-6 bg-neutral-900/80 backdrop-blur-sm rounded-2xl m-4 border border-neutral-800 shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Events</h1>
            <p className="text-neutral-400 text-sm">
              Manage event creation, scheduling, and details.
            </p>
          </div>
          <button 
            onClick={handleAddEvent} 
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-3 rounded-xl hover:bg-pink-600 transition-all duration-200 border border-pink-400/30 group"
          >
            <Plus size={18} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select 
          name="dateFrom" 
          value={filters.dateFrom} 
          onChange={handleFilterChange} 
          className="p-3 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        >
          <option>All dates</option>
          <option>2025-07-01</option>
          <option>2025-08-01</option>
          <option>2025-09-01</option>
        </select>
        
        <select 
          name="dateTo" 
          value={filters.dateTo} 
          onChange={handleFilterChange} 
          className="p-3 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        >
          <option>All dates</option>
          <option>2025-07-31</option>
          <option>2025-08-31</option>
          <option>2025-09-30</option>
        </select>
        
        <select 
          name="status" 
          value={filters.status} 
          onChange={handleFilterChange} 
          className="p-3 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        >
          <option>All statuses</option>
          <option>IN PROGRESS</option>
          <option>COMPLETED</option>
          <option>PLANNED</option>
          <option>CANCELLED</option>
        </select>
        
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Filter by location..."
          className="p-3 bg-neutral-800 border border-neutral-700 text-white rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
        
        <button 
          onClick={() => setFilters({ dateFrom: 'All dates', dateTo: 'All dates', status: 'All statuses', location: '' })} 
          className="p-3 bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-xl hover:bg-neutral-700 hover:text-white transition-all duration-200"
        >
          Clear Filters
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-grow">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center text-neutral-400 py-12">
            <Calendar size={48} className="mx-auto mb-4 text-neutral-600" />
            <div className="text-lg">No events found</div>
            <div className="text-sm mt-2">Try adjusting your filters or add a new event</div>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-neutral-800/50 border border-neutral-700 p-4 rounded-2xl shadow-lg hover:border-pink-400/30 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">{event.name}</h3>
                <ChevronRight size={16} className="text-neutral-500 group-hover:text-pink-400 mt-1 transition-colors" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin size={14} />
                  <span className="text-sm">{event.location?.name || `ID: ${event.locationId}`}</span>
                </div>
                
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar size={14} />
                  <span className="text-sm">{event.interval}</span>
                </div>
                
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock size={14} />
                  <span className="text-sm">Created: {new Date(event.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                  event.status === 'IN PROGRESS' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                  event.status === 'PLANNED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {event.status}
                </span>
                
                <div className="text-xs text-neutral-500">
                  Updated: {new Date(event.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventOrgEvents;