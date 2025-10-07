import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Upload,
  Save,
  CheckSquare,
  Send,
  Eye,
  Download,
  FileText,
  XCircle,
  Lock,
  CheckCircle,
  User,
  Trophy,
  Clock,
  AlertCircle,
  Calendar,
  Target,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MediaTaskService } from '../services/mediaTaskService';
import { ApprovalService } from '../services/approvalService';
import { AuthService, type User as AuthUser } from '../../shared/services/authService';
import { MediaVersionService } from '../services/mediaVersionService';
import { AdService } from '../services/addService';
import { MediaWorkflowService } from '../services/mediaWorkflowService';
import type { MediaTask } from '../types/api/mediaTask';
import type { Approval } from '../types/api/approval';
import type { MediaVersion } from '../types/api/mediaVersion';
import type { Ad } from '../types/api/ad';
import type { MediaWorkflow } from '../types/api/mediaWorkflow';
import { AdStatus } from '../types/enums/MediaChampaign';

// Enum mapping (must match backend values)
export const MediaTaskStatus = {
  InPreparation: 1,
  PendingApproval: 2,
  Approved: 3,
  Rejected: 4,
} as const;

export const MediaTaskStatusNames: Record<number, string> = {
  1: "In Preparation",
  2: "Under Review",
  3: "Approved",
  4: "Rejected",
};

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
  const [usersMap, setUsersMap] = useState<{ [id: string]: AuthUser }>({});

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
          const finalVersions = versions.filter(v => v.isFinalVersion);
          setPreviousTaskVersions(finalVersions);
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

      const userTasks = await MediaTaskService.getByManagerId(userId);
      const workflowIds = [...new Set(userTasks.map(task => task.workflowId).filter(id => id != null))];

      const workflowGroupsData: WorkflowGroup[] = [];
      let allManagerIds: Set<string> = new Set();

      for (const workflowId of workflowIds) {
        try {
          const workflow = await MediaWorkflowService.getMediaWorkflowById(workflowId);
          const allWorkflowTasks = await MediaTaskService.getByWorkflowId(workflowId);
          const sortedTasks = allWorkflowTasks.sort((a, b) => a.order - b.order);

          sortedTasks.forEach(task => {
            if (task.managerId) allManagerIds.add(task.managerId);
          });

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

      workflowGroupsData.sort((a, b) => {
        const dateA = a.ad?.creationDate ? new Date(a.ad.creationDate).getTime() : 0;
        const dateB = b.ad?.creationDate ? new Date(b.ad.creationDate).getTime() : 0;
        return dateB - dateA;
      });

      const managerIdArray = Array.from(allManagerIds);
      const userObjs: { [id: string]: AuthUser } = {};
      await Promise.all(
        managerIdArray.map(async (id) => {
          try {
            const user = await AuthService.getUserById(id);
            userObjs[id] = user;
          } catch (error) {
            // Skip if user not found
          }
        })
      );
      setUsersMap(userObjs);

      setWorkflowGroups(workflowGroupsData);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status?: number) => {
    switch (status) {
      case MediaTaskStatus.Approved:
        return { text: 'Approved', color: 'bg-green-500', textColor: 'text-white' };
      case MediaTaskStatus.InPreparation:
        return { text: 'In Preparation', color: 'bg-blue-500', textColor: 'text-white' };
      case MediaTaskStatus.PendingApproval:
        return { text: 'Under Review', color: 'bg-orange-500', textColor: 'text-white' };
      case MediaTaskStatus.Rejected:
        return { text: 'Rejected', color: 'bg-red-500', textColor: 'text-white' };
      default:
        return { text: 'Pending', color: 'bg-neutral-600', textColor: 'text-white' };
    }
  };

  const getPhaseInfo = (phase: AdStatus) => {
    switch (phase) {
      case AdStatus.InPreparation:
        return { text: 'In Preparation', color: 'text-blue-400' };
      case AdStatus.PendingApproval:
        return { text: 'Pending Approval', color: 'text-yellow-400' };
      case AdStatus.ScheduledPublication:
        return { text: 'Scheduled Publication', color: 'text-purple-400' };
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

  const canUserEdit = (taskDetail: TaskWithDetails, userId: string | null): boolean => {
    if (!userId || taskDetail.task.managerId !== userId) return false;
    return (
      taskDetail.task.taskStatus === MediaTaskStatus.InPreparation ||
      taskDetail.task.taskStatus === MediaTaskStatus.Rejected
    );
  };

  const isTaskUnlocked = (taskDetail: TaskWithDetails, allTasks: TaskWithDetails[], userId: string | null): boolean => {
    if (taskDetail.task.managerId !== userId) return false;
    if (taskDetail.task.taskStatus === MediaTaskStatus.Rejected) return true;
    if (taskDetail.task.order === 1) return true;

    const previousTask = allTasks.find(t => t.task.order === taskDetail.task.order - 1);
    if (!previousTask) return false;

    return previousTask.task.taskStatus === MediaTaskStatus.Approved;
  };

  const isWorkflowComplete = (tasks: TaskWithDetails[]): boolean => {
    return tasks.every(t => t.task.taskStatus === MediaTaskStatus.Approved);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setVersionFileName(file.name);
    }
  };

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

      const newVersion = await MediaVersionService.createMediaVersion(createForm);
      const updatedVersions = await MediaVersionService.getByAdId(selectedTask.ad.adId);

      const updatedSelectedTask = {
        ...selectedTask,
        versions: updatedVersions
      };
      setSelectedTask(updatedSelectedTask);
      await fetchWorkflowsData();

      setActiveVersionId(newVersion.mediaVersionId);
      setFileUpload(null);
      setVersionFileName('');
      alert('Draft version saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(`Error saving draft version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMarkAsFinal = async (versionId: number) => {
    if (!selectedTask?.ad?.adId) return;
    try {
      const allVersions = selectedTask.versions || [];
      await Promise.all(
        allVersions
          .filter(v => v.isFinalVersion && v.mediaVersionId !== versionId)
          .map(v => MediaVersionService.updateMediaVersion(v.mediaVersionId, { isFinalVersion: false }))
      );

      await MediaVersionService.updateMediaVersion(versionId, { isFinalVersion: true });
      const updatedVersions = await MediaVersionService.getByAdId(selectedTask.ad.adId);
      const updatedSelectedTask = {
        ...selectedTask,
        versions: updatedVersions
      };
      setSelectedTask(updatedSelectedTask);
      await fetchWorkflowsData();
      alert('Version marked as final!');
    } catch (error) {
      console.error('Error marking as final:', error);
      alert('Error marking version as final');
    }
  };

  const handleSubmitToApproval = async () => {
    if (!selectedTask) return;
    const finalVersion = selectedTask.versions?.find(v => v.isFinalVersion);
    if (!finalVersion) {
      alert('Please mark at least one version as final before submitting for approval.');
      return;
    }
    try {
      const now = new Date().toISOString();
      
      if (selectedTask.task.taskStatus === MediaTaskStatus.Rejected && selectedTask.task.approvalId) {
        await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
          approvalId: undefined
        });
      }

      await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
        taskStatus: MediaTaskStatus.PendingApproval,
        submittedForApprovalAt: now
      });

      const newApproval = await ApprovalService.createApproval({
        approvalStatus: 'Pending',
        comment: '',
        approvalDate: now,
        mediaTaskId: selectedTask.task.mediaTaskId,
        submittedMediaVersionId: finalVersion.mediaVersionId
      });

      await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
        approvalId: newApproval.approvalId
      });

      alert('Task submitted for approval!');
      await fetchWorkflowsData();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error submitting for approval:', error);
      alert(`Failed to submit for approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDownloadVersion = (version: MediaVersion) => {
    if (version.fileURL) {
      window.open(version.fileURL, '_blank');
    }
  };

  const handleGoBackToVersion = (versionId: number) => {
    setActiveVersionId(versionId);
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
    const isRejected = selectedTask.task.taskStatus === MediaTaskStatus.Rejected;
    const userId = getLoggedInUserId();
    const canEdit = canUserEdit(selectedTask, userId);
    const isAssignedToMe = selectedTask.task.managerId === userId;

    return (
      <div className="space-y-6">
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
                {selectedTask.task.taskName}
              </h1>
              <p className="text-sm text-neutral-400 mt-1">Step {selectedTask.task.order} of workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isAssignedToMe && (
              <span className="px-3 py-1 bg-neutral-700 text-neutral-300 rounded-lg text-sm font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Only
              </span>
            )}
            <span className={`px-4 py-2 rounded-xl text-sm font-medium ${statusInfo.color} ${statusInfo.textColor}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Ad Information Card */}
        {selectedTask.ad && (
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-3">Ad Campaign Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Campaign Name</p>
                    <p className="text-sm text-white font-medium">{selectedTask.ad.title || 'Untitled Campaign'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Deadline</p>
                    <p className="text-sm text-white font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedTask.ad.deadline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Current Phase</p>
                    <p className={`text-sm font-medium ${getPhaseInfo(selectedTask.ad.currentPhase).color}`}>
                      {getPhaseInfo(selectedTask.ad.currentPhase).text}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Creation Date</p>
                    <p className="text-sm text-white font-medium">{formatDate(selectedTask.ad.creationDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            {isRejected && selectedTask.approval?.comment && (
              <div className="bg-red-900/20 border-2 border-red-500 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Task Rejected - Manager Feedback</h3>
                    <p className="text-red-200 mb-4">{selectedTask.approval.comment}</p>
                    <p className="text-sm text-red-300">Please address the feedback and resubmit a new version.</p>
                  </div>
                </div>
              </div>
            )}

            {!canEdit && isAssignedToMe && (
              <div className="bg-orange-900/20 border border-orange-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-orange-400" />
                  <p className="text-orange-300 text-sm">
                    This task is currently under review. You cannot make changes until it's approved or rejected.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Task Name</label>
                  <input
                    type="text"
                    value={selectedTask.task.taskName || ''}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Assigned To</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    {selectedTask.task.managerId && usersMap[selectedTask.task.managerId]
                      ? `${usersMap[selectedTask.task.managerId].firstName} ${usersMap[selectedTask.task.managerId].lastName}`
                      : 'Unassigned'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">File Format</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                    {activeVersion?.fileType || 'Not uploaded'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">File Name</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white truncate">
                    {activeVersion?.versionFileName || 'Not uploaded'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Download</label>
                  <button
                    onClick={() => activeVersion && handleDownloadVersion(activeVersion)}
                    className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!activeVersion?.fileURL}
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>

              {canEdit && (
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Upload New Version</label>
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
              )}
            </div>

            {canEdit && (
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
                  {isRejected ? 'Resubmit for Approval' : 'Submit for Approval'}
                </button>
              </div>
            )}
          </div>

          <div className="w-80 space-y-6">
            {previousTaskVersions.length > 0 && (
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Previous Task Materials</h3>
                <p className="text-xs text-neutral-400 mb-4">Final approved versions from earlier steps</p>
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
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      </div>
                      <button
                        onClick={() => handleDownloadVersion(version)}
                        disabled={!version.fileURL}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {isAssignedToMe ? 'Your Versions' : 'Task Versions'}
              </h3>
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
                          </div>
                          <span className="text-sm text-neutral-300 truncate block">
                            {version.versionFileName}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleGoBackToVersion(version.mediaVersionId)}
                          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {activeVersionId === version.mediaVersionId ? 'Viewing' : 'View'}
                        </button>
                        
                        {canEdit && !version.isFinalVersion && (
                          <button
                            onClick={() => handleMarkAsFinal(version.mediaVersionId)}
                            className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckSquare className="w-4 h-4" />
                            Mark as Final
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-neutral-400">View workflows you're part of and manage your assigned tasks</p>
      </div>

      {workflowGroups.length > 0 ? (
        <div className="space-y-6">
          {workflowGroups.map((group) => {
            const userId = getLoggedInUserId();
            const workflowComplete = isWorkflowComplete(group.tasks);
            
            return (
              <div key={group.workflow.mediaWorkflowId} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
                <div className="bg-neutral-800 border-b border-neutral-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-white">
                          {group.ad?.title || group.workflow.workflowDescription || 'Workflow'}
                        </h2>
                        {workflowComplete && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                            <Trophy className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">Complete</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <span>{group.workflow.workflowDescription}</span>
                        {group.ad?.deadline && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Deadline: {formatDate(group.ad.deadline)}</span>
                            </div>
                          </>
                        )}
                      </div>
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

                {workflowComplete && (
                  <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-700/50 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <p className="text-green-300 font-medium">
                        All tasks in this workflow have been completed and approved!
                      </p>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-neutral-700">
                  {group.tasks.map((taskDetail, index) => {
                    const statusInfo = getStatusInfo(taskDetail.task.taskStatus);
                    const isUnlocked = isTaskUnlocked(taskDetail, group.tasks, userId);
                    const isAssignedToUser = taskDetail.task.managerId === userId;
                    const previousTask = index > 0 ? group.tasks[index - 1] : null;
                    const isPreviousTaskComplete = previousTask ? 
                      (previousTask.task.taskStatus === MediaTaskStatus.Approved) : true;

                    let assignedUserName = "Unassigned";
                    if (taskDetail.task.managerId && usersMap[taskDetail.task.managerId]) {
                      assignedUserName = `${usersMap[taskDetail.task.managerId].firstName} ${usersMap[taskDetail.task.managerId].lastName}`;
                    }

                    return (
                      <div 
                        key={taskDetail.task.mediaTaskId} 
                        className={`p-4 hover:bg-neutral-700/30 transition-colors ${isAssignedToUser ? 'bg-purple-500/5' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              isPreviousTaskComplete ? 'bg-purple-500 text-white' : 'bg-neutral-700 text-neutral-400'
                            }`}>
                              {taskDetail.task.order}
                            </div>
                          </div>

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

                          <div className="flex-shrink-0">
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.color} ${statusInfo.textColor}`}>
                              {statusInfo.text}
                            </span>
                          </div>

                          <div className="flex-shrink-0">
                            {!isPreviousTaskComplete ? (
                              <div className="flex items-center gap-2 px-3 py-2 text-neutral-500 cursor-not-allowed" title="Previous task must be completed first">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm">Locked</span>
                              </div>
                            ) : !isAssignedToUser ? (
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
                            ) : isUnlocked ? (
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
                                View
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 text-neutral-500" title="Complete previous task to unlock">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm">Waiting</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {index < group.tasks.length - 1 && (
                          <div className="ml-5 mt-2 mb-0">
                            <div className={`w-0.5 h-4 ${isPreviousTaskComplete ? 'bg-purple-500' : 'bg-neutral-700'}`}></div>
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