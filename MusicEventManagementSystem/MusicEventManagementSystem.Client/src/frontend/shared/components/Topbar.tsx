import salesManagerImg from "../../assets/sales-manager-profile-pic.jpg";
import { Bell, Search } from "lucide-react";

const Topbar = () => {
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
          <img
            src={salesManagerImg}
            alt="User"
            className="w-9 h-9 rounded-full border-2 border-lime-400/50"
          />
          <div className="text-sm">
            <div className="font-semibold text-white group-hover:text-lime-400 transition-colors">Savo</div>
            <div className="text-neutral-400 text-xs">Sales Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;