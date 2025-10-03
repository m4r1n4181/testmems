import type { MediaTask } from '../types/api/mediaTask';
import type { 
  CreateMediaTaskForm, 
  UpdateMediaTaskForm 
} from '../types/form/mediaTask';

const API_BASE_URL = 'http://localhost:5255/api'; // Promeni na svoj API URL

export class MediaTaskService {
  private static readonly BASE_URL = `${API_BASE_URL}/MediaTask`;

  // GET: api/MediaTask
  static async getAllMediaTasks(): Promise<MediaTask[]> {
    try {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media tasks:', error);
      throw new Error('Failed to fetch media tasks');
    }
  }

  // GET: api/MediaTask/{id}
  static async getMediaTaskById(id: number): Promise<MediaTask> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaTask with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media task ${id}:`, error);
      throw error;
    }
  }

  // POST: api/MediaTask
  static async createMediaTask(createForm: CreateMediaTaskForm): Promise<MediaTask> {
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
      console.error('Error creating media task:', error);
      throw new Error('Failed to create media task');
    }
  }

  // PUT: api/MediaTask/{id}
  static async updateMediaTask(id: number, updateForm: UpdateMediaTaskForm): Promise<MediaTask> {
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
          throw new Error(`MediaTask with ID ${id} not found`);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating media task ${id}:`, error);
      throw error;
    }
  }

  // DELETE: api/MediaTask/{id}
  static async deleteMediaTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`MediaTask with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting media task ${id}:`, error);
      throw error;
    }
  }

  // GET: api/MediaTask/taskName/{taskName}
  static async getByTaskName(taskName: string): Promise<MediaTask[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/taskName/${encodeURIComponent(taskName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media tasks by task name ${taskName}:`, error);
      throw new Error(`Failed to fetch media tasks by task name ${taskName}`);
    }
  }

  // GET: api/MediaTask/order/{order}
  static async getByOrder(order: number): Promise<MediaTask[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/order/${order}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media tasks by order ${order}:`, error);
      throw new Error(`Failed to fetch media tasks by order ${order}`);
    }
  }

  // GET: api/MediaTask/taskStatus/{taskStatus}
  static async getByTaskStatus(taskStatus: string): Promise<MediaTask[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/taskStatus/${encodeURIComponent(taskStatus)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media tasks by task status ${taskStatus}:`, error);
      throw new Error(`Failed to fetch media tasks by task status ${taskStatus}`);
    }
  }

  // GET: api/MediaTask/workflowId/{workflowId}
  static async getByWorkflowId(workflowId: number): Promise<MediaTask[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/workflowId/${workflowId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media tasks by workflow ID ${workflowId}:`, error);
      throw new Error(`Failed to fetch media tasks by workflow ID ${workflowId}`);
    }
  }
  // GET: api/MediaTask/manager/my-tasks
  static async getTasksForManager(token: string): Promise<MediaTask[]> {
    const response = await fetch(`${this.BASE_URL}/manager/my-tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch manager tasks');
    return await response.json();
  }

  // GET: api/MediaTask/managerId/{managerId}
  static async getByManagerId(managerId: string): Promise<MediaTask[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/managerId/${encodeURIComponent(managerId)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching media tasks by manager ID ${managerId}:`, error);
      throw new Error(`Failed to fetch media tasks by manager ID ${managerId}`);
    }
  }
}

export default MediaTaskService;