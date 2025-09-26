import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, MapPin, Users, DollarSign } from 'lucide-react';

// Koristi tvoje postojeće service-e
import VenueService from '../types/services/venueService';
import SegmentService from '../types/services/segmentService'; 
import ZoneService from '../types/services/zoneService';

// API Response tipovi
import type { VenueResponse } from '../types/api/venue';
import type { SegmentResponse } from '../types/api/segment';
import type { ZoneResponse } from '../types/api/zone';

// Form tipovi
import type { VenueCreateForm } from '../types/forms/venue';
import type { SegmentCreateForm } from '../types/forms/segment';
import type { ZoneCreateForm } from '../types/forms/zone';

// Enums
import { VenueType, SegmentType, ZonePosition } from '../types/enums/TicketSales';

// Venue Types mapping
const VenueTypeLabels = {
  [VenueType.Indoor]: 'Indoor',
  [VenueType.Outdoor]: 'Outdoor', 
  [VenueType.Stadium]: 'Stadium',
  [VenueType.Arena]: 'Arena',
  [VenueType.Theater]: 'Theater',
  [VenueType.Club]: 'Club',
  [VenueType.Festival]: 'Festival'
};

const SegmentTypeLabels = {
  [SegmentType.VIP]: 'VIP',
  [SegmentType.Standard]: 'Standard',
  [SegmentType.Premium]: 'Premium', 
  [SegmentType.Standing]: 'Standing',
  [SegmentType.Seated]: 'Seated'
};

const ZonePositionLabels = {
  [ZonePosition.Front]: 'Front',
  [ZonePosition.Center]: 'Center',
  [ZonePosition.Back]: 'Back',
  [ZonePosition.Left]: 'Left',
  [ZonePosition.Right]: 'Right',
  [ZonePosition.Upper]: 'Upper',
  [ZonePosition.Lower]: 'Lower',
  [ZonePosition.Balcony]: 'Balcony'
};

