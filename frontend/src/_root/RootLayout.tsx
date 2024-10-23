import LeftSidebarWithWebsiite from "@/components/shared/LeftSidebar";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";

const RootLayout = () => {
  const { currentDomain, isLoading, rerender } = useUserContext();
  const [outletKey, setOutletKey] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(rerender, "Root")
    const cookieFallback = localStorage.getItem("token");
    if (cookieFallback === "[]" || cookieFallback === null || cookieFallback === undefined) {
      navigate('/login');
      return;
    }
    setOutletKey((prevKey) => prevKey + 1);
  }, [currentDomain, rerender]);

  return (
    isLoading ? (<div className="w-full h-full flex items-center justify-center"><Loader type="main" /></div>) : (
      <div className={`w-full md:flex test-${rerender}`} key={`test`+rerender}>
        <LeftSidebarWithWebsiite  /> {/* Pass sidebarKey */}
        <section className="w-full">
          <Outlet key={outletKey} />
        </section>
      </div>
    )
  );
};


export default RootLayout;
