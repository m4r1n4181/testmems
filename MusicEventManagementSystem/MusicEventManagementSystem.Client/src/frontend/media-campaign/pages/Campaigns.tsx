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
  ChevronDown,
  Filter
} from 'lucide-react';
import { CampaignService } from '../services/campaignService';
import type { Campaign } from '../types/api/campaign';
import type { CreateCampaignForm } from '../types/form/campaign';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [createForm, setCreateForm] = useState<CreateCampaignForm>({
    eventId: 1,
    name: '',
    startDate: '',
    endDate: '',
    totalBudget: 0,
    adIds: []
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await CampaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const newCampaign = await CampaignService.createCampaign(createForm);
      setCampaigns([...campaigns, newCampaign]);
      setShowCreateModal(false);
      setCreateForm({
        eventId: 1,
        name: '',
        startDate: '',
        endDate: '',
        totalBudget: 0,
        adIds: []
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await CampaignService.deleteCampaign(id);
        setCampaigns(campaigns.filter(campaign => campaign.campaignId !== id));
      } catch (error) {
        console.error('Error deleting campaign:', error);
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

      {/* Search and Filter Bar */}
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
        <button className="flex items-center gap-2 px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-neutral-300 hover:text-white transition-colors">
          <Filter className="w-5 h-5" />
          Sort
          <ChevronDown className="w-4 h-4" />
        </button>
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
                      className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-200"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-neutral-400 hover:text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCampaign(campaign.campaignId)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                      title="Delete"
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
                <label className="block text-sm text-neutral-300 mb-2">Campaign Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
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
                      <option value="">Select event</option>
                      <option value={1}>Exit Festival Instagram</option>
                      <option value={2}>Summer Music Fest</option>
                      <option value={3}>Rock Concert 2024</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({...createForm, endDate: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={createForm.startDate}
                  onChange={(e) => setCreateForm({...createForm, startDate: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={createForm.totalBudget || ''}
                    onChange={(e) => setCreateForm({...createForm, totalBudget: Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-1">Enter numbers only</p>
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
    </div>
  );
};

export default Campaigns;