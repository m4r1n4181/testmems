import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Upload,
  Save,
  CheckSquare,
  Send,
  Eye,
  Download,
  User,
  FileText,
  XCircle,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MediaTaskService } from '../services/mediaTaskService';
import { ApprovalService } from '../services/approvalService';
import { MediaVersionService } from '../services/mediaVersionService';
import { AdService } from '../services/addService';
import { MediaWorkflowService } from '../services/mediaWorkflowService';
import type { MediaTask } from '../types/api/mediaTask';
import type { Approval } from '../types/api/approval';
import type { MediaVersion } from '../types/api/mediaVersion';
import type { Ad } from '../types/api/ad';
import type { MediaWorkflow } from '../types/api/mediaWorkflow';
import { AdStatus } from '../types/enums/MediaChampaign';

interface TaskWithDetails {
  task: MediaTask;
  ad?: Ad;
  approval?: Approval;
  versions?: MediaVersion[];
}

interface WorkflowGroup {
  workflow: MediaWorkflow;
  ad?: Ad;
  tasks: TaskWithDetails[];
}

const MyTasks = () => {
  const navigate = useNavigate();
  const [workflowGroups, setWorkflowGroups] = useState<WorkflowGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [versionFileName, setVersionFileName] = useState('');
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [previousTaskVersions, setPreviousTaskVersions] = useState<MediaVersion[]>([]);

  // Get logged-in user ID from localStorage
  const getLoggedInUserId = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      const userObj = JSON.parse(userJson);
      return userObj.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchWorkflowsData();
  }, []);

  useEffect(() => {
    const fetchPreviousVersions = async () => {
      if (selectedTask) {
        try {
          const versions = await MediaVersionService.getPreviousTaskVersions(selectedTask.task.mediaTaskId);
          setPreviousTaskVersions(versions);
        } catch (error) {
          console.error('Error fetching previous task versions:', error);
          setPreviousTaskVersions([]);
        }
      } else {
        setPreviousTaskVersions([]);
      }
    };
    fetchPreviousVersions();
  }, [selectedTask]);

  const fetchWorkflowsData = async () => {
    try {
      const userId = getLoggedInUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      // Get all tasks assigned to the user
      const userTasks = await MediaTaskService.getByManagerId(userId);

      // Get unique workflow IDs from user's tasks
      const workflowIds = [...new Set(userTasks.map(task => task.workflowId).filter(id => id != null))];

      // Fetch all workflows with their complete task lists
      const workflowGroupsData: WorkflowGroup[] = [];

      for (const workflowId of workflowIds) {
        try {
          const workflow = await MediaWorkflowService.getMediaWorkflowById(workflowId);
          
          // Get all tasks for this workflow (not just user's tasks)
          const allWorkflowTasks = await MediaTaskService.getByWorkflowId(workflowId);
          
          // Sort tasks by order
          const sortedTasks = allWorkflowTasks.sort((a, b) => a.order - b.order);

          // Build task details
          const tasksWithDetails = await Promise.all(
            sortedTasks.map(async (task) => {
              const details: TaskWithDetails = { task };
              try {
                if (task.adId) {
                  details.ad = await AdService.getAdById(task.adId);
                  details.versions = await MediaVersionService.getByAdId(task.adId);
                }
                if (task.approvalId) {
                  details.approval = await ApprovalService.getApprovalById(task.approvalId);
                }
              } catch (error) {
                console.error(`Error fetching details for task ${task.mediaTaskId}:`, error);
              }
              return details;
            })
          );

          // Get ad info from first task if available
          let ad: Ad | undefined;
          if (tasksWithDetails.length > 0 && tasksWithDetails[0].ad) {
            ad = tasksWithDetails[0].ad;
          }

          workflowGroupsData.push({
            workflow,
            ad,
            tasks: tasksWithDetails
          });
        } catch (error) {
          console.error(`Error fetching workflow ${workflowId}:`, error);
        }
      }

      setWorkflowGroups(workflowGroupsData);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return { text: 'Done', color: 'bg-green-500', textColor: 'text-white' };
      case 'approved':
        return { text: 'Approved', color: 'bg-green-500', textColor: 'text-white' };
      case 'in progress':
      case 'inpreparation':
        return { text: 'In Progress', color: 'bg-yellow-500', textColor: 'text-white' };
      case 'under approval':
      case 'pendingapproval':
        return { text: 'Under Approval', color: 'bg-orange-500', textColor: 'text-white' };
      case 'rejected':
        return { text: 'Rejected', color: 'bg-red-500', textColor: 'text-white' };
      case 'scheduled for publication':
        return { text: 'Scheduled for Publication', color: 'bg-blue-500', textColor: 'text-white' };
      default:
        return { text: status || 'Pending', color: 'bg-neutral-600', textColor: 'text-white' };
    }
  };

  const getPhaseInfo = (phase: AdStatus) => {
    switch (phase) {
      case AdStatus.InPreparation:
        return { text: 'In Preparation', color: 'text-neutral-400' };
      case AdStatus.PendingApproval:
        return { text: 'Pending Approval', color: 'text-yellow-400' };
      case AdStatus.ScheduledPublication:
        return { text: 'Scheduled Publication', color: 'text-blue-400' };
      case AdStatus.Published:
        return { text: 'Published', color: 'text-green-400' };
      default:
        return { text: 'Unknown', color: 'text-neutral-400' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setVersionFileName(file.name);
    }
  };

  // Save as draft: upload file and create a new MediaVersion
  const handleSaveDraft = async () => {
    if (!selectedTask || !fileUpload) {
      alert('Please select a file');
      return;
    }

    if (!selectedTask.ad?.adId) {
      alert('This task does not have an associated ad');
      return;
    }
    
    try {
      const fileURL = URL.createObjectURL(fileUpload);

      const createForm = {
        versionFileName: versionFileName || fileUpload.name,
        fileType: fileUpload.type,
        fileURL,
        isFinalVersion: false,
        adId: selectedTask.ad.adId
      };

      // Save the new version
      const newVersion = await MediaVersionService.createMediaVersion(createForm);
      console.log('New version created:', newVersion);

      // Fetch updated versions for the current task/ad
      const updatedVersions = await MediaVersionService.getByAdId(selectedTask.ad.adId);
      console.log('Updated versions:', updatedVersions);

      // Update the selectedTask state
      const updatedSelectedTask = {
        ...selectedTask,
        versions: updatedVersions
      };
      setSelectedTask(updatedSelectedTask);

      // Refresh the entire workflow data to keep everything in sync
      await fetchWorkflowsData();

      // Set the active version to the newly added one
      setActiveVersionId(newVersion.mediaVersionId);

      // Clear the file input
      setFileUpload(null);
      setVersionFileName('');
      
      alert('Draft version saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(`Error saving draft version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Mark as final version - updated to refresh workflow data
  const handleMarkAsFinal = async (versionId: number) => {
    if (!selectedTask?.ad?.adId) return;
    
    try {
      await MediaVersionService.updateMediaVersion(versionId, { isFinalVersion: true });
      
      // Fetch updated versions
      const updatedVersions = await MediaVersionService.getByAdId(selectedTask.ad.adId);
      
      // Update selectedTask
      const updatedSelectedTask = {
        ...selectedTask,
        versions: updatedVersions
      };
      setSelectedTask(updatedSelectedTask);
      
      // Refresh the entire workflow data to keep everything in sync
      await fetchWorkflowsData();
      
      alert('Version marked as done!');
    } catch (error) {
      console.error('Error marking as final:', error);
      alert('Error marking version as done');
    }
  };

  // Submit to Approval - fixed for resubmission
  const handleSubmitToApproval = async () => {
    if (!selectedTask) return;
    
    // Check if there's at least one final version
    const finalVersion = selectedTask.versions?.find(v => v.isFinalVersion);
    if (!finalVersion) {
      alert('Please mark at least one version as final before submitting for approval.');
      return;
    }

    try {
      const now = new Date().toISOString();
      
      // If this is a resubmission (task was rejected), we need to create a NEW approval
      // Clear the old approval reference first
      if (selectedTask.task.taskStatus?.toLowerCase() === 'rejected' && selectedTask.task.approvalId) {
        // Clear the old approval link
        await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
          approvalId: null
        });
      }
      
      // Update task status to "PendingApproval" and set submission timestamp
      await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
        taskStatus: 'PendingApproval',
        submittedForApprovalAt: now
      });

      // Create a NEW approval request with the submitted media version
      const newApproval = await ApprovalService.createApproval({
        approvalStatus: 'Pending',
        comment: '',
        approvalDate: now,
        mediaTaskId: selectedTask.task.mediaTaskId,
        submittedMediaVersionId: finalVersion.mediaVersionId
      });

      // Update the task with the new approval ID
      await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
        approvalId: newApproval.approvalId
      });

      alert('Task submitted for approval!');
      
      // Refresh the data to show updated status
      await fetchWorkflowsData();
      
      // Navigate to the approval page
      navigate(`/approval/${newApproval.approvalId}`);
    } catch (error) {
      console.error('Error submitting for approval:', error);
      alert(`Failed to submit for approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Download specific version
  const handleDownloadVersion = (version: MediaVersion) => {
    if (version.fileURL) {
      window.open(version.fileURL, '_blank');
    }
  };

  // Go back to the selected version (set active)
  const handleGoBackToVersion = (versionId: number) => {
    setActiveVersionId(versionId);
    alert('Switched to selected version.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (selectedTask) {
    const statusInfo = getStatusInfo(selectedTask.task.taskStatus);
    const versions = selectedTask.versions || [];
    const activeVersion = versions.find(v => v.mediaVersionId === activeVersionId) || versions[versions.length - 1];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedTask(null)}
              className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Tasks
            </button>
            <div className="h-6 w-px bg-neutral-600"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {selectedTask.task.taskName} • In Progress
              </h1>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Rejection Feedback Display */}
            {selectedTask.task.taskStatus?.toLowerCase() === 'rejected' && selectedTask.approval?.comment && (
              <div className="bg-red-900/20 border-2 border-red-500 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Task Rejected - Feedback from Manager</h3>
                    <p className="text-red-200 mb-4">{selectedTask.approval.comment}</p>
                    <p className="text-sm text-red-300">Please address the feedback and resubmit a new version.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Task Details */}
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Task</label>
                  <input
                    type="text"
                    value={selectedTask.ad?.title || selectedTask.task.taskName || ''}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Status</label>
                  <div className="flex">
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium ${statusInfo.color} ${statusInfo.textColor}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">File Format</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                    {activeVersion?.fileType || 'Unknown'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">File Name</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                    {activeVersion?.versionFileName || 'Unknown'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Download</label>
                  <button
                    onClick={() => activeVersion && handleDownloadVersion(activeVersion)}
                    className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-2"
                    disabled={!activeVersion?.fileURL}
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Add File</label>
                <div className="border-2 border-dashed border-neutral-600 rounded-xl p-12 text-center hover:border-neutral-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,video/*"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-400 mb-2">
                      {fileUpload ? fileUpload.name : 'Add file'}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Click to browse or drag and drop
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start gap-4">
              <button
                onClick={handleSaveDraft}
                disabled={!fileUpload}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                Save Draft
              </button>
              <button
                onClick={handleSubmitToApproval}
                disabled={!selectedTask.versions?.some(v => v.isFinalVersion)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Submit to Approval
              </button>
            </div>
          </div>

          {/* Versions Sidebar */}
          <div className="w-80 space-y-6">
            {/* Previous Task Materials */}
            {previousTaskVersions.length > 0 && (
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Materials from Previous Tasks</h3>
                <div className="space-y-3">
                  {previousTaskVersions.map((version) => (
                    <div key={version.mediaVersionId} className="p-3 bg-neutral-700/50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <span className="text-sm text-white font-medium truncate block">
                            {version.versionFileName}
                          </span>
                          <p className="text-xs text-neutral-400">
                            {version.fileType || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadVersion(version)}
                        disabled={!version.fileURL}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Download className="w-3 h-3" />
                        View/Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Task Versions */}
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Versions</h3>
              {versions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
                  <p className="text-neutral-400 text-sm">No versions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {versions.map((version, index) => (
                    <div 
                      key={version.mediaVersionId} 
                      className={`p-4 rounded-xl transition-all ${
                        activeVersionId === version.mediaVersionId 
                          ? "bg-purple-500/20 border-2 border-purple-500" 
                          : "bg-neutral-700/50 border-2 border-transparent hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">v{index + 1}</span>
                            {version.isFinalVersion && (
                              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Final
                              </span>
                            )}
                            {activeVersionId === version.mediaVersionId && !version.isFinalVersion && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-neutral-300 truncate block">
                            {version.versionFileName || 'Candidate'}
                          </span>
                          <p className="text-xs text-neutral-400 mt-1">
                            {version.fileType || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleGoBackToVersion(version.mediaVersionId)}
                          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {activeVersionId === version.mediaVersionId ? 'Viewing' : 'Switch to This'}
                        </button>
                        
                        {!version.isFinalVersion && (
                          <button
                            onClick={() => handleMarkAsFinal(version.mediaVersionId)}
                            className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckSquare className="w-4 h-4" />
                            Mark as Done
                          </button>
                        )}
                        
                        <button
                          className="w-full px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          onClick={() => handleDownloadVersion(version)}
                          disabled={!version.fileURL}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-neutral-400">View all workflows you're part of and manage your assigned tasks</p>
      </div>

      {/* Workflow Groups */}
      {workflowGroups.length > 0 ? (
        <div className="space-y-6">
          {workflowGroups.map((group) => {
            const userId = getLoggedInUserId();
            const userTaskInWorkflow = group.tasks.find(t => t.task.managerId === userId);
            
            return (
              <div key={group.workflow.mediaWorkflowId} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
                {/* Workflow Header */}
                <div className="bg-neutral-800 border-b border-neutral-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {group.ad?.title || group.workflow.workflowDescription || 'Workflow'}
                      </h2>
                      <p className="text-neutral-400 text-sm">
                        {group.workflow.workflowDescription}
                        {group.ad?.deadline && (
                          <span className="ml-4">
                            Deadline: {formatDate(group.ad.deadline)}
                          </span>
                        )}
                      </p>
                    </div>
                    {group.ad && (
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPhaseInfo(group.ad.currentPhase).color}`}>
                          {getPhaseInfo(group.ad.currentPhase).text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tasks List */}
                <div className="divide-y divide-neutral-700">
                  {group.tasks.map((taskDetail, index) => {
                    const statusInfo = getStatusInfo(taskDetail.task.taskStatus);
                    
                    // Determine if this task is locked
                    const isFirstTask = index === 0;
                    const previousTask = index > 0 ? group.tasks[index - 1] : null;
                    const isPreviousTaskCompleted = previousTask ? 
                      (previousTask.task.taskStatus?.toLowerCase() === 'approved' || 
                       previousTask.task.taskStatus?.toLowerCase() === 'done') : true;
                    const isUnlocked = isFirstTask || isPreviousTaskCompleted;
                    
                    // Check if this task is assigned to the current user
                    const isAssignedToUser = taskDetail.task.managerId === userId;
                    const assignedUserName = taskDetail.task.managerName || taskDetail.task.managerId || 'Unassigned';

                    return (
                      <div 
                        key={taskDetail.task.mediaTaskId} 
                        className={`p-4 hover:bg-neutral-700/30 transition-colors ${isAssignedToUser ? 'bg-purple-500/5' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Task Order Badge */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              isUnlocked ? 'bg-purple-500 text-white' : 'bg-neutral-700 text-neutral-400'
                            }`}>
                              {taskDetail.task.order}
                            </div>
                          </div>

                          {/* Task Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-white font-medium truncate">
                                {taskDetail.task.taskName || 'Task'}
                              </h3>
                              {isAssignedToUser && (
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                                  Your Task
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <User className="w-4 h-4" />
                                <span>{assignedUserName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.color} ${statusInfo.textColor}`}>
                              {statusInfo.text}
                            </span>
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0">
                            {!isUnlocked ? (
                              <div className="flex items-center gap-2 px-3 py-2 text-neutral-600 cursor-not-allowed" title="Complete previous task first">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm">Locked</span>
                              </div>
                            ) : isAssignedToUser ? (
                              <button
                                onClick={() => {
                                  setSelectedTask(taskDetail);
                                  setActiveVersionId(null);
                                  setFileUpload(null);
                                  setVersionFileName('');
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Work on Task
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedTask(taskDetail);
                                  setActiveVersionId(null);
                                  setFileUpload(null);
                                  setVersionFileName('');
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress indicator line */}
                        {index < group.tasks.length - 1 && (
                          <div className="ml-5 mt-2 mb-0">
                            <div className={`w-0.5 h-4 ${isPreviousTaskCompleted ? 'bg-purple-500' : 'bg-neutral-700'}`}></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No workflows assigned</h3>
          <p className="text-neutral-400">You don't have any tasks assigned at the moment</p>
        </div>
      )}
    </div>
  );
};

export default MyTasks;