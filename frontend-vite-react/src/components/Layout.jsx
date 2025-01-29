import React from "react";
import { useMediaQuery } from "react-responsive";
import SidebarLg from "./SidebarLg";
import SidebarSm from "./SidebarSm";

const Layout = ({ children }) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <div className="flex min-w-0 max-w-screen">
      {isSmallScreen ? (
        <div>
          <SidebarSm />
          <main className="mt-14 w-screen p-1">{children}</main>
        </div>
      ) : (
        <div className="w-full grid justify-items-stretch">
          <SidebarLg />
          <main className="w-4/6 md:w-3/4 justify-self-end xl:w-5/6 p-4">
            {children}
          </main>
        </div>
      )}
    </div>
  );
};

export default Layout;
