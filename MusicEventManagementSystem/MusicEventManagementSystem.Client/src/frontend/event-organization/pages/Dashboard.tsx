import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Activity, TrendingUp, BarChart3 } from 'lucide-react';

// Types based on your models and enums
interface Event {
  id: number;
  name: string;
  description: string;
  interval: string;
  status: number;
  createdById: string;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface WorkTask {
  id: number;
  performanceId: number;
  name: string;
  description: string;
  status: number;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Resource {
  id: number;
  name: string;
  type: number;
  description: string;
  quantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface DashboardStats {
  totalEvents: number;
  plannedEvents: number;
  activeWorkTasks: number;
  pendingTasks: number;
  resourceUtilization: number;
  availableResources: number;
  totalResources: number;
  resourceTypes: number;
}

interface UpcomingEvent {
  name: string;
  location: string;
  start: string;
  end: string;
  status: string;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

interface ChartData {
  month: string;
  events: number;
}

interface ResourceUtilizationData {
  type: string;
  count: number;
}

// Mock service functions - replace with actual API calls
const DashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    // Replace with actual API call
    return {
      totalEvents: 8,
      plannedEvents: 3,
      activeWorkTasks: 2,
      pendingTasks: 1,
      resourceUtilization: 88,
      availableResources: 242,
      totalResources: 1941,
      resourceTypes: 7
    };
  },

  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    // Replace with actual API call
    return [
      {
        name: "Indie Music Showcase",
        location: "Cultural Center NS",
        start: "9/25/2025",
        end: "9/25/2025",
        status: "PLANNED"
      },
      {
        name: "Balkan Beats Night",
        location: "Kalemegdan Belgrade",
        start: "10/10/2025",
        end: "10/10/2025",
        status: "PLANNED"
      },
      {
        name: "Acoustic Sessions",
        location: "Riverside Stage",
        start: "11/15/2025",
        end: "11/15/2025",
        status: "PLANNED"
      }
    ];
  },

  async getRecentActivities(): Promise<Activity[]> {
    // Replace with actual API call
    return [
      {
        id: 1,
        type: "Event Created",
        description: "EDM Party",
        timestamp: "2 hours ago"
      }
    ];
  },

  async getMonthlyEventsData(): Promise<ChartData[]> {
    // Replace with actual API call
    return [
      { month: "Apr 2025", events: 0 },
      { month: "May 2025", events: 0 },
      { month: "Jun 2025", events: 0 },
      { month: "Jul 2025", events: 2 },
      { month: "Aug 2025", events: 1 },
      { month: "Sep 2025", events: 2 }
    ];
  },

  async getResourceUtilizationData(): Promise<ResourceUtilizationData[]> {
    // Replace with actual API call
    return [
      { type: "Equipment", count: 350 },
      { type: "Staff", count: 1250 },
      { type: "Vehicles", count: 150 },
      { type: "Infrastructure", count: 50 }
    ];
  }
};

const EventOrgDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [resourceData, setResourceData] = useState<ResourceUtilizationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [
          dashboardStats,
          events,
          activities,
          monthlyEventsData,
          resourceUtilizationData
        ] = await Promise.all([
          DashboardService.getDashboardStats(),
          DashboardService.getUpcomingEvents(),
          DashboardService.getRecentActivities(),
          DashboardService.getMonthlyEventsData(),
          DashboardService.getResourceUtilizationData()
        ]);

        setStats(dashboardStats);
        setUpcomingEvents(events);
        setRecentActivities(activities);
        setMonthlyData(monthlyEventsData);
        setResourceData(resourceUtilizationData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Events</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-pink-400">{stats?.totalEvents}</span>
            <span className="text-gray-400 text-sm">{stats?.plannedEvents} planned</span>
          </div>
        </div>

        {/* Active Work Tasks */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Work Tasks</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-blue-400">{stats?.activeWorkTasks}</span>
            <span className="text-gray-400 text-sm">{stats?.pendingTasks} pending</span>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Resource Utilization</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-pink-400">{stats?.resourceUtilization}%</span>
            <span className="text-gray-400 text-sm">{stats?.availableResources} available</span>
          </div>
        </div>

        {/* Total Resources */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Resources</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-yellow-400">{stats?.totalResources}</span>
            <span className="text-gray-400 text-sm">{stats?.resourceTypes} types</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events (PLANNED)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                <span className="bg-blue-600 text-blue-100 text-xs px-2 py-1 rounded">
                  {event.status}
                </span>
              </div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Location: {event.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Start: {event.start}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>End: {event.end}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts and Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Task Status Pie Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Tasks Status</h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="175 175"
                  strokeDashoffset="75"
                  className="text-pink-400"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="175 175"
                  strokeDashoffset="125"
                  className="text-teal-400"
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-teal-400 rounded mr-2"></div>
              <span className="text-gray-300">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-400 rounded mr-2"></div>
              <span className="text-gray-300">In Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
              <span className="text-gray-300">Pending</span>
            </div>
          </div>
        </div>

        {/* Events by Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Events by Status</h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="351 351"
                  strokeDashoffset="250"
                  className="text-pink-400"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="351 351"
                  strokeDashoffset="300"
                  className="text-teal-400"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
              <span className="text-gray-300">Cancelled</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-teal-400 rounded mr-2"></div>
              <span className="text-gray-300">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-400 rounded mr-2"></div>
              <span className="text-gray-300">In Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
              <span className="text-gray-300">Planned</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.description}</p>
                  <p className="text-gray-400 text-sm">{activity.type}</p>
                  <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Events Trend */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Events Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-pink-400 rounded-t w-full"
                  style={{ height: `${Math.max(data.events * 50, 8)}px` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top">
                  {data.month.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-400">Events per Month</div>
          </div>
        </div>

        {/* Resource Utilization by Type */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Resource Utilization by Type</h3>
          <div className="h-64 flex items-end justify-between space-x-4">
            {resourceData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-pink-400 rounded-t w-full max-w-16"
                  style={{ height: `${data.count / 10}px` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2 text-center">
                  {data.type}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-400">Resources by Type</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOrgDashboard;