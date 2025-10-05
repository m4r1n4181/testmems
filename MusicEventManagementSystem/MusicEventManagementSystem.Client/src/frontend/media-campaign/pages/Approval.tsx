import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApprovalService } from '../services/approvalService';
import { MediaTaskService } from '../services/mediaTaskService';
import { AdService } from '../services/addService';
import type { Approval } from '../types/api/approval';
import type { MediaTask } from '../types/api/mediaTask';
import type { Ad } from '../types/api/ad';

const ApprovalPage = () => {
  const navigate = useNavigate();
  const { approvalId } = useParams<{ approvalId: string }>();

  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<Approval | null>(null);
  const [mediaTask, setMediaTask] = useState<MediaTask | null>(null);
  const [ad, setAd] = useState<Ad | null>(null);
  const [note, setNote] = useState('');

  // Media version info (file) is unavailable so we'll use placeholders
  const [fileInfo, setFileInfo] = useState<{ fileType?: string; fileURL?: string; duration?: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!approvalId) return;
        // Get approval
        const approvalData = await ApprovalService.getApprovalById(Number(approvalId));
        setApproval(approvalData);

        // Get media task
        if (approvalData.mediaTaskId) {
          const taskData = await MediaTaskService.getMediaTaskById(approvalData.mediaTaskId);
          setMediaTask(taskData);

          // Get ad details
          if (taskData.adId) {
            const adData = await AdService.getAdById(taskData.adId);
            setAd(adData);
          }
        }

        // Use submitted media version if available
        if (approvalData.submittedMediaVersion) {
          setFileInfo({
            fileType: approvalData.submittedMediaVersion.fileType || '',
            fileURL: approvalData.submittedMediaVersion.fileURL,
          });
        }
      } catch (error) {
        console.error('Error loading approval page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [approvalId]);

  const handleApprove = async () => {
    if (!approval) return;
    try {
      const now = new Date().toISOString();
      // Update approval status
      await ApprovalService.updateApproval(approval.approvalId, {
        approvalStatus: 'Approved',
        comment: note,
        approvalDate: now,
      });

      // Update associated task status as well and set completion timestamp
      if (approval.mediaTaskId) {
        await MediaTaskService.updateMediaTask(approval.mediaTaskId, {
          taskStatus: 'Approved',
          taskCompletedAt: now
        });
      }

      alert('Task approved successfully!');
      // Now navigate back to dashboard/tasks
      navigate('/dashboard');
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve.');
    }
  };

  const handleReject = async () => {
    if (!approval) return;
    if (!note || note.trim() === '') {
      alert('Please provide feedback for the rejection.');
      return;
    }
    try {
      await ApprovalService.updateApproval(approval.approvalId, {
        approvalStatus: 'Rejected',
        comment: note,
        approvalDate: new Date().toISOString(),
      });

      // Update task status back to InProgress so creator can resubmit
      if (approval.mediaTaskId) {
        await MediaTaskService.updateMediaTask(approval.mediaTaskId, {
          taskStatus: 'Rejected'
        });
      }

      alert('Task rejected with feedback.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject.');
    }
  };

  const handleDownload = () => {
    if (fileInfo?.fileURL) {
      window.open(fileInfo.fileURL, '_blank');
    } else {
      alert('No file available for download.');
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
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar navigation is assumed to be outside this page as per wireframe */}

      <div className="flex-1 flex flex-col px-12 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-neutral-600 mx-3">/</span>
          <span className="text-neutral-400">Pending Approvals</span>
          {ad?.title && (
            <>
              <span className="text-neutral-600 mx-3">/</span>
              <span className="text-white">{ad.title}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main creative preview + controls */}
          <div className="lg:col-span-2 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-8 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">Creative Preview</h2>
              {approval?.submittedMediaVersion && (
                <div className="mb-2 text-sm text-neutral-400">
                  Submitted Version: {approval.submittedMediaVersion.versionFileName}
                </div>
              )}
              <div className="flex flex-col items-center justify-center bg-neutral-900 border border-neutral-700 rounded-2xl h-64 mb-6">
                {/* File preview: show placeholder or download */}
                {fileInfo?.fileType?.startsWith('image') && fileInfo?.fileURL ? (
                  <img
                    src={fileInfo.fileURL}
                    alt={ad?.title || mediaTask?.taskName || 'Asset preview'}
                    className="max-h-56 object-contain rounded-xl"
                  />
                ) : fileInfo?.fileType?.startsWith('video') && fileInfo?.fileURL ? (
                  <video
                    controls
                    src={fileInfo.fileURL}
                    className="max-h-56 object-contain rounded-xl"
                  />
                ) : fileInfo?.fileURL ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Download className="w-12 h-12 text-neutral-500 mb-2" />
                    <span className="text-neutral-400 text-lg">
                      {fileInfo?.fileType?.replace('.', '').toUpperCase() || 'File'}
                    </span>
                    <span className="text-neutral-500 text-sm mt-2">
                      Click download to view
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Download className="w-12 h-12 text-neutral-500 mb-2" />
                    <span className="text-neutral-400 text-lg">No preview available</span>
                  </div>
                )}
                <span className="text-white mt-4 text-center">
                  {ad?.title || mediaTask?.taskName || 'Asset'}
                  <span className="block text-neutral-400 text-sm mt-1">
                    {ad?.dimensions || '1080 x 1920'}
                  </span>
                </span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors font-medium mb-6"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-neutral-300 mb-2">Campaign</label>
                <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-4 text-white">
                  {ad?.campaignName || 'Unknown Campaign'}
                </div>
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">Channel</label>
                <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-4 text-white">
                  {ad?.adTypeName || 'Unknown Channel'}
                </div>
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">Scheduled</label>
                <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-4 text-white">
                  {ad?.publicationDate
                    ? new Date(ad.publicationDate).toLocaleString()
                    : 'Not scheduled'}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-neutral-300 mb-2">Add a note for this asset</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full p-4 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                placeholder="Add your feedback or notes here..."
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium text-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </div>
          </div>
          {/* Details sidebar */}
          <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-8 flex flex-col gap-6 min-w-[300px]">
            <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
            <div>
              <label className="block text-neutral-400 mb-1">Status</label>
              <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-white font-medium">
                {approval?.approvalStatus === 'Pending'
                  ? 'Awaiting Approval'
                  : approval?.approvalStatus || 'Unknown'}
              </div>
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">File Type</label>
              <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-white font-medium">
                {fileInfo?.fileType || '.mp4'}
              </div>
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Duration</label>
              <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-white font-medium">
                {fileInfo?.duration ? `${fileInfo.duration}s` : '15s'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPage;