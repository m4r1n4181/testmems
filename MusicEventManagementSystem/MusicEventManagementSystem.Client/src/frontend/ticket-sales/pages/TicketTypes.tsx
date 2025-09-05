import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import { ticketTypeService } from "../services/ticketTypeService";
import type { TicketType } from "../services/ticketTypeService";

const TicketTypes = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState<TicketType | null>(null);
  const [formData, setFormData] = useState<Omit<TicketType, 'ticketTypeId'>>({
    name: '',
    description: '',
    status: '',
    availableQuantity: 0,
  });

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    try {
      setLoading(true);
      const data = await ticketTypeService.getAllTicketTypes();
      setTicketTypes(data);
    } catch (err) {
      setError('Failed to fetch ticket types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTicketType) {
        const updated = await ticketTypeService.updateTicketType(
          editingTicketType.ticketTypeId,
          { ...formData, ticketTypeId: editingTicketType.ticketTypeId }
        );
        setTicketTypes(prev => 
          prev.map(item => item.ticketTypeId === updated.ticketTypeId ? updated : item)
        );
      } else {
        const created = await ticketTypeService.createTicketType(formData);
        setTicketTypes(prev => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save ticket type');
      console.error(err);
    }
  };

  const handleEdit = (ticketType: TicketType) => {
    setEditingTicketType(ticketType);
    setFormData({
      name: ticketType.name || '',
      description: ticketType.description || '',
      status: ticketType.status || '',
      availableQuantity: ticketType.availableQuantity,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ticket type?')) {
      try {
        await ticketTypeService.deleteTicketType(id);
        setTicketTypes(prev => prev.filter(item => item.ticketTypeId !== id));
      } catch (err) {
        setError('Failed to delete ticket type');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: '',
      availableQuantity: 0,
    });
    setEditingTicketType(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="text-white h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Ticket Types</h1>
        <p className="text-neutral-400 text-sm">
          Manage different types of tickets for your events.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 hover:border-lime-400/30 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-lime-400/20 text-lime-400">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-lime-400">
              <ArrowUp className="w-3 h-3" />
              +{ticketTypes.filter(t => t.status === 'Active').length}
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs mb-1">Active Types</p>
            <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors">
              {ticketTypes.filter(t => t.status === 'Active').length}
            </h3>
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 hover:border-lime-400/30 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-blue-400/20 text-blue-400">
              <Edit className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-blue-400">
              <ArrowDown className="w-3 h-3" />
              -{ticketTypes.filter(t => t.status === 'Inactive').length}
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs mb-1">Inactive Types</p>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {ticketTypes.filter(t => t.status === 'Inactive').length}
            </h3>
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 hover:border-lime-400/30 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-purple-400/20 text-purple-400">
              <X className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-purple-400">
              <ArrowUp className="w-3 h-3" />
              +{ticketTypes.filter(t => t.status === 'Sold Out').length}
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs mb-1">Sold Out</p>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              {ticketTypes.filter(t => t.status === 'Sold Out').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">All Ticket Types</h2>
          <p className="text-neutral-400 text-sm">Create and manage ticket types</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-lime-500 hover:bg-lime-600 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 text-black font-semibold border border-lime-400/30 hover:border-lime-400"
        >
          <Plus className="w-4 h-4" />
          Add Ticket Type
        </button>
      </div>

      {/* Ticket Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto">
        {ticketTypes.map((ticketType) => (
          <div key={ticketType.ticketTypeId} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 hover:border-lime-400/30 transition-all duration-200 group">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-lime-400 transition-colors">{ticketType.name || 'Unnamed'}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(ticketType)}
                  className="p-1.5 hover:bg-neutral-700 rounded-lg transition-all duration-200 text-neutral-400 hover:text-lime-400 border border-transparent hover:border-lime-400/30"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ticketType.ticketTypeId)}
                  className="p-1.5 hover:bg-red-900/50 rounded-lg transition-all duration-200 text-neutral-400 hover:text-red-400 border border-transparent hover:border-red-400/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mb-4">{ticketType.description || 'No description provided'}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Status:</span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  ticketType.status === 'Active' ? 'bg-lime-900/50 text-lime-400 border border-lime-800/50' :
                  ticketType.status === 'Sold Out' ? 'bg-red-900/50 text-red-400 border border-red-800/50' :
                  'bg-neutral-700 text-neutral-400 border border-neutral-600'
                }`}>
                  {ticketType.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Available:</span>
                <span className="font-semibold text-white">{ticketType.availableQuantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ticketTypes.length === 0 && (
        <div className="text-center py-12 text-neutral-400 bg-neutral-800/50 rounded-xl border border-neutral-700">
          <p>No ticket types found. Create your first ticket type!</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md border border-neutral-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingTicketType ? 'Edit Ticket Type' : 'Add New Ticket Type'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200 text-neutral-400 hover:text-lime-400 border border-transparent hover:border-lime-400/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white placeholder-neutral-500 transition-all"
                  placeholder="Enter ticket type name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white placeholder-neutral-500 transition-all"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white transition-all"
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Available Quantity</label>
                <input
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableQuantity: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white placeholder-neutral-500 transition-all"
                  placeholder="Enter available quantity"
                  min="0"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-200 text-white border border-neutral-700 hover:border-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 bg-lime-500 hover:bg-lime-600 rounded-xl transition-all duration-200 text-black font-semibold border border-lime-400/30 hover:border-lime-400"
                >
                  {editingTicketType ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTypes;