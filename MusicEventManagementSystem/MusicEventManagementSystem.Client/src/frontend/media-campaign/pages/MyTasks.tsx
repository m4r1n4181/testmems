import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Upload,
  Save,
  CheckSquare,
  Send,
  Eye,
  Download,
  Clock,
  Calendar,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
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
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  // Get logged-in user ID from localStorage
  const getLoggedInUserId = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      const userObj = JSON.parse(userJson);
      // If user has an 'id' field, return it
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
        return; // Optionally, show a message "No user logged in"
      }
      const tasksData = await MediaTaskService.getByManagerId(userId);

      // Fetch additional details for each task
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

  const fetchApprovals = async () => {
    // Note: This requires authentication - disabled for demo
    // try {
    //   const approvalsData = await ApprovalService.getMyApprovals(token);
    //   setApprovals(approvalsData);
    // } catch (error) {
    //   console.error('Error fetching approvals:', error);
    // }
  };

  const getStatusInfo = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return { text: 'Done', color: 'bg-green-500', textColor: 'text-white' };
      case 'in progress':
        return { text: 'In Progress', color: 'bg-yellow-500', textColor: 'text-white' };
      case 'under approval':
        return { text: 'Under Approval', color: 'bg-orange-500', textColor: 'text-white' };
      case 'scheduled for publication':
        return { text: 'Scheduled for Publication', color: 'bg-orange-500', textColor: 'text-white' };
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
    }
  };

  const handleSubmitForApproval = async () => {
    if (!selectedTask) return;
    
    try {
      // Create approval request
      const approvalForm = {
        approvalStatus: 'Pending',
        comment: 'Submitted for review',
        approvalDate: new Date().toISOString(),
        mediaTaskId: selectedTask.task.mediaTaskId
      };
      
      await ApprovalService.createApproval(approvalForm);
      
      // Refresh data
      fetchTasksData();
      fetchApprovals();
      
      alert('Task submitted for approval successfully!');
    } catch (error) {
      console.error('Error submitting for approval:', error);
      alert('Error submitting task for approval');
    }
  };

  const handleMarkAsFinal = async (versionId: number) => {
    try {
      await MediaVersionService.updateMediaVersion(versionId, { isFinalVersion: true });
      fetchTasksData();
      alert('Version marked as final!');
    } catch (error) {
      console.error('Error marking as final:', error);
      alert('Error marking version as final');
    }
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
              Back to Workflow
            </button>
            <div className="h-6 w-px bg-neutral-600"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {selectedTask.task.taskName} • In Progress
              </h1>
            </div>
          </div>
          <button
            onClick={handleSubmitForApproval}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors font-medium"
          >
            <Send className="w-5 h-5" />
            Submit for Approval
          </button>
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
                    value={selectedTask.ad?.title || 'Create a Visual for Exit campaign'}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2">Phase</label>
                    <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-neutral-300">
                      {selectedTask.ad ? getPhaseInfo(selectedTask.ad.currentPhase).text : 'In Preparation'}
                    </div>
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
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">File Format</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                    PNG
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Dimensions</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                    1080 × 1920
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Duration</label>
                  <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                    15s
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-neutral-300 mb-2">Notes (Visual)</label>
                <div className="p-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white">
                  High contrast icons, bold CTA
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
              <button className="flex items-center gap-2 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors">
                <Save className="w-5 h-5" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors">
                <CheckSquare className="w-5 h-5" />
                Mark as Final
              </button>
              <button 
                onClick={handleSubmitForApproval}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
                Submit for Approval
              </button>
            </div>
          </div>

          {/* Versions Sidebar */}
          <div className="w-80">
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Versions</h3>
              
              <div className="space-y-4">
                {selectedTask.versions?.map((version, index) => (
                  <div key={version.mediaVersionId} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">v{index + 3}</span>
                        <span className="text-sm text-neutral-400">
                          {version.versionFileName || 'Candidate'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Uploaded {formatDate(selectedTask.ad?.creationDate || new Date().toISOString())}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
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
                
                {/* Default versions for demo */}
                <div className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">v3</span>
                      <span className="text-sm text-neutral-400">Candidate</span>
                    </div>
                    <p className="text-xs text-neutral-500">Uploaded Sep 3, 2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-neutral-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg font-medium transition-colors">
                      Mark as Final
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">v2</span>
                      <span className="text-sm text-neutral-400">Contrast tweaks</span>
                    </div>
                    <p className="text-xs text-neutral-500">Uploaded Sep 2, 2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-neutral-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg font-medium">
                      Final
                    </span>
                  </div>
                </div>
              </div>
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
            {tasks.map((taskDetail) => {
              const statusInfo = getStatusInfo(taskDetail.task.taskStatus);
              const phaseInfo = taskDetail.ad ? getPhaseInfo(taskDetail.ad.currentPhase) : { text: 'In Preparation', color: 'text-neutral-400' };
              
              return (
                <div key={taskDetail.task.mediaTaskId} className="grid grid-cols-6 gap-4 p-4 hover:bg-neutral-700/30 transition-colors items-center">
                  <div className="text-white font-medium">
                    {taskDetail.task.taskName || 'Create a Visual'}
                  </div>
                  <div className="text-neutral-300">
                    {taskDetail.ad?.title || 'Instagram Story for Exit'}
                  </div>
                  <div className="text-neutral-300">
                    {taskDetail.ad?.deadline ? formatDate(taskDetail.ad.deadline) : 'Aug 30, 2025'}
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
                    <button
                      onClick={() => setSelectedTask(taskDetail)}
                      className="flex items-center gap-2 px-3 py-1 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Workflow
                    </button>
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

      {/* MM Feedback Section */}
      {approvals.length > 0 && (
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">MM Feedback</h3>
          <div className="space-y-4">
            {approvals.slice(0, 2).map((approval) => (
              <div key={approval.approvalId} className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Create a Visual</h4>
                    <p className="text-sm text-neutral-400">
                      {approval.comment || "Visual balance is good; adjust contrast on icons"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {approval.approvalStatus?.toLowerCase() === 'approved' ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg font-medium">
                      Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg font-medium">
                      Denied
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Demo feedback items */}
            <div className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Create Promo Material</h4>
                  <p className="text-sm text-neutral-400">Visual hierarchy unclear; make CTA more prominent</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg font-medium">
                Denied
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;