import { useState } from "react";
import { Menu, LogOut, CircleDollarSign, BarChart2, Users, Bookmark, Clock } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: <Menu />, label: "Dashboard" },
    { icon: <Clock />, label: "Events" },
    { icon: <Bookmark />, label: "Tickets" },
    { icon: <Users />, label: "Performers" },
    { icon: <CircleDollarSign />, label: "Pricing & Offers" },
    { icon: <BarChart2 />, label: "Analytics" },
  ];

  return (
    <div
      className={`flex flex-col justify-between bg-neutral-900 text-white h-dvh m-4 p-4 rounded-xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div>
        <div className="text-2xl font-bold mb-6">MEMS</div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg transition"
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg transition"
      >
        <LogOut />
        {isOpen && <span>Log Out</span>}
      </button>
    </div>
  );
};

export default Sidebar;