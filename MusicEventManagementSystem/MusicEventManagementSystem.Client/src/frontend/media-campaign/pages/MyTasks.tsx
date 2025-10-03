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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MediaTaskService } from '../services/mediaTaskService';
import { ApprovalService } from '../services/approvalService';
import { MediaVersionService } from '../services/mediaVersionService';
import { AdService } from '../services/addService';
import type { MediaTask } from '../types/api/mediaTask';
import type { Approval } from '../types/api/approval';
import type { MediaVersion } from '../types/api/mediaVersion';
import type { Ad } from '../types/api/ad';
import { AdStatus } from '../types/enums/MediaChampaign';

interface TaskWithDetails {
  task: MediaTask;
  ad?: Ad;
  approval?: Approval;
  versions?: MediaVersion[];
}

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [versionFileName, setVersionFileName] = useState('');
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);

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
    fetchTasksData();
  }, []);

  const fetchTasksData = async () => {
    try {
      const userId = getLoggedInUserId();
      if (!userId) {
        setLoading(false);
        return;
      }
      const tasksData = await MediaTaskService.getByManagerId(userId);

      const tasksWithDetails = await Promise.all(
        tasksData.map(async (task) => {
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
      setTasks(tasksWithDetails);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

      // Also update the tasks array to keep it in sync
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.task.mediaTaskId === selectedTask.task.mediaTaskId 
            ? updatedSelectedTask 
            : t
        )
      );

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

  // Mark as final version
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
      
      // Update tasks array
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.task.mediaTaskId === selectedTask.task.mediaTaskId 
            ? updatedSelectedTask 
            : t
        )
      );
      
      alert('Version marked as final!');
    } catch (error) {
      console.error('Error marking as final:', error);
      alert('Error marking version as final');
    }
  };

  // Submit to Approval
  const handleSubmitToApproval = async () => {
    if (!selectedTask) return;
    
    // Check if there's at least one final version
    const hasFinalVersion = selectedTask.versions?.some(v => v.isFinalVersion);
    if (!hasFinalVersion) {
      alert('Please mark at least one version as final before submitting for approval.');
      return;
    }

    try {
      // Update task status to "PendingApproval"
      await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
        taskStatus: 'PendingApproval'
      });

      // Create an approval request
      const newApproval = await ApprovalService.createApproval({
        approvalStatus: 'Pending',
        comment: '',
        approvalDate: new Date().toISOString(),
        mediaTaskId: selectedTask.task.mediaTaskId
      });

      // Update the task with the new approval ID
      await MediaTaskService.updateMediaTask(selectedTask.task.mediaTaskId, {
        approvalId: newApproval.approvalId
      });

      alert('Task submitted for approval!');
      
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
          <div className="w-80">
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Versions</h3>
              {versions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
                  <p className="text-neutral-400 text-sm">No versions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div key={version.mediaVersionId} className={`flex items-center justify-between p-4 bg-neutral-700/50 rounded-xl ${activeVersionId === version.mediaVersionId ? "border-2 border-purple-500" : ""}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">v{index + 1}</span>
                          <span className="text-sm text-neutral-400 truncate">
                            {version.versionFileName || 'Candidate'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Uploaded {formatDate(selectedTask.ad?.creationDate || new Date().toISOString())}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-neutral-400 hover:text-white transition-colors"
                          title="Download"
                          onClick={() => handleDownloadVersion(version)}
                          disabled={!version.fileURL}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium transition-colors"
                          onClick={() => handleGoBackToVersion(version.mediaVersionId)}
                        >
                          Go Back
                        </button>
                        {version.isFinalVersion ? (
                          <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg font-medium">
                            Final
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsFinal(version.mediaVersionId)}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg font-medium transition-colors"
                          >
                            Mark as Final
                          </button>
                        )}
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
        <h1 className="text-3xl font-bold text-white mb-2">Assigned Tasks</h1>
        <p className="text-neutral-400">Manage your assigned content creation tasks</p>
      </div>

      {/* Tasks Table */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-neutral-700 text-sm font-medium text-neutral-400">
          <div>Task Name</div>
          <div>Ad Title</div>
          <div>Deadline</div>
          <div>Current Phase</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {tasks.length > 0 ? (
          <div className="divide-y divide-neutral-700">
            {tasks.map((taskDetail, index) => {
              const statusInfo = getStatusInfo(taskDetail.task.taskStatus);
              const phaseInfo = taskDetail.ad ? getPhaseInfo(taskDetail.ad.currentPhase) : { text: 'In Preparation', color: 'text-neutral-400' };
              
              // Determine if this task is locked
              // A task is unlocked if:
              // 1. It's the first task (index === 0)
              // 2. Or all previous tasks are approved
              const isUnlocked = index === 0 || tasks.slice(0, index).every(t => 
                t.task.taskStatus?.toLowerCase() === 'approved'
              );

              return (
                <div key={taskDetail.task.mediaTaskId} className="grid grid-cols-6 gap-4 p-4 hover:bg-neutral-700/30 transition-colors items-center">
                  <div className="text-white font-medium">
                    {taskDetail.task.taskName || 'Create a Visual'}
                  </div>
                  <div className="text-neutral-300">
                    {taskDetail.ad?.title || ''}
                  </div>
                  <div className="text-neutral-300">
                    {taskDetail.ad?.deadline ? formatDate(taskDetail.ad.deadline) : ''}
                  </div>
                  <div className={`${phaseInfo.color}`}>
                    {phaseInfo.text}
                  </div>
                  <div className="flex">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.color} ${statusInfo.textColor}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div>
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          setSelectedTask(taskDetail);
                          setActiveVersionId(null);
                          setFileUpload(null);
                          setVersionFileName('');
                        }}
                        className="flex items-center gap-2 px-3 py-1 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Task
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 text-neutral-600 cursor-not-allowed" title="Complete previous tasks first">
                        <Eye className="w-4 h-4" />
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tasks assigned</h3>
            <p className="text-neutral-400">You don't have any tasks assigned at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;