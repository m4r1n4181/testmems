import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AdService } from '../services/addService';
import { CampaignService } from '../services/campaignService';
import { AdTypeService } from '../services/adTypeService';
import { MediaWorkflowService } from '../services/mediaWorkflowService';
import { MediaTaskService } from '../services/mediaTaskService';
import { AuthService, type User } from '../../shared/services/authService';
import type { Ad } from '../types/api/ad';
import type { Campaign } from '../types/api/campaign';
import type { AdType } from '../types/api/adType';
import type { MediaWorkflow } from '../types/api/mediaWorkflow';
import type { CreateAdForm } from '../types/form/ad';
import type { CreateMediaWorkflowForm } from '../types/form/mediaWorkflow';
import type { CreateMediaTaskForm } from '../types/form/mediaTask';
import { AdStatus } from '../types/enums/MediaChampaign';

interface WorkflowTask {
  id: string;
  taskName: string;
  description: string;
  assignedMember: string;
  order: number;
}

const Ads = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adTypes, setAdTypes] = useState<AdType[]>([]);
  const [workflows, setWorkflows] = useState<MediaWorkflow[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState<string>('');
  const [adTypeFilter, setAdTypeFilter] = useState<string>('');
  const [phaseFilter, setPhaseFilter] = useState<string>('');

  // Edit state
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editForm, setEditForm] = useState<CreateAdForm | null>(null);

  // Workflow state
  const [useCustomWorkflow, setUseCustomWorkflow] = useState(false);
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([]);
  const [showWorkflowChoice, setShowWorkflowChoice] = useState(false);
  const [loadedWorkflowId, setLoadedWorkflowId] = useState<number | null>(null);

  const [createForm, setCreateForm] = useState<CreateAdForm>({
    deadline: '',
    title: '',
    creationDate: new Date().toISOString().split('T')[0],
    currentPhase: AdStatus.InPreparation,
    publicationDate: '',
    mediaWorkflowId: 1,
    campaignId: 0,
    adTypeId: 0,
    mediaVersionIds: [],
    integrationStatusIds: [],
    createdById: '', // Will be set on submission
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await AuthService.getMediaCampaignUsers();
      setUsers(usersData);
    } catch (error) {
      toast.error('Error loading MediaCampaign users');
      setUsers([]);
    }
  };

  const fetchData = async () => {
    try {
      const [adsData, campaignsData, adTypesData, workflowsData] = await Promise.all([
        AdService.getAllAds(),
        CampaignService.getAllCampaigns(),
        AdTypeService.getAllAdTypes(),
        MediaWorkflowService.getAllMediaWorkflows(),
      ]);
      setAds(adsData);
      setCampaigns(campaignsData);
      setAdTypes(adTypesData);
      setWorkflows(workflowsData);
      await fetchUsers();
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
      setDefaultWorkflowTasks();
    }
  };

  const setDefaultWorkflowTasks = () => {
    setWorkflowTasks([
      {
        id: 'task1',
        taskName: 'Draft copy',
        description: 'Write initial captions for IG post and story variants.',
        assignedMember: '',
        order: 1,
      },
      {
        id: 'task2',
        taskName: 'Design visuals',
        description: 'Create IG post and story assets following brand kit.',
        assignedMember: '',
        order: 2,
      },
    ]);
  };

  // Loads workflow tasks for the selected AdType
  const handleAdTypeChange = async (adTypeId: number) => {
    setCreateForm({ ...createForm, adTypeId });
    if (editForm) setEditForm({ ...editForm, adTypeId });

    const selectedAdType = adTypes.find((at) => at.adTypeId === adTypeId);

    if (selectedAdType?.mediaWorkflowId) {
      try {
        const workflow = await MediaWorkflowService.getMediaWorkflowById(selectedAdType.mediaWorkflowId);
        if (workflow?.tasks) {
          const loadedTasks = workflow.tasks.map((t: any, idx: number) => ({
            id: t.mediaTaskId ? String(t.mediaTaskId) : `task${idx + 1}`,
            taskName: t.taskName,
            description: t.description || t.taskStatus || '',
            assignedMember: '',
            order: t.order || idx + 1,
          }));
          setWorkflowTasks(loadedTasks);
          setLoadedWorkflowId(selectedAdType.mediaWorkflowId);
          setShowWorkflowChoice(true);
          setUseCustomWorkflow(false);
          toast.info('Suggested workflow loaded for this Ad Type.');
        } else {
          setWorkflowTasks([]);
          setShowWorkflowChoice(false);
        }
      } catch (error) {
        toast.error('Could not load suggested workflow.');
        setShowWorkflowChoice(false);
        setDefaultWorkflowTasks();
      }
    } else {
      setShowWorkflowChoice(false);
      setDefaultWorkflowTasks();
    }
  };

  const handleUseSuggestedWorkflow = () => {
    setUseCustomWorkflow(false);
    setShowWorkflowChoice(false);
    toast.success('Using suggested workflow');
  };

  const handleCreateCustomWorkflow = () => {
    setUseCustomWorkflow(true);
    setShowWorkflowChoice(false);
    setDefaultWorkflowTasks();
    toast.info('Creating custom workflow');
  };

  const addWorkflowTask = () => {
    const newTask: WorkflowTask = {
      id: `task${Date.now()}`,
      taskName: '',
      description: '',
      assignedMember: '',
      order: workflowTasks.length + 1,
    };
    setWorkflowTasks([...workflowTasks, newTask]);
  };

  const updateWorkflowTask = (taskId: string, field: keyof WorkflowTask, value: any) => {
    setWorkflowTasks((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)),
    );
  };

  const assignUserToTask = (taskId: string, userId: string) => {
    if (!userId) {
      toast.warning('Please select a user to assign.');
      return;
    }
    setWorkflowTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, assignedMember: userId } : task,
      ),
    );
    toast.success('User assigned to task.');
  };

  const removeWorkflowTask = (taskId: string) => {
    setWorkflowTasks((tasks) => tasks.filter((task) => task.id !== taskId));
  };

  const handleCreateAd = async () => {
    try {
      let workflowId = loadedWorkflowId;

      if (useCustomWorkflow) {
        // Create custom workflow
        const workflowForm: CreateMediaWorkflowForm = {
          workflowDescription: `Custom workflow for ${createForm.title}`,
        };
        const newWorkflow = await MediaWorkflowService.createMediaWorkflow(workflowForm);
        workflowId = newWorkflow.mediaWorkflowId;

        for (const task of workflowTasks) {
          if (task.taskName.trim()) {
            const taskForm: CreateMediaTaskForm = {
              taskName: task.taskName,
              order: task.order,
              taskStatus: 'Pending',
              workflowId: workflowId,
              managerId: task.assignedMember || undefined,
            };
            await MediaTaskService.createMediaTask(taskForm);
          }
        }
      } else if (loadedWorkflowId) {
        // Using suggested workflow - create tasks with assignments
        for (const task of workflowTasks) {
          if (task.assignedMember) {
            const taskForm: CreateMediaTaskForm = {
              taskName: task.taskName,
              order: task.order,
              taskStatus: 'Pending',
              workflowId: loadedWorkflowId,
              managerId: task.assignedMember,
            };
            await MediaTaskService.createMediaTask(taskForm);
          }
        }
      }

      const userJson = localStorage.getItem('user');
      const currentUserId = userJson ? JSON.parse(userJson).id : null;

      const adForm: CreateAdForm = {
        ...createForm,
        mediaWorkflowId: workflowId || createForm.mediaWorkflowId,
        createdById: currentUserId,                // <-- This is the field backend expects!
        title: createForm.title,                   // <-- Also add PascalCase Title for backend!
      };
      const newAd = await AdService.createAd(adForm);
      setAds([...ads, newAd]);
      resetForm();
      setShowCreateModal(false);
      toast.success('Ad created successfully!');
    } catch (error) {
      toast.error('Error creating ad!');
    }
  };

  const resetForm = () => {
    setCreateForm({
      Deadline: '',
      Title: '',
      CreationDate: new Date().toISOString().split('T')[0],
      CurrentPhase: AdStatus.InPreparation,
      PublicationDate: '',
      MediaWorkflowId: 1,
      CampaignId: 0,
      AdTypeId: 0,
      MediaVersionIds: [],
      IntegrationStatusIds: [],
      CreatedById: '', // Will be set on submission
    });
    setUseCustomWorkflow(false);
    setShowWorkflowChoice(false);
    setLoadedWorkflowId(null);
    setDefaultWorkflowTasks();
    setEditingAd(null);
    setEditForm(null);
  };

  const handleDeleteAd = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await AdService.deleteAd(id);
        setAds(ads.filter((ad) => ad.adId !== id));
        toast.success('Ad deleted!');
      } catch (error) {
        toast.error('Error deleting ad!');
      }
    }
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setEditForm({
      deadline: ad.deadline,
      title: ad.title || '',
      creationDate: ad.creationDate.split('T')[0],
      currentPhase: ad.currentPhase,
      publicationDate: ad.publicationDate ? ad.publicationDate.split('T')[0] : '',
      mediaWorkflowId: ad.mediaWorkflowId,
      campaignId: ad.campaignId,
      adTypeId: ad.adTypeId,
      mediaVersionIds: ad.mediaVersionIds || [],
      integrationStatusIds: ad.integrationStatusIds || [],
    });
    setShowCreateModal(false);
  };

  const handleSaveEditAd = async () => {
    if (editingAd && editForm) {
      try {
        const updatedAd = await AdService.updateAd(editingAd.adId, editForm);
        setAds(ads.map((a) => (a.adId === updatedAd.adId ? updatedAd : a)));
        resetForm();
        toast.success('Ad updated!');
      } catch (error) {
        toast.error('Error updating ad!');
      }
    }
  };

  const getStatusBadge = (status: AdStatus) => {
    const statusConfig = {
      [AdStatus.InPreparation]: {
        label: 'In Preparation',
        className: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
        icon: Clock,
      },
      [AdStatus.PendingApproval]: {
        label: 'Under Review',
        className: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
        icon: AlertCircle,
      },
      [AdStatus.ScheduledPublication]: {
        label: 'Scheduled for Publication',
        className: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
        icon: Calendar,
      },
      [AdStatus.Published]: {
        label: 'Published',
        className: 'bg-green-400/20 text-green-400 border-green-400/30',
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status] || statusConfig[AdStatus.InPreparation];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getCampaignName = (campaignId: number) => {
    const campaign = campaigns.find((c) => c.campaignId === campaignId);
    return campaign?.name || 'Unknown Campaign';
  };

  const getAdTypeName = (adTypeId: number) => {
    const adType = adTypes.find((at) => at.adTypeId === adTypeId);
    return adType?.typeName || 'Unknown Type';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.adId.toString().includes(searchTerm);
    const matchesCampaign = !campaignFilter || ad.campaignId.toString() === campaignFilter;
    const matchesAdType = !adTypeFilter || ad.adTypeId.toString() === adTypeFilter;
    const matchesPhase = !phaseFilter || ad.currentPhase.toString() === phaseFilter;

    return matchesSearch && matchesCampaign && matchesAdType && matchesPhase;
  });

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
          <h1 className="text-3xl font-bold text-white mb-2">Ads</h1>
          <p className="text-neutral-400">Manage your advertising content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Ad
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

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.campaignId} value={campaign.campaignId}>
                {campaign.name}
              </option>
            ))}
          </select>

          <select
            value={adTypeFilter}
            onChange={(e) => setAdTypeFilter(e.target.value)}
            className="px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Ad Type</option>
            {adTypes.map((adType) => (
              <option key={adType.adTypeId} value={adType.adTypeId}>
                {adType.typeName}
              </option>
            ))}
          </select>

          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Phase</option>
            <option value={AdStatus.InPreparation}>In Preparation</option>
            <option value={AdStatus.PendingApproval}>Under Review</option>
            <option value={AdStatus.ScheduledPublication}>Scheduled</option>
            <option value={AdStatus.Published}>Published</option>
          </select>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
        {filteredAds.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 text-sm font-medium text-neutral-400">
              <div className="col-span-2">ID</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-2">Campaign</div>
              <div className="col-span-2">Ad Type</div>
              <div className="col-span-2">Current Phase</div>
              <div className="col-span-1">Actions</div>
            </div>
            <div className="divide-y divide-neutral-700">
              {filteredAds.map((ad) => (
                <div key={ad.adId} className="grid grid-cols-12 gap-4 p-4 hover:bg-neutral-700/30 transition-colors items-center">
                  <div className="col-span-2">
                    <span className="text-purple-400 font-mono text-sm">
                      #AD-{ad.adId.toString().padStart(4, '0')}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="text-white font-medium">{ad.title || 'Untitled Ad'}</div>
                    <div className="text-neutral-400 text-sm">
                      Created: {formatDate(ad.creationDate)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-white">{getCampaignName(ad.campaignId)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-white">{getAdTypeName(ad.adTypeId)}</div>
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(ad.currentPhase)}
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-200"
                        title="Edit"
                        onClick={() => handleEditAd(ad)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.adId)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No ads found</h3>
            <p className="text-neutral-400 mb-6">Get started by creating your first ad</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
            >
              Create New Ad
            </button>
          </div>
        )}
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Create New Ad</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="Enter ad title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Campaign *</label>
                    <select
                      value={createForm.campaignId}
                      onChange={(e) => setCreateForm({ ...createForm, campaignId: Number(e.target.value) })}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value={0}>Select campaign</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.campaignId} value={campaign.campaignId}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Due Date *</label>
                    <input
                      type="date"
                      value={createForm.deadline}
                      onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Ad Type *</label>
                  <select
                    value={createForm.adTypeId}
                    onChange={(e) => handleAdTypeChange(Number(e.target.value))}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value={0}>Select type from catalog</option>
                    {adTypes.map((adType) => (
                      <option key={adType.adTypeId} value={adType.adTypeId}>
                        {adType.typeName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Instructions</label>
                  <textarea
                    placeholder="Add any production or brand instructions..."
                    rows={4}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Workflow */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-neutral-400" />
                  <span className="text-white font-medium text-lg">Workflow</span>
                  {!useCustomWorkflow && loadedWorkflowId && (
                    <span className="text-purple-400 text-sm ml-auto bg-purple-400/10 px-3 py-1 rounded-full">
                      Suggested Workflow
                    </span>
                  )}
                  {useCustomWorkflow && (
                    <span className="text-blue-400 text-sm ml-auto bg-blue-400/10 px-3 py-1 rounded-full">
                      Custom Workflow
                    </span>
                  )}
                </div>

                {/* Workflow Choice Buttons */}
                {showWorkflowChoice && (
                  <div className="flex gap-3 mb-4 p-4 bg-neutral-700/30 border border-neutral-600 rounded-xl">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium shadow-lg"
                      onClick={handleUseSuggestedWorkflow}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Use Suggested
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm font-medium"
                      onClick={handleCreateCustomWorkflow}
                    >
                      <Plus className="w-4 h-4" />
                      Create Custom
                    </button>
                  </div>
                )}

                {/* Workflow Tasks */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {workflowTasks.map((task, index) => (
                    <div key={task.id} className="p-4 bg-neutral-700/50 border border-neutral-600 rounded-xl hover:border-neutral-500 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-neutral-300 text-sm font-medium">
                          Task {index + 1} of {workflowTasks.length}
                        </span>
                        <button
                          onClick={() => removeWorkflowTask(task.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Remove task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5">Task Name</label>
                          <input
                            type="text"
                            value={task.taskName}
                            onChange={(e) => updateWorkflowTask(task.id, 'taskName', e.target.value)}
                            placeholder="e.g., Draft copy, Design visuals"
                            className="w-full p-2 bg-neutral-600 border border-neutral-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5">Description</label>
                          <textarea
                            value={task.description}
                            onChange={(e) => updateWorkflowTask(task.id, 'description', e.target.value)}
                            placeholder="Describe the task requirements..."
                            rows={2}
                            className="w-full p-2 bg-neutral-600 border border-neutral-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5">Assign to User</label>
                          <div className="flex gap-2">
                            <select
                              value={task.assignedMember}
                              onChange={(e) => updateWorkflowTask(task.id, 'assignedMember', e.target.value)}
                              className="flex-1 p-2 bg-neutral-600 border border-neutral-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                              <option value="">Select user</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.firstName} {user.lastName}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => assignUserToTask(task.id, task.assignedMember)}
                              disabled={!task.assignedMember}
                              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                              title="Assign selected user"
                            >
                              Assign
                            </button>
                          </div>
                          {task.assignedMember && (
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-green-400 text-xs font-medium">
                                Assigned to {users.find((u) => u.id === task.assignedMember)?.firstName}{' '}
                                {users.find((u) => u.id === task.assignedMember)?.lastName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Task Button - Under all tasks */}
                  <button
                    onClick={addWorkflowTask}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors text-sm font-medium border border-neutral-600 border-dashed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-700">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAd}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
                disabled={!createForm.title || !createForm.campaignId || !createForm.adTypeId || !createForm.deadline}
              >
                Create Ad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ad Modal */}
      {editingAd && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Ad</h2>
              <button
                onClick={resetForm}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Enter ad title"
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f!, title: e.target.value }))}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2">Campaign</label>
                    <select
                      value={editForm.campaignId}
                      onChange={(e) => setEditForm((f) => ({ ...f!, campaignId: Number(e.target.value) }))}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value={0}>Select campaign</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.campaignId} value={campaign.campaignId}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editForm.deadline}
                      onChange={(e) => setEditForm((f) => ({ ...f!, deadline: e.target.value }))}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Ad Type</label>
                  <select
                    value={editForm.adTypeId}
                    onChange={(e) => handleAdTypeChange(Number(e.target.value))}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value={0}>Select type from catalog</option>
                    {adTypes.map((adType) => (
                      <option key={adType.adTypeId} value={adType.adTypeId}>
                        {adType.typeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Instructions</label>
                  <textarea
                    placeholder="Add any production or brand instructions..."
                    rows={3}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-700">
              <button onClick={resetForm} className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveEditAd}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
                disabled={!editForm.title || !editForm.campaignId || !editForm.adTypeId || !editForm.deadline}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ads;