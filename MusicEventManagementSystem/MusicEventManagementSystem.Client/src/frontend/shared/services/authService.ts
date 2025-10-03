const API_BASE_URL = 'http://localhost:5255/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  isActive: boolean;
  department: number;
  mediaTasks?: number[];
}

export class AuthService {
  private static readonly BASE_URL = `${API_BASE_URL}/Auth`;

  // GET: api/Auth/user/{id}
  static async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${this.BASE_URL}/user/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // GET: api/Auth/users/{department}
  static async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/${department}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users by department:', error);
      throw new Error('Failed to fetch users by department');
    }
  }

  // Helper to get MediaCampaign department users
  static async getMediaCampaignUsers(): Promise<User[]> {
    return this.getUsersByDepartment('MediaCampaign');
  }
}

export default AuthService;