// Venue List Component
interface VenueListProps {
  venues: VenueResponse[];
  selectedVenue: VenueResponse | null;
  onVenueSelect: (venue: VenueResponse) => void;
  onCreateNew: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const VenueList = ({ venues, selectedVenue, onVenueSelect, onCreateNew, searchTerm, onSearchChange }: VenueListProps) => {
  return (
    <div className="w-80 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 h-[calc(100vh-8rem)] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Venues</h2>
        <button
          onClick={onCreateNew}
          className="px-3 py-2 rounded-xl bg-lime-500 text-black font-medium hover:bg-lime-400 transition-all duration-150 flex items-center gap-2"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-2">
        {venues.map((venue) => (
          <div
            key={venue.venueId}
            onClick={() => onVenueSelect(venue)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-150 ${
              selectedVenue?.venueId === venue.venueId
                ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
                : 'bg-neutral-800/60 border border-neutral-700 text-white hover:bg-neutral-700/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{venue.name || 'Unnamed Venue'}</h3>
                <p className="text-xs text-neutral-400 mt-1">{venue.city || 'Unknown City'}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Users size={12} />
                    {venue.capacity || 0}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {VenueTypeLabels[venue.venueType] || 'Unknown Type'}
                  </span>
                </div>
              </div>
              <MapPin size={16} className="text-neutral-400 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Venue Detail Form Component
interface VenueDetailFormProps {
  venue: VenueResponse | null;
  onSave: (data: VenueCreateForm) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  onEdit: () => void;
}

const VenueDetailForm = ({ venue, onSave, onCancel, isEditing, onEdit }: VenueDetailFormProps) => {
  const [formData, setFormData] = useState<VenueCreateForm>({
    name: venue?.name || '',
    description: venue?.description || '',
    city: venue?.city || '',
    address: venue?.address || '',
    capacity: venue?.capacity || 0,
    venueType: venue?.venueType || VenueType.Indoor
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        city: venue.city || '',
        address: venue.address || '',
        capacity: venue.capacity || 0,
        venueType: venue.venueType || VenueType.Indoor
      });
    }
  }, [venue]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (formData.capacity <= 0) newErrors.capacity = 'Capacity must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to save venue' });
    } finally {
      setLoading(false);
    }
  };

  if (!venue && !isEditing) {
    return (
      <div className="flex-1 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <MapPin size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a venue to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {isEditing && !venue ? 'Create New Venue' : venue?.name || 'Venue Details'}
        </h2>
        {venue && !isEditing && (
          <button
            onClick={onEdit}
            className="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white hover:bg-neutral-700/60 transition-all duration-150 flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
        )}
      </div>

      {errors.submit && (
        <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-neutral-400 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
              !isEditing ? 'opacity-60' : ''
            } ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs text-neutral-400 mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
              !isEditing ? 'opacity-60' : ''
            } ${errors.city ? 'border-red-500' : ''}`}
          />
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-neutral-400 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
              !isEditing ? 'opacity-60' : ''
            } ${errors.address ? 'border-red-500' : ''}`}
          />
          {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-xs text-neutral-400 mb-2">Capacity</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
              !isEditing ? 'opacity-60' : ''
            } ${errors.capacity ? 'border-red-500' : ''}`}
          />
          {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
        </div>

        <div>
          <label className="block text-xs text-neutral-400 mb-2">Venue Type</label>
          <select
            value={formData.venueType}
            onChange={(e) => setFormData({ ...formData, venueType: parseInt(e.target.value) as VenueType })}
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
              !isEditing ? 'opacity-60' : ''
            }`}
          >
            {Object.entries(VenueTypeLabels).map(([value, label]) => (
              <option key={value} value={value} className="bg-neutral-800">
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-neutral-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all resize-none ${
              !isEditing ? 'opacity-60' : ''
            }`}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-2xl bg-lime-500 text-black font-medium hover:bg-lime-400 transition-all duration-150 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-2xl bg-neutral-800/60 border border-neutral-700 text-white hover:bg-neutral-700/60 transition-all duration-150 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Seat Plan Editor Component
interface SeatPlanEditorProps {
  venue: VenueResponse | null;
}

const SeatPlanEditor = ({ venue }: SeatPlanEditorProps) => {
  const [activeTab, setActiveTab] = useState('segments');
  const [segments, setSegments] = useState<SegmentResponse[]>([]);
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateSegment, setShowCreateSegment] = useState(false);
  const [showCreateZone, setShowCreateZone] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentResponse | null>(null);

  const [segmentForm, setSegmentForm] = useState<SegmentCreateForm>({
    name: '',
    description: '',
    capacity: 0,
    segmentType: SegmentType.Standard,
    venueId: venue?.venueId || 0
  });

  const [zoneForm, setZoneForm] = useState<ZoneCreateForm>({
    name: '',
    description: '',
    capacity: 0,
    basePrice: 0,
    position: ZonePosition.Center,
    segmentId: 0
  });

  useEffect(() => {
    if (venue) {
      loadSegments();
    }
  }, [venue]);

  useEffect(() => {
    if (selectedSegment) {
      loadZonesForSegment(selectedSegment.segmentId);
    }
  }, [selectedSegment]);

  const loadSegments = async () => {
    try {
      setLoading(true);
      const data = await SegmentService.getSegmentsByVenueId(venue!.venueId);
      setSegments(data || []);
    } catch (error) {
      console.error('Failed to load segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadZonesForSegment = async (segmentId: number) => {
    try {
      const data = await ZoneService.getZonesBySegmentId(segmentId);
      setZones(data || []);
    } catch (error) {
      console.error('Failed to load zones:', error);
    }
  };

  const handleCreateSegment = async () => {
    try {
      const segmentData = {
        ...segmentForm,
        venueId: venue!.venueId
      };
      await SegmentService.createSegment(segmentData);
      setShowCreateSegment(false);
      setSegmentForm({ 
        name: '', 
        description: '', 
        capacity: 0, 
        segmentType: SegmentType.Standard,
        venueId: venue!.venueId 
      });
      loadSegments();
    } catch (error) {
      console.error('Failed to create segment:', error);
    }
  };

  const handleCreateZone = async () => {
    try {
      await ZoneService.createZone(zoneForm);
      setShowCreateZone(false);
      setZoneForm({ 
        name: '', 
        description: '', 
        capacity: 0, 
        basePrice: 0, 
        position: ZonePosition.Center, 
        segmentId: 0 
      });
      if (selectedSegment) {
        loadZonesForSegment(selectedSegment.segmentId);
      }
    } catch (error) {
      console.error('Failed to create zone:', error);
    }
  };

  const deleteSegment = async (segmentId: number) => {
    try {
      await SegmentService.deleteSegment(segmentId);
      loadSegments();
    } catch (error) {
      console.error('Failed to delete segment:', error);
    }
  };

  const deleteZone = async (zoneId: number) => {
    try {
      await ZoneService.deleteZone(zoneId);
      if (selectedSegment) {
        loadZonesForSegment(selectedSegment.segmentId);
      }
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  if (!venue) {
    return (
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 mt-4">
        <div className="text-center text-neutral-400">
          <p>Select a venue to manage seat plan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 mt-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Seat Plan Editor</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('segments')}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-150 ${
            activeTab === 'segments'
              ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
              : 'bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:text-white'
          }`}
        >
          Segments
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-150 ${
            activeTab === 'zones'
              ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
              : 'bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:text-white'
          }`}
        >
          Zones
        </button>
      </div>

      {activeTab === 'segments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">Segments</h4>
            <button
              onClick={() => setShowCreateSegment(!showCreateSegment)}
              className="px-3 py-2 rounded-xl bg-lime-500 text-black font-medium hover:bg-lime-400 transition-all duration-150 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Segment
            </button>
          </div>

          {showCreateSegment && (
            <div className="p-4 bg-neutral-800/40 border border-neutral-700 rounded-xl">
              <h5 className="font-medium text-white mb-3">Create New Segment</h5>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Segment name"
                  value={segmentForm.name}
                  onChange={(e) => setSegmentForm({ ...segmentForm, name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={segmentForm.capacity}
                  onChange={(e) => setSegmentForm({ ...segmentForm, capacity: parseInt(e.target.value) || 0 })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <select
                  value={segmentForm.segmentType}
                  onChange={(e) => setSegmentForm({ ...segmentForm, segmentType: parseInt(e.target.value) as SegmentType })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  {Object.entries(SegmentTypeLabels).map(([value, label]) => (
                    <option key={value} value={value} className="bg-neutral-800">{label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={segmentForm.description}
                  onChange={(e) => setSegmentForm({ ...segmentForm, description: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCreateSegment}
                  className="px-3 py-2 rounded-xl bg-lime-500 text-black font-medium hover:bg-lime-400 transition-all duration-150"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateSegment(false)}
                  className="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white hover:bg-neutral-700/60 transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {segments.map((segment) => (
              <div
                key={segment.segmentId}
                className="p-3 bg-neutral-800/40 border border-neutral-700 rounded-xl flex items-center justify-between hover:bg-neutral-700/40 transition-all duration-150"
              >
                <div>
                  <h5 className="font-medium text-white">{segment.name}</h5>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-neutral-400">{SegmentTypeLabels[segment.segmentType]}</span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Users size={12} />
                      {segment.capacity}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSegment(segment)}
                    className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:text-white transition-all duration-150"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => deleteSegment(segment.segmentId)}
                    className="p-2 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 hover:bg-red-900/30 transition-all duration-150"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">Zones</h4>
            <button
              onClick={() => setShowCreateZone(!showCreateZone)}
              className="px-3 py-2 rounded-xl bg-lime-500 text-black font-medium hover:bg-lime-400 transition-all duration-150 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Zone
            </button>
          </div>

          {showCreateZone && (
            <div className="p-4 bg-neutral-800/40 border border-neutral-700 rounded-xl">
              <h5 className="font-medium text-white mb-3">Create New Zone</h5>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Zone name"
                  value={zoneForm.name}
                  onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={zoneForm.capacity}
                  onChange={(e) => setZoneForm({ ...zoneForm, capacity: parseInt(e.target.value) || 0 })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <input
                  type="number"
                  placeholder="Base Price"
                  value={zoneForm.basePrice}
                  onChange={(e) => setZoneForm({ ...zoneForm, basePrice: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <select
                  value={zoneForm.position}
                  onChange={(e) => setZoneForm({ ...zoneForm, position: parseInt(e.target.value) as ZonePosition })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  {Object.entries(ZonePositionLabels).map(([value, label]) => (
                    <option key={value} value={value} className="bg-neutral-800">{label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={zoneForm.description}
                  onChange={(e) => setZoneForm({ ...zoneForm, description: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <select
                  value={zoneForm.segmentId}
                  onChange={(e) => setZoneForm({ ...zoneForm, segmentId: parseInt(e.target.value) })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option value={0}>Select Segment</option>
                  {segments.map((segment) => (
                    <option key={segment.segmentId} value={segment.segmentId} className="bg-neutral-800">
                      {segment.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCreateZone}
                  className="px-3 py-2 rounded-xl bg-lime-500 text-black font-medium hover:bg-lime-400 transition-all duration-150"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateZone(false)}
                  className="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white hover:bg-neutral-700/60 transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {zones.map((zone) => (
              <div
                key={zone.zoneId}
                className="p-3 bg-neutral-800/40 border border-neutral-700 rounded-xl flex items-center justify-between hover:bg-neutral-700/40 transition-all duration-150"
              >
                <div>
                  <h5 className="font-medium text-white">{zone.name}</h5>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-neutral-400">{ZonePositionLabels[zone.position]}</span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Users size={12} />
                      {zone.capacity}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <DollarSign size={12} />
                      {zone.basePrice}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:text-white transition-all duration-150">
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => deleteZone(zone.zoneId)}
                    className="p-2 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 hover:bg-red-900/30 transition-all duration-150"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Infrastructure Page Component
const InfrastructurePage = () => {
const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setLoading(true);
      const data = await VenueService.getAllVenues();
      setVenues(data || []);
    } catch (error) {
      console.error('Failed to load venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVenueSelect = (venue: VenueResponse): void => {
    setSelectedVenue(venue);
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    setSelectedVenue(null);
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (venueData: VenueCreateForm) => {
    try {
      if (selectedVenue) {
        // Update postojeći venue - možda trebate kreirati VenueUpdateForm
        const updated = await VenueService.updateVenue(selectedVenue.venueId, venueData);
        setSelectedVenue(updated);
        setVenues(venues.map(v => v.venueId === updated.venueId ? updated : v));
      } else {
        // Kreiraj novi venue
        const created = await VenueService.createVenue(venueData);
        setVenues([...venues, created]);
        setSelectedVenue(created);
      }
      setIsEditing(false);
      setSuccessMessage(selectedVenue ? 'Venue updated successfully' : 'Venue created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (!selectedVenue) {
      // If we were creating a new venue, clear selection
      setSelectedVenue(null);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-neutral-950 min-h-screen">
        <div className="flex-1 p-4">
          <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 h-full shadow-xl flex items-center justify-center">
            <div className="text-neutral-400">Loading venues...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-neutral-950 min-h-screen p-4 gap-4">
      {/* Left Column - Venue List */}
      <VenueList
        venues={filteredVenues}
        selectedVenue={selectedVenue}
        onVenueSelect={handleVenueSelect}
        onCreateNew={handleCreateNew}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Right Column - Details and Seat Plan */}
      <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-2rem)] overflow-hidden">
        {/* Success Message */}
        {successMessage && (
          <div className="px-4 py-3 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* Venue Details Form */}
        <div className="flex-1">
          <VenueDetailForm
            venue={selectedVenue}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
            onEdit={handleEdit}
          />
        </div>

        {/* Seat Plan Editor */}
        {(selectedVenue || isEditing) && (
          <div className="flex-shrink-0">
            <SeatPlanEditor venue={selectedVenue} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructurePage;