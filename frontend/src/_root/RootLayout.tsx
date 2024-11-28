import Loader from "@/components/shared/Loader";
import { SidebarWithLogo } from "@/components/shared/Sidebar";
import { useUserContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";

const RootLayout = () => {
  const { currentDomain, isLoading, rerender } = useUserContext();
  const [outletKey, setOutletKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(rerender, "Root");
    const cookieFallback = localStorage.getItem("token");
    if (!cookieFallback || cookieFallback === "[]") {
      navigate("/login");
      return;
    }
    setOutletKey((prevKey) => prevKey + 1);
  }, [currentDomain, rerender]);

  return isLoading ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader type="main" />
    </div>
  ) : (
    <div className={`w-full md:flex test-${rerender}`} key={`test` + rerender}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 w-[320px] left-0 h-screen bg-white text-white shadow-md z-50">
          <SidebarWithLogo />
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="absolute top-4 left-50 z-50 bg-gray-700 text-white p-2 rounded-md md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close" : "Open"}
      </button>

      {/* Main Content */}
      <section className={`${isSidebarOpen ? "ml-[320px]" : "ml-0"} w-full`}>
        <Outlet key={outletKey} />
      </section>
    </div>
  );
};

export default RootLayout;