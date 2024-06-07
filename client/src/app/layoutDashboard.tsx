"use client";

import Sidebar from "@/app/(components)/Sidebar";
import Navbar from "@/app/(components)/Navbar";
import DarkModeProvider from "./darkModeProvider";
import StoreProvider, { useAppSelector } from "./redux";
import AuthProvider from "./authProvider";

const LayoutDashboard = ({ children }: any) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DarkModeProvider>
          <DashboardWrapper>{children}</DashboardWrapper>
        </DarkModeProvider>
      </AuthProvider>
    </StoreProvider>
  );
};

const DashboardWrapper = ({ children }: any) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <div className={`flex bg-gray-50 text-gray-900 w-full min-h-screen `}>
      <Sidebar />
      <main
        className={`flex flex-col w-full bg-gray-100 dark:bg-gray-700 ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default LayoutDashboard;
