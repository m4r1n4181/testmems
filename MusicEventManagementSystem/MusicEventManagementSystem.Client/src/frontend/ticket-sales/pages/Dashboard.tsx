import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Ticket, Calendar, 
  Download, RefreshCw, Filter, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Import real services
import { EventService } from '../../event-organization/services/eventService';
import { RecordedSaleService } from '../types/services/recordedSaleService';
import { TicketService } from '../types/services/ticketService';

// Import types
import type { EventResponse } from '../../event-organization/types/api/event';
import type { RecordedSaleResponse } from '../types/api/recordedSale';
import type { TicketResponse } from '../types/api/ticket';
import { EventStatus } from '../../event-organization/types/enums/EventOrganization';
import { TransactionStatus, TicketStatus } from '../types/enums/TicketSales';

// Define proper TypeScript interfaces
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color?: string;
}

interface PieDataItem {
  name: string;
  value: number;
  count: number;
  color: string;
  percent?: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    todayTickets: [] as TicketResponse[],
    totalRevenue: 0,
    events: [] as EventResponse[],
    salesHistory: [] as any[],
    recentSales: [] as RecordedSaleResponse[],
    metrics: {
      todaysSales: 0,
      todaysRevenue: 0,
      activeEvents: 0,
      avgTicketPrice: 0,
      yesterdayChange: 0
    }
  });

  // Mock chart data - in real app, this would come from aggregated API data
  const chartData = [
    { date: '2024-01-01', tickets: 45, revenue: 9200 },
    { date: '2024-01-02', tickets: 52, revenue: 10800 },
    { date: '2024-01-03', tickets: 38, revenue: 7600 },
    { date: '2024-01-04', tickets: 61, revenue: 12400 },
    { date: '2024-01-05', tickets: 49, revenue: 9800 },
    { date: '2024-01-06', tickets: 73, revenue: 15200 },
    { date: '2024-01-07', tickets: 67, revenue: 13800 }
  ];

  const eventTypeData = [
    { name: 'Concert', revenue: 45000, tickets: 180 },
    { name: 'Theater', revenue: 32000, tickets: 120 },
    { name: 'Sports', revenue: 28000, tickets: 95 },
    { name: 'Festival', revenue: 52000, tickets: 210 }
  ];

  const zoneData = [
    { name: 'VIP', value: 15000, count: 45, color: '#10b981' },
    { name: 'Premium', value: 28000, count: 120, color: '#3b82f6' },
    { name: 'Standard', value: 35000, count: 280, color: '#f59e0b' },
    { name: 'Standing', value: 22000, count: 180, color: '#ef4444' }
  ];

  const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'PayPal', 'Apple Pay', 'Google Pay', 'Cryptocurrency'];
  const transactionStatuses = ['Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded', 'Partially Refunded', 'Processing'];
  // const eventStatuses = ['', 'Planned', 'In Progress', 'Completed', 'Cancelled'];

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const fromUTC = new Date(dateRange.from);
      fromUTC.setHours(0, 0, 0, 0);
      
      const toUTC = new Date(dateRange.to);
      toUTC.setHours(23, 59, 59, 999);

      const [todayTickets, totalRevenue, events, recentSales] = await Promise.all([
        TicketService.getTodaysTickets(),
        RecordedSaleService.getTotalRevenue(),
        EventService.getAllEvents(),
        RecordedSaleService.getSalesByDateRange(fromUTC, toUTC)
      ]);

      // Calculate revenue for today's tickets
      const todaysRevenue = todayTickets
        .filter(ticket => ticket.status === TicketStatus.Sold)
        .reduce((sum, ticket) => sum + ticket.finalPrice, 0);

      // Count active events (Planned or In Progress)
      const activeEvents = events.filter(e => 
        e.status === EventStatus.Planned || e.status === EventStatus.InProgress
      ).length;

      // Calculate average ticket price
      const soldTicketsToday = todayTickets.filter(t => t.status === TicketStatus.Sold);
      const avgTicketPrice = soldTicketsToday.length > 0 ? 
        todaysRevenue / soldTicketsToday.length : 0;

      // Get sales history for charts (mock for now - would need aggregated endpoint)
      // const salesHistory = await TicketService.getRevenueByDateRange(dateRange.from, dateRange.to);

      setDashboardData({
        todayTickets,
        totalRevenue,
        events,
        salesHistory: chartData, // Using mock data for now
        recentSales: recentSales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()),
        metrics: {
          todaysSales: soldTicketsToday.length,
          todaysRevenue,
          activeEvents,
          avgTicketPrice,
          yesterdayChange: Math.floor(Math.random() * 40) - 20 // Would need actual comparison data
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    const dateValue = new Date(value);
    setDateRange(prev => ({ ...prev, [field]: dateValue }));
  };

  const exportToCsv = () => {
    if (dashboardData.recentSales.length === 0) return;

    const csvData = dashboardData.recentSales.map(sale => ({
      'Sale ID': sale.recordedSaleId,
      'Amount': `$${sale.totalAmount.toFixed(2)}`,
      'Date': new Date(sale.saleDate).toLocaleDateString(),
      'Payment Method': paymentMethods[sale.paymentMethod],
      'Status': transactionStatuses[sale.transactionStatus],
      'User ID': sale.applicationUserId
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        handleRefresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refreshing]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(dashboardData.recentSales.length / itemsPerPage);
  const paginatedSales = dashboardData.recentSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color = 'lime' }) => (
    <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-400/20 border border-${color}-400/30`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-neutral-400">{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-lime-400 animate-spin" />
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Sales Dashboard</h1>
            <p className="text-neutral-400">Real-time ticket sales analytics and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 hover:border-lime-400/50 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={exportToCsv}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 hover:border-lime-400/50 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-lime-400/20 hover:bg-lime-400/30 text-lime-400 rounded-xl border border-lime-400/30 hover:border-lime-400/50 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Date Range Filters */}
        {showFilters && (
          <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.from.toISOString().split('T')[0]}
                  onChange={(e) => handleDateRangeChange('from', e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.to.toISOString().split('T')[0]}
                  onChange={(e) => handleDateRangeChange('to', e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Today's Tickets Sold"
          value={dashboardData.metrics.todaysSales.toLocaleString()}
          change={dashboardData.metrics.yesterdayChange}
          icon={Ticket}
          color="lime"
        />
        <MetricCard
          title="Today's Revenue"
          value={`$${dashboardData.metrics.todaysRevenue.toLocaleString()}`}
          change={12}
          icon={DollarSign}
          color="lime"
        />
        <MetricCard
          title="Active Events"
          value={dashboardData.metrics.activeEvents}
          change={12}
          icon={Calendar}
          color="lime"
        />
        <MetricCard
          title="Average Ticket Price"
          value={`$${dashboardData.metrics.avgTicketPrice.toFixed(2)}`}
          change={5}
          icon={TrendingUp}
          color="lime"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Sales Trend (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Tickets Sold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Event Type */}
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Revenue by Event Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone Distribution Chart */}
      <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Ticket Sales by Zone</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={zoneData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ percent, payload }) => `${payload.name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {zoneData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Sales</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="w-4 h-4" />
            Auto-refresh every 30s
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-3 px-4 font-medium text-neutral-300">Sale ID</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-300">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-300">Date</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-300">Payment Method</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-300">Status</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-300">Customer</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSales.map((sale) => (
                <tr key={sale.recordedSaleId} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3 px-4 text-lime-400 font-medium">#{sale.recordedSaleId}</td>
                  <td className="py-3 px-4 text-white font-semibold">${sale.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-neutral-300">{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-neutral-300">{paymentMethods[sale.paymentMethod]}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      sale.transactionStatus === TransactionStatus.Completed ? 'bg-green-400/20 text-green-400' :
                      sale.transactionStatus === TransactionStatus.Failed ? 'bg-red-400/20 text-red-400' :
                      sale.transactionStatus === TransactionStatus.Pending ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-neutral-400/20 text-neutral-400'
                    }`}>
                      {transactionStatuses[sale.transactionStatus]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">{sale.applicationUserId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-neutral-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, dashboardData.recentSales.length)} of {dashboardData.recentSales.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-700 hover:border-lime-400/50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-xl transition-all ${
                    currentPage === page
                      ? 'bg-lime-400/20 text-lime-400 border border-lime-400/30'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 hover:border-lime-400/50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-700 hover:border-lime-400/50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;