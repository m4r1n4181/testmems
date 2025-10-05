import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { AnalyticsService, WorkflowPerformanceSummary, AvgTaskPreparationTime } from '../services/analyticsService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [workflowPerformance, setWorkflowPerformance] = useState<WorkflowPerformanceSummary[]>([]);
  const [taskPrepTime, setTaskPrepTime] = useState<AvgTaskPreparationTime[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [performance, prepTime] = await Promise.all([
        AnalyticsService.getWorkflowPerformanceSummary(),
        AnalyticsService.getAvgTaskPreparationTime()
      ]);

      setWorkflowPerformance(performance);
      setTaskPrepTime(prepTime);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Workflow Analytics</h1>
        <p className="text-neutral-400">Performance metrics and insights for your media workflows</p>
      </div>

      {/* Workflow Performance Summary */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Workflow Performance</h2>
        </div>

        {workflowPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left text-neutral-400 font-medium py-3 px-4">Workflow</th>
                  <th className="text-left text-neutral-400 font-medium py-3 px-4">Total Ads</th>
                  <th className="text-left text-neutral-400 font-medium py-3 px-4">Completed</th>
                  <th className="text-left text-neutral-400 font-medium py-3 px-4">Avg Completion (hrs)</th>
                  <th className="text-left text-neutral-400 font-medium py-3 px-4">Avg Tasks per Ad</th>
                </tr>
              </thead>
              <tbody>
                {workflowPerformance.map((workflow) => (
                  <tr key={workflow.workflowId} className="border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors">
                    <td className="py-4 px-4 text-white font-medium">
                      {workflow.workflowDescription || `Workflow ${workflow.workflowId}`}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">{workflow.totalAds}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-medium">{workflow.completedAds}</span>
                        <span className="text-neutral-500 text-sm">
                          ({workflow.totalAds > 0 ? Math.round((workflow.completedAds / workflow.totalAds) * 100) : 0}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      {workflow.avgCompletionTimeHours?.toFixed(1) || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      {workflow.avgTasksPerAd?.toFixed(1) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No workflow performance data available yet</p>
          </div>
        )}
      </div>

      {/* Average Task Preparation Time */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Average Task Preparation Time</h2>
        </div>

        {taskPrepTime.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskPrepTime.map((task, index) => (
              <div key={index} className="bg-neutral-700/50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-medium">{task.taskName}</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                    {task.taskCount} tasks
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-400">
                    {task.avgPrepTimeHours.toFixed(1)}
                  </span>
                  <span className="text-neutral-400 text-sm">hours</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No task preparation data available yet</p>
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-neutral-300 font-medium">Total Workflows</h3>
          </div>
          <div className="text-3xl font-bold text-white">{workflowPerformance.length}</div>
          <p className="text-neutral-400 text-sm mt-1">Active workflows</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart className="w-5 h-5 text-green-400" />
            <h3 className="text-neutral-300 font-medium">Total Ads</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {workflowPerformance.reduce((sum, w) => sum + w.totalAds, 0)}
          </div>
          <p className="text-neutral-400 text-sm mt-1">Across all workflows</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-neutral-300 font-medium">Completed Ads</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {workflowPerformance.reduce((sum, w) => sum + w.completedAds, 0)}
          </div>
          <p className="text-neutral-400 text-sm mt-1">Successfully published</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
