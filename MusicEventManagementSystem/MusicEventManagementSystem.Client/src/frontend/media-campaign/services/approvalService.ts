import type { Approval } from '../types/api/approval';
import type { CreateApprovalForm, UpdateApprovalForm } from '../types/form/approval';

const API_BASE_URL = 'http://localhost:5255/api';

export class ApprovalService {
  private static readonly BASE_URL = `${API_BASE_URL}/Approval`;

  // GET: api/Approval
  static async getAllApprovals(): Promise<Approval[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals:', error);
      throw new Error('Failed to fetch approvals');
    }
  }

  // GET: api/Approval/{id}
  static async getApprovalById(id: number): Promise<Approval> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Approval with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching approval ${id}:`, error);
      throw error;
    }
  }

  // POST: api/Approval
  static async createApproval(createForm: CreateApprovalForm): Promise<Approval> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating approval:', error);
      throw new Error('Failed to create approval');
    }
  }

  // PUT: api/Approval/{id}
  static async updateApproval(id: number, updateForm: UpdateApprovalForm): Promise<Approval> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Approval with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating approval ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/Approval/{id}
  static async deleteApproval(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Approval with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting approval ${id}:`, error);
      throw error;
    }
  }

  // GET: api/Approval/approvalStatus/{approvalStatus}
  static async getByApprovalStatus(approvalStatus: string): Promise<Approval[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/approvalStatus/${encodeURIComponent(approvalStatus)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals by status:', error);
      throw new Error('Failed to fetch approvals by status');
    }
  }

  // GET: api/Approval/comment/{comment}
  static async getByComment(comment: string): Promise<Approval[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/comment/${encodeURIComponent(comment)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals by comment:', error);
      throw new Error('Failed to fetch approvals by comment');
    }
  }

  // GET: api/Approval/approvalDate/{approvalDate}
  static async getByApprovalDate(approvalDate: Date): Promise<Approval[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/approvalDate/${approvalDate.toISOString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals by approval date:', error);
      throw new Error('Failed to fetch approvals by approval date');
    }
  }

  // GET: api/Approval/mediaTaskId/{mediaTaskId}
  static async getByMediaTaskId(mediaTaskId: number): Promise<Approval[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/mediaTaskId/${mediaTaskId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals by media task ID:', error);
      throw new Error('Failed to fetch approvals by media task ID');
    }
  }

  // GET: api/Approval/my-approvals
static async getMyApprovals(token: string): Promise<Approval[]> {
  const response = await fetch(`${this.BASE_URL}/my-approvals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch approvals for manager');
  return await response.json();
}
}