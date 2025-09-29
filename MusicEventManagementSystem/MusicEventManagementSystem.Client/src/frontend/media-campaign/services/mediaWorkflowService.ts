import type { MediaWorkflow } from '../types/api/mediaWorkflow';
import type { 
  CreateMediaWorkflowForm, 
  UpdateMediaWorkflowForm,
  MediaTaskForm
} from '../types/form/mediaWorkflow';

const API_BASE_URL = 'https://localhost:7050/api';

export class MediaWorkflowService {
  private static readonly BASE_URL = `${API_BASE_URL}/MediaWorkflow`;

  // GET: api/MediaWorkflow
  static async getAllMediaWorkflows(): Promise<MediaWorkflow[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media workflows:', error);
      throw new Error('Failed to fetch media workflows');
    }
  }

  // GET: api/MediaWorkflow/{id}
  static async getMediaWorkflowById(id: number): Promise<MediaWorkflow> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaWorkflow with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media workflow ${id}:`, error);
      throw error;
    }
  }

  // POST: api/MediaWorkflow
  static async createMediaWorkflow(createForm: CreateMediaWorkflowForm): Promise<MediaWorkflow> {
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
      console.error('Error creating media workflow:', error);
      throw new Error('Failed to create media workflow');
    }
  }

  // PUT: api/MediaWorkflow/{id}
  static async updateMediaWorkflow(id: number, updateForm: UpdateMediaWorkflowForm): Promise<MediaWorkflow> {
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
          throw new Error(`MediaWorkflow with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating media workflow ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/MediaWorkflow/{id}
  static async deleteMediaWorkflow(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaWorkflow with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting media workflow ${id}:`, error);
      throw error;
    }
  }

  // GET: api/MediaWorkflow/workflowDescription/{workflowDescription}
  static async getByWorkflowDescription(workflowDescription: string): Promise<MediaWorkflow[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/workflowDescription/${encodeURIComponent(workflowDescription)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media workflows by description ${workflowDescription}:`, error);
      throw new Error(`Failed to fetch media workflows by description ${workflowDescription}`);
    }
  }
}

export default MediaWorkflowService;