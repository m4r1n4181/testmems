import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="bg-neutral-800 text-white flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;