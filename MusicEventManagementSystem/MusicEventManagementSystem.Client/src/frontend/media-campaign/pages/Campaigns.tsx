import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Calendar,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { CampaignService } from '../services/campaignService';
import type { Campaign } from '../types/api/campaign';
import type { CreateCampaignForm, UpdateCampaignForm } from '../types/form/campaign';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [createForm, setCreateForm] = useState<CreateCampaignForm>({
    eventId: 1,
    name: '',
    startDate: '',
    endDate: '',
    totalBudget: 0,
    adIds: []
  });
  const [editForm, setEditForm] = useState<UpdateCampaignForm>({});

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await CampaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      alert('Error loading campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      // Validate required fields
      if (!createForm.name || !createForm.startDate || !createForm.endDate) {
        alert('Please fill in all required fields.');
        return;
      }

      console.log('Creating campaign with data:', createForm);

      // Create the campaign in the database
      const newCampaign = await CampaignService.createCampaign(createForm);
      
      console.log('Campaign created successfully:', newCampaign);
      
      // Update local state with the new campaign
      setCampaigns(prev => [...prev, newCampaign]);
      
      // Close modal and reset form
      setShowCreateModal(false);
      setCreateForm({
        eventId: 1,
        name: '',
        startDate: '',
        endDate: '',
        totalBudget: 0,
        adIds: []
      });
      
      // Show success message
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Detailed error creating campaign:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          alert('API endpoint not found. Please check if the server is running.');
        } else if (error.message.includes('400')) {
          alert('Invalid data format. Please check all fields.');
        } else if (error.message.includes('Failed to fetch')) {
          alert('Cannot connect to server. Please check your connection.');
        } else {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert('Unknown error occurred. Check console for details.');
      }
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditForm({
      eventId: campaign.eventId,
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      totalBudget: campaign.totalBudget,
      adIds: campaign.adIds
    });
    setShowEditModal(true);
  };

  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      // Validate required fields
      if (!editForm.name || !editForm.startDate || !editForm.endDate) {
        alert('Please fill in all required fields.');
        return;
      }

      const updatedCampaign = await CampaignService.updateCampaign(
        selectedCampaign.campaignId,
        editForm
      );
      
      // Update local state
      setCampaigns(prev => prev.map(campaign => 
        campaign.campaignId === selectedCampaign.campaignId 
          ? updatedCampaign 
          : campaign
      ));
      
      // Close modal and reset
      setShowEditModal(false);
      setSelectedCampaign(null);
      setEditForm({});
      
      alert('Campaign updated successfully!');
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Error updating campaign. Please try again.');
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await CampaignService.deleteCampaign(id);
        setCampaigns(campaigns.filter(campaign => campaign.campaignId !== id));
        alert('Campaign deleted successfully!');
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Error deleting campaign. Please try again.');
      }
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForInput = (dateString: string) => {
    return dateString ? dateString.split('T')[0] : '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-neutral-400">Manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Campaign
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 p-4 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search campaigns, ads, workflows"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
        {filteredCampaigns.length > 0 ? (
          <div className="divide-y divide-neutral-700">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.campaignId} className="p-6 hover:bg-neutral-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-400/20 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(campaign.totalBudget)}
                        </span>
                        <span className="flex items-center gap-1">
                          📊 {campaign.adIds?.length || 0} Ads
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewCampaign(campaign)}
                      className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-200"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleEditCampaign(campaign)}
                      className="p-2 text-neutral-400 hover:text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-all duration-200"
                      title="Edit Campaign"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCampaign(campaign.campaignId)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No campaigns found</h3>
            <p className="text-neutral-400 mb-6">Get started by creating your first campaign</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
            >
              Create New Campaign
            </button>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Campaign</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Event */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Event</label>
                  <div className="relative">
                    <select
                      value={createForm.eventId}
                      onChange={(e) => setCreateForm({...createForm, eventId: Number(e.target.value)})}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value={1}>Exit Festival Instagram</option>
                      <option value={2}>Summer Music Fest</option>
                      <option value={3}>Rock Concert 2024</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Budget</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="0"
                      value={createForm.totalBudget || ''}
                      onChange={(e) => setCreateForm({...createForm, totalBudget: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({...createForm, startDate: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({...createForm, endDate: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
                disabled={!createForm.name || !createForm.startDate || !createForm.endDate}
              >
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Campaign Modal */}
      {showViewModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Campaign Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Campaign Name</label>
                <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl">
                  <p className="text-white font-medium">{selectedCampaign.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Event ID</label>
                  <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl">
                    <p className="text-white">{selectedCampaign.eventId}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Budget</label>
                  <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl">
                    <p className="text-white">{formatCurrency(selectedCampaign.totalBudget)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Start Date</label>
                  <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl">
                    <p className="text-white">{formatDate(selectedCampaign.startDate)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">End Date</label>
                  <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl">
                    <p className="text-white">{formatDate(selectedCampaign.endDate)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-2">Associated Ads</label>
                <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl">
                  <p className="text-white">{selectedCampaign.adIds?.length || 0} ads</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Campaign</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Event */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Event</label>
                  <div className="relative">
                    <select
                      value={editForm.eventId || ''}
                      onChange={(e) => setEditForm({...editForm, eventId: Number(e.target.value)})}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="">Select event</option>
                      <option value={1}>Exit Festival Instagram</option>
                      <option value={2}>Summer Music Fest</option>
                      <option value={3}>Rock Concert 2024</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Budget</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="0"
                      value={editForm.totalBudget || ''}
                      onChange={(e) => setEditForm({...editForm, totalBudget: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formatDateForInput(editForm.startDate || '')}
                    onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formatDateForInput(editForm.endDate || '')}
                    onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCampaign}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
                disabled={!editForm.name || !editForm.startDate || !editForm.endDate}
              >
                Update Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;