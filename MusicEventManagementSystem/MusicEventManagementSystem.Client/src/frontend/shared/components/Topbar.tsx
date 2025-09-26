import { Bell, Search } from "lucide-react";

const Topbar = () => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const getDepartmentName = (dept: number) => {
    switch(dept) {
      case 1: return "Ticket Sales";
      case 2: return "Event Organisation";
      case 3: return "Artist Communication";
      case 4: return "Media Campaign";
      default: return "User";
    }
  };

  const getDepartmentColor = (dept: number) => {
    switch(dept) {
      case 1: return "text-lime-400"; // Ticket Sales - lime
      case 2: return "text-pink-400"; // Event Organisation - pink
      case 3: return "text-sky-400"; // Artist Communication - sky
      case 4: return "text-purple-400"; // Media Campaign - purple
      default: return "text-neutral-400";
    }
  };

  const getDepartmentBorderColor = (dept: number) => {
    switch(dept) {
      case 1: return "border-lime-400";
      case 2: return "border-pink-400";
      case 3: return "border-sky-400";
      case 4: return "border-purple-400";
      default: return "border-neutral-400";
    }
  };

  const getDepartmentInitials = (dept: number) => {
    switch(dept) {
      case 1: return "TS";
      case 2: return "EO";
      case 3: return "AC";
      case 4: return "MC";
      default: return "U";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-between bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 text-white px-6 py-4 mx-4 mt-4 rounded-2xl shadow-lg">
        <div className="text-neutral-400">Please log in</div>
      </div>
    );
  }

  const borderColor = getDepartmentBorderColor(user.department);

  return (
    <div className="flex items-center justify-between bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 text-white px-6 py-4 mx-4 mt-4 rounded-2xl shadow-lg">
      {/* Search */}
      <div className="relative w-1/3">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-2xl cursor-pointer transition-all duration-200 border border-neutral-700 hover:border-lime-400/50 group">
            <Bell className="w-5 h-5 text-neutral-400 group-hover:text-lime-400 transition-colors" />
          </button>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full border-2 border-neutral-900"></div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer border border-neutral-700 hover:border-lime-400/30 group">
          <div className={`w-10 h-10 rounded-full border-2 ${borderColor} bg-neutral-700 flex items-center justify-center font-bold text-sm`}>
            {getDepartmentInitials(user.department)}
          </div>
          <div className="text-sm">
            <div className="font-semibold text-white group-hover:text-lime-400 transition-colors">
              {user.firstName} {user.lastName}
            </div>
            <div className={`text-xs ${getDepartmentColor(user.department)}`}>
              {getDepartmentName(user.department)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;