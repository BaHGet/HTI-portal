import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import { cn } from "../utils/cn";
import Header from "../layouts/Header";
import { useClickOutside } from "../hooks/use-click-outside";

import { useMediaQuery } from "@uidotdev/usehooks";

const Layout = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);

  const sidebarRef = useRef(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
      setCollapsed(true);
    }
  });

  return (
    <div className="transition-color min-h-screen bg-slate-100 dark:bg-slate-950">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          !collapsed &&
            "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30"
        )}
      />
      <Sidebar ref={sidebarRef} collapsed={collapsed} />
      <div
        className={cn(
          "transition-[margin] duration-300",
          collapsed ? "md:mr-[70px]" : "md:mr-[240px]"
        )}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="h-[calc(100vh-60px)] overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
