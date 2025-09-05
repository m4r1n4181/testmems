import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CircleDollarSign, BarChart2, Users, TrendingUp, Star, Bookmark, Clock, ChevronLeft, ChevronRight, MapPin, Map, Ticket } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(0);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <BarChart2 />, label: "Dashboard", path: "/dashboard" },
    { icon: <MapPin />, label: "Venues", path: "/venues" },
    { icon: <Clock />, label: "Segments", path: "/segments" },
    { icon: <Map />, label: "Zones", path: "/zones" },
    { icon: <Bookmark />, label: "Ticket Types", path: "/ticket-types" },
    { icon: <Ticket />, label: "Tickets", path: "/tickets" },
    { icon: <TrendingUp />, label: "Pricing Rules", path: "/pricing-rules" },
    { icon: <Star />, label: "Special Offers", path: "/special-offers" },
    { icon: <CircleDollarSign />, label: "Recorded Sales", path: "/recorded-sales" },
    { icon: <BarChart2 />, label: "Analytics", path: "/analytics"  },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`flex flex-col justify-between bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-white h-[calc(100vh-2rem)] my-4 ml-4 rounded-2xl transition-all duration-300 shadow-2xl ${
        isOpen ? "w-64" : "w-22"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {isOpen && (
            <div className="transition-all duration-300">
              <div className="text-2xl font-black text-white tracking-tight">MEMS</div>
              <div className="w-22 h-1 bg-lime-400 rounded-full mt-1"></div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 ml-1 hover:bg-neutral-800 rounded-xl transition-all duration-200 text-neutral-400 hover:text-lime-400 border border-transparent hover:border-lime-400/30"
          >
            {isOpen ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveItem(index);
                navigate(item.path);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full group ${
                activeItem === index
                  ? "bg-lime-400/20 text-lime-400 border border-lime-400/30"
                  : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <div
                className={`transition-all duration-200 ${
                  activeItem === index
                    ? "text-lime-400"
                    : "text-neutral-400 group-hover:text-white"
                }`}
              >
                {item.icon}
              </div>
              {isOpen && (
                <span
                  className={`font-medium transition-all duration-200 ${
                    activeItem === index
                      ? "text-lime-400"
                      : "text-neutral-300 group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              )}
              {activeItem === index && (
                <div className="ml-auto w-2 h-2 bg-lime-400 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 p-3 hover:bg-red-950/50 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 w-full group border border-transparent hover:border-red-900/50 ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;