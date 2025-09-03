import salesManagerImg from "../../assets/sales-manager-profile-pic.jpg";
import { Bell } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between bg-neutral-950 text-white pr-6 py-3 shadow-md">
      {/* Search */}
      <input
        type="text"
        placeholder="   Search"
        className="w-1/3 p-2 rounded-lg bg-neutral-900 text-white placeholder-gray-400 focus:outline-none"
      />

      {/* Right Side */}
      <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-800 rounded-2xl cursor-pointer hover:bg-neutral-700 transition">
                <Bell className="w-6 h-6 text-white" />
            </div>
        <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-lg">
            <img
            src={salesManagerImg}
            alt="User"
            className="w-8 h-8 rounded-full"
            />
          <div className="text-sm">
            <div className="font-semibold">Savo</div>
            <div className="text-gray-400">Sales Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;