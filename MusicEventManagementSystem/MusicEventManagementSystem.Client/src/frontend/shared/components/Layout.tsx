// Layout.tsx
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Eksplicitno definišite da Layout prima children prop
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex bg-neutral-950 min-h-screen">
      {/* Sidebar – fiksiran tokom skrolovanja */}
      <div className="sticky top-0 h-screen flex-shrink-0">
        <Sidebar />
      </div>

      {/* Glavni deo */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar fiksiran */}
        <div className="sticky top-0 z-20">
          <Topbar />
        </div>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 h-full shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;