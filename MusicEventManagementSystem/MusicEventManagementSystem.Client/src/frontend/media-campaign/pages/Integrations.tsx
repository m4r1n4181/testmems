import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Calendar,
  Settings,
  ChevronDown,
  Filter,
  Key,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Link
} from 'lucide-react';
import { MediaChannelService } from '../services/mediaChannelService';
import { IntegrationStatusService } from '../services/intergrationStatusService';
import type { MediaChannel } from '../types/api/mediaChannel';
import type { IntegrationStatus } from '../types/api/integrationStatus';
import type { CreateMediaChannelForm } from '../types/form/mediaChannel';
import { StatusIntegration } from '../types/enums/MediaChampaign';

interface IntegrationWithChannel {
  integration: IntegrationStatus;
  channel: MediaChannel;
}

const Integrations = () => {
  const [channels, setChannels] = useState<MediaChannel[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [integrationsWithChannels, setIntegrationsWithChannels] = useState<IntegrationWithChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [createForm, setCreateForm] = useState<CreateMediaChannelForm>({
    platformType: '',
    apiKey: '',
    apiURL: '',
    apiVersion: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [channelsData, integrationsData] = await Promise.all([
        MediaChannelService.getAllMediaChannels(),
        IntegrationStatusService.getAllIntegrationStatuses()
      ]);
      
      setChannels(channelsData);
      setIntegrations(integrationsData);
      
      // Combine integrations with their corresponding channels
      const combined = integrationsData.map(integration => {
        const channel = channelsData.find(c => c.mediaChannelId === integration.channelId);
        return { integration, channel: channel! };
      }).filter(item => item.channel); // Filter out items without matching channels
      
      setIntegrationsWithChannels(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = async () => {
    try {
      const newChannel = await MediaChannelService.createMediaChannel(createForm);
      setChannels([...channels, newChannel]);
      setShowCreateModal(false);
      setCreateForm({
        platformType: '',
        apiKey: '',
        apiURL: '',
        apiVersion: ''
      });
      // Refresh data to update the combined list
      fetchData();
    } catch (error) {
      console.error('Error creating integration:', error);
    }
  };

  const handleDeleteIntegration = async (channelId: number) => {
    if (window.confirm('Are you sure you want to delete this integration?')) {
      try {
        await MediaChannelService.deleteMediaChannel(channelId);
        setChannels(channels.filter(channel => channel.mediaChannelId !== channelId));
        setIntegrationsWithChannels(integrationsWithChannels.filter(item => item.channel.mediaChannelId !== channelId));
      } catch (error) {
        console.error('Error deleting integration:', error);
      }
    }
  };

  const getStatusInfo = (status?: StatusIntegration) => {
    switch (status) {
      case StatusIntegration.Published:
        return { 
          icon: CheckCircle, 
          text: 'Synced', 
          color: 'text-green-400', 
          bgColor: 'bg-green-400/20' 
        };
      case StatusIntegration.Failed:
        return { 
          icon: XCircle, 
          text: 'Failed', 
          color: 'text-red-400', 
          bgColor: 'bg-red-400/20' 
        };
      default:
        return { 
          icon: Clock, 
          text: 'Pending', 
          color: 'text-yellow-400', 
          bgColor: 'bg-yellow-400/20' 
        };
    }
  };

  const getApiKeyStatus = (apiKey?: string) => {
    if (!apiKey) return { text: 'API Key Expired', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    return { text: 'API Key Active', color: 'text-green-400', bgColor: 'bg-green-400/20' };
  };

  const getPlatformIcon = (platformType?: string) => {
    switch (platformType?.toLowerCase()) {
      case 'instagram':
      case 'instagram business':
        return '📸';
      case 'twitter':
      case 'twitter api v2':
        return '🐦';
      case 'youtube':
      case 'youtube publishing':
        return '📺';
      case 'facebook':
      case 'facebook pages':
        return '📘';
      case 'linkedin':
      case 'linkedin company':
        return '💼';
      default:
        return '🔗';
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredIntegrations = integrationsWithChannels.filter(item =>
    item.channel.platformType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-neutral-400">Manage your social media platform connections</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Integration
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 p-4 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search integrations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Schedule and Calendar Section */}
      <div className="flex gap-6">
        {/* Integrations List */}
        <div className="flex-1 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
          {filteredIntegrations.length > 0 ? (
            <div className="divide-y divide-neutral-700">
              {filteredIntegrations.map((item) => {
                const statusInfo = getStatusInfo(item.integration.status);
                const apiKeyStatus = getApiKeyStatus(item.channel.apiKey);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={`${item.channel.mediaChannelId}-${item.integration.integrationStatusId}`} className="p-6 hover:bg-neutral-700/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {getPlatformIcon(item.channel.platformType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {item.channel.platformType}
                            </h3>
                            <div className={`flex items-center gap-1 px-2 py-1 ${apiKeyStatus.bgColor} rounded-lg`}>
                              <Key className={`w-3 h-3 ${apiKeyStatus.color}`} />
                              <span className={`text-xs ${apiKeyStatus.color} font-medium`}>
                                {apiKeyStatus.text}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              Last Sync: {formatLastSync(item.integration.lastSynced)}
                            </span>
                            <div className={`flex items-center gap-1 px-2 py-1 ${statusInfo.bgColor} rounded-lg`}>
                              <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                              <span className={`text-xs ${statusInfo.color} font-medium`}>
                                {statusInfo.text}
                              </span>
                            </div>
                          </div>
                          {item.integration.error && (
                            <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>Error: {item.integration.error}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-neutral-400 hover:text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-all duration-200"
                          title="Edit Integration"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteIntegration(item.channel.mediaChannelId)}
                          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                          title="Delete Integration"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Settings className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No integrations found</h3>
              <p className="text-neutral-400 mb-6">Connect your social media platforms to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
              >
                Add Integration
              </button>
            </div>
          )}
        </div>

        {/* Calendar Widget */}
        <div className="w-80 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">September 2025</h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-lg font-medium">Published</span>
              <span className="px-2 py-1 bg-red-400/20 text-red-400 text-xs rounded-lg font-medium">Error</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400 mb-2">
            <div className="p-2">S</div>
            <div className="p-2">M</div>
            <div className="p-2">T</div>
            <div className="p-2">W</div>
            <div className="p-2">T</div>
            <div className="p-2">F</div>
            <div className="p-2">S</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const hasEvent = [2, 8, 15, 20, 25].includes(day);
              const isError = [8, 20].includes(day);
              
              return (
                <div key={day} className="relative">
                  <div className={`p-2 text-center text-sm rounded-lg cursor-pointer transition-colors ${
                    day === 15 
                      ? 'bg-purple-500 text-white' 
                      : 'text-neutral-300 hover:bg-neutral-700'
                  }`}>
                    {day}
                  </div>
                  {hasEvent && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isError ? 'bg-red-400' : 'bg-green-400'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Integration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Add Integration</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Channel Name / Platform Type */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Channel Name</label>
                <div className="relative">
                  <select
                    value={createForm.platformType}
                    onChange={(e) => setCreateForm({...createForm, platformType: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Choose a channel</option>
                    <option value="Instagram Business">Instagram Business</option>
                    <option value="Twitter API v2">Twitter API v2</option>
                    <option value="YouTube Publishing">YouTube Publishing</option>
                    <option value="Facebook Pages">Facebook Pages</option>
                    <option value="LinkedIn Company">LinkedIn Company</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">API Key</label>
                <input
                  type="password"
                  placeholder="Paste secret here"
                  value={createForm.apiKey}
                  onChange={(e) => setCreateForm({...createForm, apiKey: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              {/* API URL */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">API URL</label>
                <input
                  type="url"
                  placeholder="https://api.service.com"
                  value={createForm.apiURL}
                  onChange={(e) => setCreateForm({...createForm, apiURL: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              {/* API Version */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">API Version</label>
                <input
                  type="text"
                  placeholder="v2"
                  value={createForm.apiVersion}
                  onChange={(e) => setCreateForm({...createForm, apiVersion: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div className="text-xs text-neutral-400">
                We never store plaintext credentials. Keys are encrypted at rest and in transit.
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
                onClick={handleCreateIntegration}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
                disabled={!createForm.platformType || !createForm.apiKey}
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

export default Integrations;