import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, AlertCircle, Grid3x3, Users, BarChart3 } from "lucide-react";
import { segmentService } from "../services/segmentService";
import type { Segment, CreateSegmentDto } from "../services/segmentService";

const Segments = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateSegmentDto>({
    name: "",
    description: "",
    capacity: 0,
    segmentType: ""
  });

  // Fetch all segments
  const fetchSegments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await segmentService.getAllSegments();
      setSegments(data);
    } catch (error) {
      setError("Failed to fetch segments. Please try again.");
      console.error("Error fetching segments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new segment
  const createSegment = async () => {
    try {
      setSubmitting(true);
      setError("");
      await segmentService.createSegment(formData);
      await fetchSegments();
      closeModal();
    } catch (error) {
      setError("Failed to create segment. Please try again.");
      console.error("Error creating segment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update segment
  const updateSegment = async () => {
    if (!editingSegment) return;

    try {
      setSubmitting(true);
      setError("");
      await segmentService.updateSegment(editingSegment.segmentId, formData);
      await fetchSegments();
      closeModal();
    } catch (error) {
      setError("Failed to update segment. Please try again.");
      console.error("Error updating segment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete segment
  const deleteSegment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this segment?")) return;

    try {
      await segmentService.deleteSegment(id);
      await fetchSegments();
    } catch (error) {
      setError("Failed to delete segment. Please try again.");
      console.error("Error deleting segment:", error);
    }
  };

  // Open modal for create/edit
  const openModal = (segment?: Segment) => {
    setError("");
    if (segment) {
      setEditingSegment(segment);
      setFormData({
        name: segment.name || "",
        description: segment.description || "",
        capacity: segment.capacity,
        segmentType: segment.segmentType || ""
      });
    } else {
      setEditingSegment(null);
      setFormData({
        name: "",
        description: "",
        capacity: 0,
        segmentType: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSegment(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSegment) {
      updateSegment();
    } else {
      createSegment();
    }
  };

  const handleInputChange = (field: keyof CreateSegmentDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get segment type icon and color
  const getSegmentTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'vip':
        return { icon: <BarChart3 className="w-5 h-5" />, color: 'from-yellow-500 to-yellow-600' };
      case 'general':
        return { icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' };
      case 'premium':
        return { icon: <Grid3x3 className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' };
      default:
        return { icon: <Grid3x3 className="w-5 h-5" />, color: 'from-gray-500 to-gray-600' };
    }
  };

  // Get stats
  const totalCapacity = segments.reduce((sum, segment) => sum + segment.capacity, 0);
  const totalSegments = segments.length;
  const avgCapacity = totalSegments > 0 ? Math.round(totalCapacity / totalSegments) : 0;

  useEffect(() => {
    fetchSegments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading segments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Segments</h1>
          <p className="text-gray-400">Manage venue segments and sections</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-black px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium shadow-lg hover:shadow-lime-500/25"
        >
          <Plus size={20} />
          Add Segment
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Grid3x3 className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Segments</p>
              <h3 className="text-2xl font-bold text-white">{totalSegments}</h3>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Capacity</p>
              <h3 className="text-2xl font-bold text-white">{totalCapacity.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Capacity</p>
              <h3 className="text-2xl font-bold text-white">{avgCapacity.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => {
          const { icon, color } = getSegmentTypeIcon(segment.segmentType);
          return (
            <div
              key={segment.segmentId}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-xl hover:border-neutral-700 transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${color} bg-opacity-20 rounded-lg`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-lime-400 transition-colors">
                      {segment.name || "Unnamed Segment"}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">{segment.segmentType || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(segment)}
                    className="p-2 bg-neutral-800 hover:bg-blue-600 rounded-lg transition-colors"
                    title="Edit segment"
                  >
                    <Edit size={16} className="text-gray-400 hover:text-white" />
                  </button>
                  <button
                    onClick={() => deleteSegment(segment.segmentId)}
                    className="p-2 bg-neutral-800 hover:bg-red-600 rounded-lg transition-colors"
                    title="Delete segment"
                  >
                    <Trash2 size={16} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Capacity:</span>
                  <span className="text-lime-400 font-bold">{segment.capacity.toLocaleString()}</span>
                </div>
                {segment.description && (
                  <div className="pt-2 border-t border-neutral-800">
                    <p className="text-gray-300 text-xs">{segment.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {segments.length === 0 && !loading && (
        <div className="text-center py-16 bg-neutral-900/30 rounded-2xl border border-neutral-800">
          <div className="p-4 bg-neutral-800/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Grid3x3 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg mb-2">No segments found</p>
          <p className="text-gray-500 text-sm">Create your first segment to get started!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lime-500/20 rounded-lg">
                  <Grid3x3 className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingSegment ? "Edit Segment" : "Add New Segment"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {editingSegment ? "Update segment information" : "Create a new venue segment"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-3 mb-6">
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Segment Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 border border-neutral-700 focus:border-lime-500 transition-colors"
                  placeholder="Enter segment name"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Segment Type *
                </label>
                <select
                  value={formData.segmentType}
                  onChange={(e) => handleInputChange("segmentType", e.target.value)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 border border-neutral-700 focus:border-lime-500 transition-colors"
                  required
                  disabled={submitting}
                >
                  <option value="">Select segment type</option>
                  <option value="VIP">VIP</option>
                  <option value="Premium">Premium</option>
                  <option value="General">General</option>
                  <option value="Standing">Standing</option>
                  <option value="Seating">Seating</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity || ""}
                  onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 border border-neutral-700 focus:border-lime-500 transition-colors"
                  placeholder="0"
                  min="1"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 h-20 resize-none border border-neutral-700 focus:border-lime-500 transition-colors"
                  placeholder="Segment description (optional)"
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 disabled:from-lime-700 disabled:to-lime-800 disabled:cursor-not-allowed text-black py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
                >
                  {submitting 
                    ? (editingSegment ? "Updating..." : "Creating...") 
                    : (editingSegment ? "Update Segment" : "Create Segment")
                  }
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors border border-neutral-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Segments;