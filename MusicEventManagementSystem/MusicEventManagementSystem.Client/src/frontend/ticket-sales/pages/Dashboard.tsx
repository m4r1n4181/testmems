import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DollarSign, Ticket, TrendingUp, Users, ArrowUp, ArrowDown } from "lucide-react";

const data = [
  { name: "Jan", tickets: 42000 },
  { name: "Feb", tickets: 54000 },
  { name: "Mar", tickets: 60000 },
  { name: "Apr", tickets: 58000 },
  { name: "May", tickets: 64000 },
  { name: "Jun", tickets: 72000 },
];

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$328,000",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="w-5 h-5" />,
      color: "lime"
    },
    {
      title: "Tickets Sold",
      value: "24,850",
      change: "+8.2%",
      trend: "up",
      icon: <Ticket className="w-5 h-5" />,
      color: "blue"
    },
    {
      title: "Avg. Price",
      value: "$13.20",
      change: "-2.1%",
      trend: "down",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "purple"
    },
    {
      title: "Capacity",
      value: "73.6%",
      change: "+5.1%",
      trend: "up",
      icon: <Users className="w-5 h-5" />,
      color: "orange"
    },
  ];

  const recentEvents = [
    { name: "Arctic Monkeys", venue: "Madison Square Garden", date: "Dec 15", status: "sold-out" },
    { name: "Coldplay", venue: "Wembley Stadium", date: "Dec 22", status: "available" },
    { name: "Taylor Swift", venue: "O2 Arena", date: "Jan 8", status: "limited" },
    { name: "The Weeknd", venue: "MetLife Stadium", date: "Jan 15", status: "available" },
  ];

  return (
    <div className="text-white h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-neutral-400 text-sm">
          Welcome back! Here's what's happening with your events.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-3 hover:border-lime-400/30 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color === 'lime' ? 'bg-lime-400/20 text-lime-400' : 
                                                stat.color === 'blue' ? 'bg-blue-400/20 text-blue-400' :
                                                stat.color === 'purple' ? 'bg-purple-400/20 text-purple-400' :
                                                'bg-orange-400/20 text-orange-400'}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === 'up' ? 'text-lime-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-neutral-400 text-xs mb-1">{stat.title}</p>
              <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Revenue Chart */}
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 hover:border-lime-400/30 transition-all duration-200 flex flex-col">
          <h2 className="font-bold text-lg mb-3 text-white">Revenue Trend</h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#737373" 
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#737373" 
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#262626',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Bar 
                  dataKey="tickets" 
                  fill="#a3e635" 
                  radius={[4, 4, 0, 0]}
                  className="drop-shadow-md"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 hover:border-lime-400/30 transition-all duration-200 flex flex-col">
          <h2 className="font-bold text-lg mb-3 text-white">Recent Events</h2>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-all duration-200 border border-neutral-600 hover:border-lime-400/30">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">{event.name}</h3>
                  <p className="text-neutral-400 text-xs">{event.venue} • {event.date}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  event.status === 'sold-out' ? 'bg-red-950/50 text-red-400 border-red-900/50' :
                  event.status === 'limited' ? 'bg-orange-950/50 text-orange-400 border-orange-900/50' :
                  'bg-lime-950/50 text-lime-400 border-lime-900/50'
                }`}>
                  {event.status === 'sold-out' ? 'Sold Out' :
                   event.status === 'limited' ? 'Limited' : 'Available'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;