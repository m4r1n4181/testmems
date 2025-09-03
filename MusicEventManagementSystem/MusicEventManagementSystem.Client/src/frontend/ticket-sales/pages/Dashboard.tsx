import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", tickets: 42000 },
  { name: "Feb", tickets: 54000 },
  { name: "Mar", tickets: 60000 },
  { name: "Apr", tickets: 58000 },
  { name: "May", tickets: 64000 },
  { name: "Jun", tickets: 72000 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-400">
        Welcome to your Music Event Management System
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-4">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold">$328,000</h2>
          <p className="text-green-400">+12.5% from last month</p>
        </div>
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-4">
          <p>Tickets Sold</p>
          <h2 className="text-2xl font-bold">24</h2>
          <p className="text-green-400">+3 new this week</p>
        </div>
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-4">
          <p>Avg. Ticket Price</p>
          <h2 className="text-2xl font-bold">$8,850</h2>
          <p className="text-red-400">-8.2% from last month</p>
        </div>
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-4">
          <p>Capacity Utilized</p>
          <h2 className="text-2xl font-bold">73.6%</h2>
          <p className="text-green-400">+5.1% from last month</p>
        </div>
      </div>

      {/* Graph + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4">Revenue & Tickets sold</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4">Recent Events</h2>
          <div className="space-y-3">
            <div className="p-3 bg-neutral-800 rounded-xl">
              Arctic Monkeys – Madison Square Garden
            </div>
            <div className="p-3 bg-neutral-800 rounded-xl">
              Coldplay – Wembley Stadium
            </div>
            <div className="p-3 bg-neutral-800 rounded-xl">
              Taylor Swift – O2 Arena
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-2xl shadow-md transition">
          Configure Event
        </button>
        <button className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-2xl shadow-md transition">
          Configure Pricing
        </button>
        <button className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-2xl shadow-md transition">
          View Analytics
        </button>
      </div>
    </div>
  );
};

export default Dashboard;