const API_BASE_URL = 'http://localhost:5255/api';

export interface WorkflowPhaseEfficiency {
  phaseName: string;
  avgTimeHours: number;
  taskCount: number;
}

export interface UserApprovalRate {
  totalTasks: number;
  approvedTasks: number;
  rejectedTasks: number;
  approvalRate: number;
}

export interface AvgTaskPreparationTime {
  taskName: string;
  avgPrepTimeHours: number;
  taskCount: number;
}

export interface WorkflowPerformanceSummary {
  workflowId: number;
  workflowDescription?: string;
  totalAds: number;
  completedAds: number;
  avgCompletionTimeHours?: number;
  avgTasksPerAd?: number;
}

export class AnalyticsService {
  private static readonly BASE_URL = `${API_BASE_URL}/Analytics`;

  static async getWorkflowPhaseEfficiency(workflowId: number): Promise<WorkflowPhaseEfficiency[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/workflow-phase-efficiency/${workflowId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching workflow phase efficiency:', error);
      throw error;
    }
  }

  static async getUserApprovalRate(managerId: string): Promise<UserApprovalRate> {
    try {
      const response = await fetch(`${this.BASE_URL}/user-approval-rate/${managerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user approval rate:', error);
      throw error;
    }
  }

  static async getAvgTaskPreparationTime(): Promise<AvgTaskPreparationTime[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/avg-task-preparation-time`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching avg task preparation time:', error);
      throw error;
    }
  }

  static async getWorkflowPerformanceSummary(): Promise<WorkflowPerformanceSummary[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/workflow-performance-summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching workflow performance summary:', error);
      throw error;
    }
  }
}
