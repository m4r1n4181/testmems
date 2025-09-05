import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, AlertCircle, MapPin, Users, DollarSign, Star, Circle, Square } from "lucide-react";
import { zoneService } from "../services/zoneService";
import type { Zone, CreateZoneDto } from "../services/zoneService";

const Zones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateZoneDto>({
    name: "",
    description: "",
    capacity: 0,
    basePrice: 0,
    position: ""
  });

  // Fetch zones on component mount
  useEffect(() => {
    fetchZones();
  }, []);

  // Fetch all zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await zoneService.getAllZones();
      setZones(data);
    } catch (error) {
      setError("Failed to fetch zones. Please try again.");
      console.error("Error fetching zones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new zone
  const createZone = async () => {
    try {
      setSubmitting(true);
      setError("");
      await zoneService.createZone(formData);
      await fetchZones();
      closeModal();
    } catch (error) {
      setError("Failed to create zone. Please try again.");
      console.error("Error creating zone:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update zone
  const updateZone = async () => {
    if (!editingZone) return;
    try {
      setSubmitting(true);
      setError("");
      await zoneService.updateZone(editingZone.zoneId, formData);
      await fetchZones();
      closeModal();
    } catch (error) {
      setError("Failed to update zone. Please try again.");
      console.error("Error updating zone:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete zone
  const deleteZone = async (id: number) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;
    try {
      await zoneService.deleteZone(id);
      await fetchZones();
    } catch (error) {
      setError("Failed to delete zone. Please try again.");
      console.error("Error deleting zone:", error);
    }
  };

  // Open modal for create/edit
  const openModal = (zone?: Zone) => {
    setError("");
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name || "",
        description: zone.description || "",
        capacity: zone.capacity,
        basePrice: zone.basePrice,
        position: zone.position || ""
      });
    } else {
      setEditingZone(null);
      setFormData({
        name: "",
        description: "",
        capacity: 0,
        basePrice: 0,
        position: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateZone();
    } else {
      createZone();
    }
  };

  const handleInputChange = (field: keyof CreateZoneDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get position icon and color
  const getPositionIcon = (position: string) => {
    switch (position?.toLowerCase()) {
      case 'front':
      case 'stage':
        return { icon: <Star className="w-5 h-5" />, color: 'from-yellow-500 to-yellow-600' };
      case 'middle':
      case 'center':
        return { icon: <Circle className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' };
      case 'back':
      case 'rear':
        return { icon: <Square className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' };
      case 'vip':
        return { icon: <Star className="w-5 h-5" />, color: 'from-lime-500 to-lime-600' };
      default:
        return { icon: <MapPin className="w-5 h-5" />, color: 'from-gray-500 to-gray-600' };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get stats
  const totalZones = zones.length;
  const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
  const avgBasePrice = totalZones > 0 ? zones.reduce((sum, zone) => sum + zone.basePrice, 0) / totalZones : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading zones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Zones</h1>
          <p className="text-gray-400">Manage venue zones and pricing</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-black px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium shadow-lg hover:shadow-lime-500/25"
        >
          <Plus size={20} />
          Add Zone
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
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Zones</p>
              <h3 className="text-2xl font-bold text-white">{totalZones}</h3>
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
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Base Price</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(avgBasePrice)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => {
          const { icon, color } = getPositionIcon(zone.position || '');
          return (
            <div
              key={zone.zoneId}
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
                      {zone.name || "Unnamed Zone"}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">{zone.position || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(zone)}
                    className="p-2 bg-neutral-800 hover:bg-blue-600 rounded-lg transition-colors"
                    title="Edit zone"
                  >
                    <Edit size={16} className="text-gray-400 hover:text-white" />
                  </button>
                  <button
                    onClick={() => deleteZone(zone.zoneId)}
                    className="p-2 bg-neutral-800 hover:bg-red-600 rounded-lg transition-colors"
                    title="Delete zone"
                  >
                    <Trash2 size={16} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Capacity:</span>
                  <span className="text-lime-400 font-bold">{zone.capacity.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Base Price:</span>
                  <span className="text-lime-400 font-bold">{formatCurrency(zone.basePrice)}</span>
                </div>
                {zone.description && (
                  <div className="pt-2 border-t border-neutral-800">
                    <p className="text-gray-300 text-xs">{zone.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {zones.length === 0 && !loading && (
        <div className="text-center py-16 bg-neutral-900/30 rounded-2xl border border-neutral-800">
          <div className="p-4 bg-neutral-800/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg mb-2">No zones found</p>
          <p className="text-gray-500 text-sm">Create your first zone to get started!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lime-500/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingZone ? "Edit Zone" : "Add New Zone"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {editingZone ? "Update zone information" : "Create a new venue zone"}
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
                  Zone Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 border border-neutral-700 focus:border-lime-500 transition-colors"
                  placeholder="Enter zone name"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 border border-neutral-700 focus:border-lime-500 transition-colors"
                  required
                  disabled={submitting}
                >
                  <option value="">Select position</option>
                  <option value="front">Front</option>
                  <option value="middle">Middle</option>
                  <option value="back">Back</option>
                  <option value="vip">VIP</option>
                  <option value="stage">Stage</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Base Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice || ""}
                    onChange={(e) => handleInputChange("basePrice", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 border border-neutral-700 focus:border-lime-500 transition-colors"
                    placeholder="0.00"
                    min="0"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full p-3 bg-neutral-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 h-20 resize-none border border-neutral-700 focus:border-lime-500 transition-colors"
                  placeholder="Zone description (optional)"
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
                    ? (editingZone ? "Updating..." : "Creating...") 
                    : (editingZone ? "Update Zone" : "Create Zone")
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

export default Zones;