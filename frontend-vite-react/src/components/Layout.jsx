import React from "react";
import { useMediaQuery } from "react-responsive";
import SidebarLg from "./SidebarLg";
import SidebarSm from "./SidebarSm";

const Layout = ({ children }) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <div className="flex w-full">
      {isSmallScreen ? (
        <div>
          <SidebarSm />
          <main className="w-full p-4">{children}</main>
        </div>
      ) : (
        <div className="w-full flex">
          <SidebarLg />
          <main className="w-full p-4">{children}</main>
        </div>
      )}
    </div>
  );
};

export default Layout;
