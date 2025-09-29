import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  ChevronDown,
  Settings,
  ArrowLeft,
  Check
} from 'lucide-react';
import { AdTypeService } from '../services/adTypeService';
import { MediaWorkflowService } from '../services/mediaWorkflowService';
import { MediaTaskService } from '../services/mediaTaskService';
import type { AdType } from '../types/api/adType';
import type { MediaWorkflow } from '../types/api/mediaWorkflow';
import type { MediaTask } from '../types/api/mediaTask';
import type { CreateAdTypeForm } from '../types/form/adType';
import type { CreateMediaWorkflowForm } from '../types/form/mediaWorkflow';
import type { CreateMediaTaskForm } from '../types/form/mediaTask';

interface WorkflowTask {
  taskName: string;
  description: string;
  requiredRole: string;
}

const AdTypes = () => {
  const [adTypes, setAdTypes] = useState<AdType[]>([]);
  const [workflows, setWorkflows] = useState<MediaWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWorkflowView, setShowWorkflowView] = useState(false);
  const [selectedAdType, setSelectedAdType] = useState<AdType | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<MediaWorkflow | null>(null);
  const [workflowTasks, setWorkflowTasks] = useState<MediaTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');

  const [createForm, setCreateForm] = useState<CreateAdTypeForm>({
    typeName: '',
    typeDescription: '',
    dimensions: '',
    duration: 0,
    fileFormat: '',
    mediaWorkflowId: 0
  });

  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [customTasks, setCustomTasks] = useState<WorkflowTask[]>([
    { taskName: 'Design Visual', description: 'Create key visuals and thumbnails.', requiredRole: 'Designer' },
    { taskName: 'Write Copy', description: 'Craft captions and ad copy variations.', requiredRole: 'Copywriter' },
    { taskName: 'Edit Video', description: 'Assemble and edit short-form video.', requiredRole: 'Video Editor' }
  ]);

  const channels = ['All', 'Instagram', 'TikTok', 'Facebook', 'YouTube', 'Twitter'];
  const fileFormatOptions = ['JPG', 'PNG', 'MP4', 'MOV', 'DOCX', 'GIF'];
  const roleOptions = ['Designer', 'Copywriter', 'Video Editor', 'Creative Director', 'Marketing Manager'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adTypesData, workflowsData] = await Promise.all([
        AdTypeService.getAllAdTypes(),
        MediaWorkflowService.getAllMediaWorkflows()
      ]);
      setAdTypes(adTypesData);
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWorkflow = async (adType: AdType) => {
    setSelectedAdType(adType);
    try {
      const workflow = await MediaWorkflowService.getMediaWorkflowById(adType.mediaWorkflowId);
      setSelectedWorkflow(workflow);
      
      if (workflow.taskIds && workflow.taskIds.length > 0) {
        const tasksPromises = workflow.taskIds.map(taskId => 
          MediaTaskService.getMediaTaskById(taskId)
        );
        const tasks = await Promise.all(tasksPromises);
        setWorkflowTasks(tasks);
      }
      setShowWorkflowView(true);
    } catch (error) {
      console.error('Error fetching workflow:', error);
    }
  };

  const handleCreateAdType = async () => {
    try {
      let workflowId = 0;

      // Create workflow first
      if (workflowName.trim()) {
        const workflowForm: CreateMediaWorkflowForm = {
          workflowDescription: workflowDescription || workflowName
        };
        
        const newWorkflow = await MediaWorkflowService.createMediaWorkflow(workflowForm);
        workflowId = newWorkflow.mediaWorkflowId;

        // Create tasks for the workflow
        for (let i = 0; i < customTasks.length; i++) {
          const task = customTasks[i];
          if (task.taskName.trim()) {
            const taskForm: CreateMediaTaskForm = {
              taskName: task.taskName,
              order: i + 1,
              taskStatus: 'Pending',
              workflowId: workflowId
            };
            await MediaTaskService.createMediaTask(taskForm);
          }
        }
      }

      // Create the ad type
      const adTypeForm: CreateAdTypeForm = {
        ...createForm,
        fileFormat: selectedFormats.join(', '),
        mediaWorkflowId: workflowId
      };

      const newAdType = await AdTypeService.createAdType(adTypeForm);
      setAdTypes([...adTypes, newAdType]);
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating ad type:', error);
    }
  };

  const resetForm = () => {
    setCreateForm({
      typeName: '',
      typeDescription: '',
      dimensions: '',
      duration: 0,
      fileFormat: '',
      mediaWorkflowId: 0
    });
    setSelectedFormats([]);
    setWorkflowName('');
    setWorkflowDescription('');
    setCustomTasks([
      { taskName: 'Design Visual', description: 'Create key visuals and thumbnails.', requiredRole: 'Designer' },
      { taskName: 'Write Copy', description: 'Craft captions and ad copy variations.', requiredRole: 'Copywriter' },
      { taskName: 'Edit Video', description: 'Assemble and edit short-form video.', requiredRole: 'Video Editor' }
    ]);
  };

  const handleDeleteAdType = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ad type?')) {
      try {
        await AdTypeService.deleteAdType(id);
        setAdTypes(adTypes.filter(adType => adType.adTypeId !== id));
      } catch (error) {
        console.error('Error deleting ad type:', error);
      }
    }
  };

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const addTask = () => {
    setCustomTasks([...customTasks, {
      taskName: '',
      description: '',
      requiredRole: 'Designer'
    }]);
  };

  const updateTask = (index: number, field: keyof WorkflowTask, value: string) => {
    const updated = [...customTasks];
    updated[index] = { ...updated[index], [field]: value };
    setCustomTasks(updated);
  };

  const removeTask = (index: number) => {
    setCustomTasks(customTasks.filter((_, i) => i !== index));
  };

  const filteredAdTypes = adTypes.filter(adType => {
    const matchesSearch = adType.typeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adType.typeDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'All' || 
                          adType.typeName?.toLowerCase().includes(channelFilter.toLowerCase());
    return matchesSearch && matchesChannel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // Workflow Detail View
  if (showWorkflowView && selectedWorkflow && selectedAdType) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowWorkflowView(false);
                setSelectedAdType(null);
                setSelectedWorkflow(null);
                setWorkflowTasks([]);
              }}
              className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Workflow • {selectedAdType.typeName}
              </h1>
              <p className="text-neutral-400">View and manage workflow tasks</p>
            </div>
          </div>
          <button
            onClick={() => setShowWorkflowView(false)}
            className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors"
          >
            Back to Ad Types
          </button>
        </div>

        {/* Workflow Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-2">Workflow Name</label>
            <input
              type="text"
              value={selectedWorkflow.workflowDescription || 'Content Creation Flow'}
              readOnly
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-2">Short Description</label>
            <input
              type="text"
              value="Design → Copy → Video → Publish"
              readOnly
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white"
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          {workflowTasks.length > 0 ? (
            workflowTasks.map((task, index) => (
              <div key={task.mediaTaskId} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <label className="block text-xs text-neutral-400 mb-1">Task Name</label>
                    <div className="text-white font-medium">{task.taskName}</div>
                  </div>
                  <div className="col-span-5">
                    <label className="block text-xs text-neutral-400 mb-1">Description</label>
                    <div className="text-neutral-300 text-sm">{task.taskStatus || 'No description'}</div>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-neutral-400 mb-1">Required Role</label>
                    <div className="text-white">{index === 0 ? 'Designer' : index === 1 ? 'Copywriter' : 'Video Editor'}</div>
                  </div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <button className="p-2 text-neutral-400 hover:text-blue-400 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-12 text-center">
              <p className="text-neutral-400">No tasks defined for this workflow</p>
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors">
          <Plus className="w-4 h-4" />
          Add Task
        </button>

        {/* Related Ad Type Details */}
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Related Ad Type Details</h3>
          <div className="bg-neutral-700/30 rounded-xl p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-neutral-400 text-sm mb-1">Name</div>
                <div className="text-white">{selectedAdType.typeName}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-sm mb-1">Description</div>
                <div className="text-white">{selectedAdType.typeDescription || 'Square image for feed'}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-sm mb-1">Dimensions</div>
                <div className="text-white">{selectedAdType.dimensions || '1080×1080'} —</div>
              </div>
              <div>
                <div className="text-neutral-400 text-sm mb-1">Formats</div>
                <div className="text-white">{selectedAdType.fileFormat || 'JPG, PNG'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
            Delete
          </button>
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors">
            Save
          </button>
        </div>
      </div>
    );
  }

  // Main Ad Types List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ad Types</h1>
          <p className="text-neutral-400">Standardized specifications. Click a name to open its workflow.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Ad Type
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 p-4 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search ad types"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
        
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
        >
          {channels.map(channel => (
            <option key={channel} value={channel}>Channel: {channel}</option>
          ))}
        </select>
      </div>

      {/* Ad Types Table */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
        {filteredAdTypes.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 text-sm font-medium text-neutral-400">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2">File Format</div>
              <div className="col-span-1">Duration (s)</div>
              <div className="col-span-2">Dimensions (px)</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-neutral-700">
              {filteredAdTypes.map((adType) => (
                <div key={adType.adTypeId} className="grid grid-cols-12 gap-4 p-4 hover:bg-neutral-700/30 transition-colors items-center">
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📱</span>
                      <div className="text-white font-medium">{adType.typeName}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="text-neutral-300 text-sm">{adType.typeDescription || 'No description'}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-white">{adType.fileFormat || 'N/A'}</div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="text-white">{adType.duration || 0}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-white">{adType.dimensions || 'N/A'}</div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewWorkflow(adType)}
                        className="p-2 text-neutral-400 hover:text-purple-400 hover:bg-purple-400/20 rounded-lg transition-all duration-200"
                        title="Workflow"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAdType(adType.adTypeId)}
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
            <Settings className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No ad types found</h3>
            <p className="text-neutral-400 mb-6">Create your first ad type to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
            >
              New Ad Type
            </button>
          </div>
        )}
        
        {/* Footer */}
        {filteredAdTypes.length > 0 && (
          <div className="p-4 border-t border-neutral-700 text-center text-neutral-400 text-sm">
            {filteredAdTypes.length} ad type{filteredAdTypes.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Create Ad Type Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Ad Type</h2>
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

            <div className="space-y-4">
              {/* Name and Channel */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="e.g., TikTok Video"
                    value={createForm.typeName}
                    onChange={(e) => setCreateForm({...createForm, typeName: e.target.value})}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Channel</label>
                  <select
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option>Select channel</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Facebook</option>
                    <option>YouTube</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Short-form vertical video"
                  value={createForm.typeDescription}
                  onChange={(e) => setCreateForm({...createForm, typeDescription: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              {/* File Formats */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">File Formats</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {fileFormatOptions.map(format => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => toggleFormat(format)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedFormats.includes(format)
                          ? 'bg-purple-500 border-purple-500 text-white'
                          : 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:border-purple-400'
                      }`}
                    >
                      {selectedFormats.includes(format) && <Check className="w-4 h-4 inline mr-1" />}
                      {format}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-neutral-400">Choose one or more supported formats.</p>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Dimensions</label>
                <select
                  value={createForm.dimensions}
                  onChange={(e) => setCreateForm({...createForm, dimensions: e.target.value})}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">1080 × 1920</option>
                  <option value="1080x1080">1080 × 1080</option>
                  <option value="1920x1080">1920 × 1080</option>
                  <option value="1080x1350">1080 × 1350</option>
                </select>
                <p className="text-xs text-neutral-400 mt-1">Select a size</p>
              </div>

              {/* Workflow Section */}
              <div className="border-t border-neutral-700 pt-4">
                <label className="block text-sm text-neutral-300 mb-2">Workflow</label>
                <p className="text-xs text-neutral-400 mb-3">Optional. Select a preset or leave as None.</p>
                
                <div className="mb-4">
                  <label className="block text-xs text-neutral-400 mb-1">Select Workflow</label>
                  <select
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">None (Skip)</option>
                    <option value="Content Creation Flow">Content Creation Flow</option>
                    <option value="Quick Approval">Quick Approval</option>
                    <option value="Extended Review">Extended Review</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-neutral-700">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleCreateAdType}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
                disabled={!createForm.typeName || selectedFormats.length === 0}
              >
                Create Ad Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdTypes;