import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle,
  GitBranch
} from 'lucide-react';
import { MediaWorkflowService } from '../services/mediaWorkflowService';
import { MediaTaskService } from '../services/mediaTaskService';
import type { MediaWorkflow } from '../types/api/mediaWorkflow';
import type { MediaTask } from '../types/api/mediaTask';
import type { UpdateMediaWorkflowForm, CreateMediaWorkflowForm, MediaTaskForm } from '../types/form/mediaWorkflow';

interface TaskForm {
  mediaTaskId?: number;
  taskName: string;
  description: string;
  order: number;
}

const DEFAULT_TASKS: TaskForm[] = [
  { taskName: 'Design Visual', description: 'Create key visuals and thumbnails.', order: 1 },
  { taskName: 'Write Copy', description: 'Craft captions and ad copy variations.', order: 2 },
  { taskName: 'Edit Video', description: 'Assemble and edit short-form video.', order: 3 }
];

const Workflows = () => {
  const [workflows, setWorkflows] = useState<MediaWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<MediaWorkflow | null>(null);
  const [workflowTasks, setWorkflowTasks] = useState<TaskForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [workflowName, setWorkflowName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Clear success messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const workflowsData = await MediaWorkflowService.getAllMediaWorkflows();
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWorkflowTaskCount = (workflow: MediaWorkflow): number => {
    if (!workflow.tasks || workflow.tasks.length === 0) return 0;
    return workflow.tasks.length;
  };

  const handleViewWorkflow = async (workflow: MediaWorkflow) => {
    setSelectedWorkflow(workflow);
    setWorkflowName(workflow.workflowDescription || '');
    setShortDescription('');
    setEditingTaskIndex(null);

    try {
      if (workflow.tasks && workflow.tasks.length > 0) {
        const taskForms: TaskForm[] = workflow.tasks.map((task: MediaTask) => ({
          mediaTaskId: task.mediaTaskId,
          taskName: task.taskName || '',
          description: task.taskStatus || '',
          order: task.order
        }));
        setWorkflowTasks(taskForms);
      } else {
        setWorkflowTasks([...DEFAULT_TASKS]);
      }
      setShowDetailView(true);
    } catch (error) {
      console.error('Error fetching workflow tasks:', error);
    }
  };

  const handleCreateWorkflow = async () => {
    setActionLoading(true);
    try {
      // Send tasks with names/status/orders, backend should create tasks!
      const createForm: CreateMediaWorkflowForm = {
        workflowDescription: workflowName,
        tasks: workflowTasks.map((task, idx) => ({
          taskName: task.taskName,
          order: idx + 1,
          taskStatus: task.description
        }))
      };
      const createdWorkflow = await MediaWorkflowService.createMediaWorkflow(createForm);
      setSuccessMessage('Workflow and tasks created successfully!');

      await fetchData();
      setShowCreateModal(false);
      resetCreateForm();
    } catch (error) {
      setSuccessMessage('Error creating workflow');
      console.error('Error creating workflow:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveWorkflow = async () => {
    if (!selectedWorkflow) return;
    setActionLoading(true);

    try {
      const updateForm: UpdateMediaWorkflowForm = {
        workflowDescription: workflowName,
        tasks: workflowTasks.map((task, idx) => ({
          taskName: task.taskName,
          order: idx + 1,
          taskStatus: task.description
        }))
      };
      await MediaWorkflowService.updateMediaWorkflow(selectedWorkflow.mediaWorkflowId, updateForm);
      setSuccessMessage('Workflow and tasks updated successfully!');
      await fetchData();
      setShowDetailView(false);
      setSelectedWorkflow(null);
    } catch (error) {
      setSuccessMessage('Error updating workflow');
      console.error('Error saving workflow:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const resetCreateForm = () => {
    setWorkflowName('');
    setShortDescription('');
    setWorkflowTasks([...DEFAULT_TASKS]);
    setEditingTaskIndex(null);
  };

  const handleDeleteWorkflow = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setActionLoading(true);
      try {
        await MediaWorkflowService.deleteMediaWorkflow(id);
        setSuccessMessage('Workflow deleted!');
        setWorkflows(workflows.filter(w => w.mediaWorkflowId !== id));
      } catch (error) {
        setSuccessMessage('Error deleting workflow');
        console.error('Error deleting workflow:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteCurrentWorkflow = async () => {
    if (!selectedWorkflow) return;
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setActionLoading(true);
      try {
        await MediaWorkflowService.deleteMediaWorkflow(selectedWorkflow.mediaWorkflowId);
        setSuccessMessage('Workflow deleted!');
        setWorkflows(workflows.filter(w => w.mediaWorkflowId !== selectedWorkflow.mediaWorkflowId));
        setShowDetailView(false);
        setSelectedWorkflow(null);
      } catch (error) {
        setSuccessMessage('Error deleting workflow');
        console.error('Error deleting workflow:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const addTask = () => {
    setWorkflowTasks([...workflowTasks, {
      taskName: '',
      description: '',
      order: workflowTasks.length + 1
    }]);
  };

  const updateTask = (index: number, field: keyof TaskForm, value: string) => {
    const updated = [...workflowTasks];
    updated[index] = { ...updated[index], [field]: value };
    setWorkflowTasks(updated);
  };

  const removeTask = async (index: number) => {
    setWorkflowTasks(workflowTasks.filter((_, i) => i !== index));
    if (editingTaskIndex === index) setEditingTaskIndex(null);
    setSuccessMessage('Task removed');
  };

  const startEditTask = (index: number) => {
    setEditingTaskIndex(index);
  };

  const saveEditTask = () => {
    setEditingTaskIndex(null);
    setSuccessMessage('Task updated');
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.workflowDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (showDetailView && selectedWorkflow) {
    return (
      <div className="space-y-6">
        {successMessage && (
          <div className="mb-2 text-center bg-green-800/70 border border-green-500 rounded-xl py-2 px-6 text-green-300 font-semibold">
            {successMessage}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Workflow • Instagram Post</h1>
          </div>
          <button
            onClick={() => {
              setShowDetailView(false);
              setSelectedWorkflow(null);
              setEditingTaskIndex(null);
            }}
            className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-2">Workflow Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-2">Short Description</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          {workflowTasks.map((task, index) => (
            <div key={index} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <div className="grid grid-cols-10 gap-4 items-center">
                <div className="col-span-4">
                  <label className="block text-xs text-neutral-400 mb-2">Task Name</label>
                  {editingTaskIndex === index ? (
                    <input
                      type="text"
                      value={task.taskName}
                      onChange={(e) => updateTask(index, 'taskName', e.target.value)}
                      className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <span className="text-white">{task.taskName}</span>
                  )}
                </div>
                <div className="col-span-5">
                  <label className="block text-xs text-neutral-400 mb-2">Description</label>
                  {editingTaskIndex === index ? (
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <span className="text-white">{task.description}</span>
                  )}
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  {editingTaskIndex === index ? (
                    <button
                      onClick={saveEditTask}
                      className="p-2 text-green-400 hover:text-green-600 transition-colors"
                      disabled={actionLoading}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditTask(index)}
                        className="p-2 text-neutral-400 hover:text-yellow-400 transition-colors"
                        title="Edit Task"
                        disabled={actionLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeTask(index)}
                        className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete Task"
                        disabled={actionLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addTask} className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors" disabled={actionLoading}>
          <Plus className="w-4 h-4" />
          Add Task
        </button>

        <div className="flex justify-end gap-3">
          <button onClick={handleDeleteCurrentWorkflow} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors" disabled={actionLoading}>
            Delete
          </button>
          <button onClick={handleSaveWorkflow} className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors" disabled={actionLoading}>
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="mb-2 text-center bg-green-800/70 border border-green-500 rounded-xl py-2 px-6 text-green-300 font-semibold">
          {successMessage}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workflows</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 font-medium" onClick={() => setShowCreateModal(true)} disabled={actionLoading}>
          <Plus className="w-5 h-5" />
          New Workflow
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search workflows"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-neutral-400">
        <GitBranch className="w-4 h-4" />
        <span>{filteredWorkflows.length} Workflows</span>
      </div>

      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
        {filteredWorkflows.length > 0 ? (
          <>
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 text-sm font-medium text-neutral-400">
              <div className="col-span-4">Workflow Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Number of Tasks</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="divide-y divide-neutral-700">
              {filteredWorkflows.map((workflow) => (
                <div key={workflow.mediaWorkflowId} className="grid grid-cols-12 gap-4 p-4 hover:bg-neutral-700/30 transition-colors items-center">
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-purple-400" />
                      <div className="text-white font-medium">{workflow.workflowDescription || 'Unnamed Workflow'}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-5">
                    <div className="text-neutral-300 text-sm">Design, write text, edit video.</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">{getWorkflowTaskCount(workflow)}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleViewWorkflow(workflow)} className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-200" title="View/Edit Workflow" disabled={actionLoading}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleViewWorkflow(workflow)} className="p-2 text-neutral-400 hover:text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-all duration-200" title="Edit" disabled={actionLoading}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteWorkflow(workflow.mediaWorkflowId)} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200" title="Delete" disabled={actionLoading}>
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
            <GitBranch className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No workflows found</h3>
            <p className="text-neutral-400 mb-6">Create your first workflow to get started</p>
            <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors" disabled={actionLoading}>New Workflow</button>
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {successMessage && (
              <div className="mb-2 text-center bg-green-800/70 border border-green-500 rounded-xl py-2 px-6 text-green-300 font-semibold">
                {successMessage}
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Workflow</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g., Content Creation Flow"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  disabled={actionLoading}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Short Description</label>
                <input
                  type="text"
                  placeholder="Design → Copy → Video → Publish"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-white font-medium mb-3">Workflow Tasks</h3>
              <div className="space-y-4">
                {workflowTasks.map((task, index) => (
                  <div key={index} className="bg-neutral-700/50 border border-neutral-600 rounded-xl p-4">
                    <div className="grid grid-cols-10 gap-4 items-center">
                      <div className="col-span-4">
                        <label className="block text-xs text-neutral-400 mb-2">Task Name</label>
                        <input
                          type="text"
                          value={task.taskName}
                          onChange={(e) => updateTask(index, 'taskName', e.target.value)}
                          className="w-full p-2 bg-neutral-600 border border-neutral-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          disabled={actionLoading}
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs text-neutral-400 mb-2">Description</label>
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) => updateTask(index, 'description', e.target.value)}
                          className="w-full p-2 bg-neutral-600 border border-neutral-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          disabled={actionLoading}
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeTask(index)}
                          className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                          disabled={actionLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addTask}
                className="flex items-center gap-2 px-4 py-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                disabled={actionLoading}
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-neutral-700">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
                disabled={!workflowName.trim() || workflowTasks.length === 0 || actionLoading}
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;