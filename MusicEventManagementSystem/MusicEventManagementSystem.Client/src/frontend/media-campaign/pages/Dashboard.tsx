import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';
import { CampaignService } from '../services/campaignService';
import { AdService } from '../services/addService';
import { ApprovalService } from '../services/approvalService';
import { MediaTaskService } from '../services/mediaTaskService';
import type { Campaign } from '../types/api/campaign';
import type { Ad } from '../types/api/ad';
import type { Approval } from '../types/api/approval';
import type { MediaTask } from '../types/api/mediaTask';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [tasks, setTasks] = useState<MediaTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, adsData, approvalsData, tasksData] = await Promise.all([
          CampaignService.getAllCampaigns(),
          AdService.getAllAds(),
          ApprovalService.getAllApprovals(),
          MediaTaskService.getAllMediaTasks()
        ]);

        setCampaigns(campaignsData);
        setAds(adsData);
        setApprovals(approvalsData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCampaigns = campaigns.filter(campaign => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    return startDate <= now && endDate >= now;
  }).length;

  const pendingApprovals = approvals.filter(approval => 
    approval.approvalStatus === 'Pending' || approval.approvalStatus === 'pending'
  ).length;

  const adsRunning = ads.filter(ad => ad.currentPhase === 4).length; // Published status

  const thisWeekPublications = ads.filter(ad => {
    if (!ad.publicationDate) return false;
    const pubDate = new Date(ad.publicationDate);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return pubDate >= weekAgo && pubDate <= now;
  }).length;

  const pendingApprovalsList = approvals
    .filter(approval => approval.approvalStatus === 'Pending' || approval.approvalStatus === 'pending')
    .slice(0, 2);

  const adProgressList = ads.slice(0, 3);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'text-yellow-400'; // In Preparation
      case 2: return 'text-blue-400'; // Pending Approval
      case 3: return 'text-purple-400'; // Scheduled Publication
      case 4: return 'text-green-400'; // Published
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'In Preparation';
      case 2: return 'Pending Approval';
      case 3: return 'Scheduled Publication';
      case 4: return 'Published';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: return <Clock className="w-4 h-4" />;
      case 2: return <AlertCircle className="w-4 h-4" />;
      case 3: return <Calendar className="w-4 h-4" />;
      case 4: return <CheckCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-neutral-400">Welcome to your Marketing Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Active Campaigns</p>
              <p className="text-3xl font-bold text-white mt-1">{activeCampaigns}</p>
            </div>
            <div className="p-3 bg-purple-400/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingApprovals}</p>
            </div>
            <div className="p-3 bg-yellow-400/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Ads Running</p>
              <p className="text-3xl font-bold text-white mt-1">{adsRunning}</p>
            </div>
            <div className="p-3 bg-green-400/20 rounded-xl">
              <Play className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">This Week Publications</p>
              <p className="text-3xl font-bold text-white mt-1">{thisWeekPublications}</p>
            </div>
            <div className="p-3 bg-blue-400/20 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Pending Approvals</h2>
            <Eye className="w-5 h-5 text-neutral-400" />
          </div>
          
          <div className="space-y-4">
            {pendingApprovalsList.length > 0 ? (
              pendingApprovalsList.map((approval) => (
                <div key={approval.approvalId} className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Media Task #{approval.mediaTaskId}</p>
                      <p className="text-neutral-400 text-sm">
                        {new Date(approval.approvalDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400">No pending approvals</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 bg-purple-400/20 hover:bg-purple-400/30 border border-purple-400/30 rounded-xl transition-all duration-200 group">
              <div className="p-3 bg-purple-400/20 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Create</p>
                <p className="text-purple-400 text-sm">Campaigns</p>
              </div>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-green-400/20 hover:bg-green-400/30 border border-green-400/30 rounded-xl transition-all duration-200 group">
              <div className="p-3 bg-green-400/20 rounded-xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Create</p>
                <p className="text-green-400 text-sm">Ads</p>
              </div>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 rounded-xl transition-all duration-200 group">
              <div className="p-3 bg-blue-400/20 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Schedule</p>
                <p className="text-blue-400 text-sm">Post</p>
              </div>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 rounded-xl transition-all duration-200 group">
              <div className="p-3 bg-yellow-400/20 rounded-xl group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">View</p>
                <p className="text-yellow-400 text-sm">Analytics</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Ad Progress */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Ad Progress</h2>
        </div>
        
        <div className="space-y-4">
          {adProgressList.length > 0 ? (
            adProgressList.map((ad) => (
              <div key={ad.adId} className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          ad.currentPhase === 1 ? 'bg-yellow-400/20' :
                          ad.currentPhase === 2 ? 'bg-blue-400/20' :
                          ad.currentPhase === 3 ? 'bg-purple-400/20' :
                          'bg-green-400/20'
                        }`}>
                          <div className={getStatusColor(ad.currentPhase)}>
                            {getStatusIcon(ad.currentPhase)}
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{ad.title || `Ad #${ad.adId}`}</p>
                          <p className="text-neutral-400 text-sm">
                            {ad.publicationDate ? `Due ${new Date(ad.publicationDate).toLocaleDateString()}` : 'No deadline set'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ad.currentPhase === 1 ? 'bg-yellow-400/20 text-yellow-400' :
                        ad.currentPhase === 2 ? 'bg-blue-400/20 text-blue-400' :
                        ad.currentPhase === 3 ? 'bg-purple-400/20 text-purple-400' :
                        'bg-green-400/20 text-green-400'
                      }`}>
                        {getStatusText(ad.currentPhase)}
                      </span>
                      <p className="text-neutral-400 text-xs mt-1">
                        {ad.currentPhase === 4 ? 'Completed' : 
                         ad.publicationDate && new Date(ad.publicationDate) < new Date() ? 'Overdue' :
                         'Due in 2 days'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Copywriter</span>
                      <div className={`w-2 h-2 rounded-full ${
                        ad.currentPhase >= 2 ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <span className={ad.currentPhase >= 2 ? 'text-green-400' : 'text-yellow-400'}>
                        {ad.currentPhase >= 2 ? 'In review' : 'In Progress'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Design</span>
                      <div className={`w-2 h-2 rounded-full ${
                        ad.currentPhase >= 3 ? 'bg-green-400' : ad.currentPhase >= 2 ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}></div>
                      <span className={
                        ad.currentPhase >= 3 ? 'text-green-400' : 
                        ad.currentPhase >= 2 ? 'text-yellow-400' : 'text-gray-400'
                      }>
                        {ad.currentPhase >= 3 ? 'Completed' : ad.currentPhase >= 2 ? 'In review' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-400">No ads in progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;