import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  Plus, 
  Filter, 
  Search,
  MapPin,
  Users,
  Building,
  X,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

import SegmentService from '../types/services/segmentService';
import VenueService from '../types/services/venueService';
import type { SegmentResponse } from '../types/api/segment';
import type { VenueResponse } from '../types/api/venue';
import type { SegmentCreateForm, SegmentUpdateForm } from '../types/forms/segment';
import { SegmentType } from '../types/enums/TicketSales';
import type { ZoneResponse } from '../types/api/zone';

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border backdrop-blur-sm transition-all ${
    type === 'success' 
      ? 'bg-green-900/80 border-green-400/30 text-green-400' 
      : 'bg-red-900/80 border-red-400/30 text-red-400'
  }`}>
    <div className="flex items-center gap-2">
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const SegmentsPage: React.FC = () => {
  const [segments, setSegments] = useState<SegmentResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<SegmentResponse | null>(null);
  const [formData, setFormData] = useState<SegmentCreateForm | SegmentUpdateForm>({
    name: '',
    description: '',
    capacity: 0,
    segmentType: SegmentType.Standard,
    venueId: 0,
  });
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [zonesMap, setZonesMap] = useState<{ [key: number]: ZoneResponse[] }>({});
  const [capacityMap, setCapacityMap] = useState<{ [key: number]: number }>({});
  const [filterVenueId, setFilterVenueId] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<SegmentType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [segmentsData, venuesData] = await Promise.all([
        SegmentService.getAllSegments(),
        VenueService.getAllVenues(),
      ]);
      setSegments(segmentsData);
      setVenues(venuesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (segment?: SegmentResponse) => {
    setIsEdit(!!segment);
    setCurrentSegment(segment || null);
    setFormData({
      name: segment?.name || '',
      description: segment?.description || '',
      capacity: segment?.capacity || 0,
      segmentType: segment?.segmentType || SegmentType.Standard,
      venueId: segment?.venueId || 0,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // For TextField
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // For Select
  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && currentSegment) {
        await SegmentService.updateSegment(currentSegment.segmentId, formData as SegmentUpdateForm);
        showToast('Segment updated');
      } else {
        await SegmentService.createSegment(formData as SegmentCreateForm);
        showToast('Segment created');
      }
      fetchData();
      handleCloseModal();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      try {
        await SegmentService.deleteSegment(id);
        showToast('Segment deleted');
        fetchData();
      } catch (err: any) {
        showToast(err.message || 'Delete failed (may be linked to an event)', 'error');
      }
    }
  };

  const toggleExpand = async (id: number) => {
    const isExpanded = expandedRows.includes(id);
    setExpandedRows(isExpanded ? expandedRows.filter((row) => row !== id) : [...expandedRows, id]);

    if (!isExpanded) {
      if (!zonesMap[id]) {
        const zones = await SegmentService.getZonesBySegmentId(id);
        setZonesMap((prev) => ({ ...prev, [id]: zones }));
      }
      if (capacityMap[id] === undefined) {
        const capacity = await SegmentService.calculateSegmentTotalCapacity(id);
        setCapacityMap((prev) => ({ ...prev, [id]: capacity }));
      }
    }
  };

  const filteredSegments = segments.filter((seg) => {
    const venueMatch = filterVenueId === 'all' || seg.venueId === filterVenueId;
    const typeMatch = filterType === 'all' || seg.segmentType === filterType;
    const searchMatch = searchTerm === '' || 
      seg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVenueName(seg.venueId).toLowerCase().includes(searchTerm.toLowerCase());
    return venueMatch && typeMatch && searchMatch;
  });

  const getVenueName = (venueId: number) => venues.find((v) => v.venueId === venueId)?.name || `Venue ${venueId}`;

  const getTypeLabel = (type: SegmentType) => {
    switch (type) {
      case SegmentType.VIP: return 'VIP';
      case SegmentType.Standard: return 'Standard';
      case SegmentType.Premium: return 'Premium';
      case SegmentType.Standing: return 'Standing';
      case SegmentType.Seated: return 'Seated';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-lime-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Segments Management</h1>
          <p className="text-neutral-400 mt-1">Manage venue segments and their configurations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-lime-400 hover:bg-lime-500 text-neutral-900 font-medium rounded-2xl transition-all duration-200 shadow-lg hover:shadow-lime-400/20"
        >
          <Plus className="w-5 h-5" />
          Add Segment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4 shadow-2xl">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search segments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Venue Filter */}
          <div className="relative">
            <select
              value={filterVenueId}
              onChange={(e) => setFilterVenueId(e.target.value as number | 'all')}
              className="appearance-none bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="all">All Venues</option>
              {venues.map((venue) => (
                <option key={venue.venueId} value={venue.venueId}>{venue.name}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as SegmentType | 'all')}
              className="appearance-none bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="all">All Types</option>
              {Object.entries(SegmentType)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => (
                  <option key={value} value={value}>{key}</option>
                ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4 pointer-events-none" />
          </div>

          <div className="text-sm text-neutral-400 ml-auto">
            {filteredSegments.length} segments found
          </div>
        </div>
      </div>

      {/* Segments Table */}
      <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 w-12"></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Venue</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredSegments.map((segment) => (
                <React.Fragment key={segment.segmentId}>
                  <tr className="hover:bg-neutral-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleExpand(segment.segmentId)}
                        className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
                      >
                        {expandedRows.includes(segment.segmentId) ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-lime-400 transition-colors" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-lime-400 transition-colors" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-lime-400">#{segment.segmentId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{segment.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-300">{segment.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-medium text-white">
                        <Users className="w-4 h-4 text-neutral-400" />
                        {segment.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        segment.segmentType === SegmentType.VIP
                          ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30'
                          : segment.segmentType === SegmentType.Premium
                          ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                          : segment.segmentType === SegmentType.Standing
                          ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30'
                          : segment.segmentType === SegmentType.Seated
                          ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                          : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                      }`}>
                        {getTypeLabel(segment.segmentType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-neutral-300">
                        <Building className="w-4 h-4 text-neutral-400" />
                        {getVenueName(segment.venueId)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(segment)}
                          className="p-2 hover:bg-neutral-700 rounded-lg transition-all duration-200 text-neutral-400 hover:text-lime-400 hover:scale-105"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(segment.segmentId)}
                          className="p-2 hover:bg-neutral-700 rounded-lg transition-all duration-200 text-neutral-400 hover:text-red-400 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.includes(segment.segmentId) && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-neutral-800/20 border-t border-neutral-700">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-lime-400">
                              <Users className="w-4 h-4" />
                              <span className="font-semibold">Total Capacity:</span>
                              <span className="text-white">{capacityMap[segment.segmentId] ?? 'Loading...'}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-lime-400" />
                              Associated Zones
                            </h4>
                            {zonesMap[segment.segmentId]?.length ? (
                              <div className="bg-neutral-900/50 rounded-xl overflow-hidden border border-neutral-700">
                                <table className="w-full">
                                  <thead className="bg-neutral-800/50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">ID</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">Name</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">Capacity</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">Base Price</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300">Position</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-700">
                                    {zonesMap[segment.segmentId].map((zone) => (
                                      <tr key={zone.zoneId} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-4 py-3 text-xs text-lime-400 font-medium">#{zone.zoneId}</td>
                                        <td className="px-4 py-3 text-xs text-white">{zone.name}</td>
                                        <td className="px-4 py-3 text-xs text-neutral-300">{zone.capacity}</td>
                                        <td className="px-4 py-3 text-xs text-neutral-300">${zone.basePrice}</td>
                                        <td className="px-4 py-3 text-xs text-neutral-300">{zone.position}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-sm text-neutral-500 italic p-4 bg-neutral-800/30 rounded-xl border border-neutral-700">
                                No zones associated with this segment
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSegments.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-300 mb-2">No segments found</h3>
            <p className="text-neutral-500 mb-6">Try adjusting your search criteria or create a new segment</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-lime-400 hover:bg-lime-500 text-neutral-900 font-medium rounded-2xl transition-all duration-200"
            >
              Create First Segment
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">
                {isEdit ? 'Edit Segment' : 'Add Segment'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  placeholder="Enter segment name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleSelectChange({ target: { name: e.target.name, value: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent resize-none transition-all"
                  placeholder="Enter segment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  placeholder="Enter capacity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Type *</label>
                <select
                  name="segmentType"
                  value={formData.segmentType}
                  onChange={(e) => handleSelectChange({ target: { name: e.target.name, value: e.target.value } })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all cursor-pointer"
                >
                  {Object.entries(SegmentType)
                    .filter(([key]) => isNaN(Number(key)))
                    .map(([key, value]) => (
                      <option key={value} value={value}>{key}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Venue *</label>
                <select
                  name="venueId"
                  value={formData.venueId}
                  onChange={(e) => handleSelectChange({ target: { name: e.target.name, value: e.target.value } })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value={0}>Select a venue</option>
                  {venues.map((venue) => (
                    <option key={venue.venueId} value={venue.venueId}>{venue.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-800">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-lime-400 hover:bg-lime-500 text-neutral-900 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-lime-400/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentsPage;