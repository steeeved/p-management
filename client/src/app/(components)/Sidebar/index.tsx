import React, { useState } from "react";
import {
  Home,
  Search,
  Settings,
  Users,
  Briefcase,
  AlertCircle,
  User,
  Menu,
  X,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetProjectsQuery } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import Image from "next/image";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const dispatch = useAppDispatch();

  const screenWidth = window.innerWidth;

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }  hover:bg-blue-200 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
        onClick={() => {
          if (screenWidth > 768) return;
          console.log("clicked");
          dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
        }}
      >
        <Icon className="w-6 h-6 dark:text-gray-100 text-gray-800" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium dark:text-gray-100 text-gray-800`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const { data: projects } = useGetProjectsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const [showProjects, setShowProjects] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const { data: currentUser } = useGetAuthUserQuery({});

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between ${
    isSidebarCollapsed ? "w-0" : "w-64 md:w-64"
  } bg-gray-900 text-gray-100 transition-all duration-300 h-full shadow-md z-40 overflow-auto 
   ${isDarkMode ? "dark:bg-gray-800" : "bg-white"}
   `;

  const currentUserDetails = currentUser?.userDetails;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className={sidebarClassNames}>
      <div className="flex flex-col h-[100%] justify-start">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="dark:text-white text-gray-800">LOGO</div>
          {isSidebarCollapsed ? null : (
            <button
              className="px-3 py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="w-8 h-8 dark:text-white text-gray-800" />
            </button>
          )}
        </div>
        <nav>
          <SidebarLink
            isCollapsed={isSidebarCollapsed}
            icon={Home}
            label="Home"
            href="/"
          />
          <SidebarLink
            isCollapsed={isSidebarCollapsed}
            icon={Briefcase}
            label="Timeline"
            href="/timeline"
          />
          <SidebarLink
            isCollapsed={isSidebarCollapsed}
            icon={Search}
            label="Search"
            href="/search"
          />
          <SidebarLink
            isCollapsed={isSidebarCollapsed}
            icon={Settings}
            label="Settings"
            href="/settings"
          />

          <SidebarLink
            isCollapsed={isSidebarCollapsed}
            icon={User}
            label="Users"
            href="/users"
          />
          <SidebarLink
            isCollapsed={isSidebarCollapsed}
            icon={Users}
            label="Teams"
            href="/teams"
          />

          <button
            onClick={() => setShowProjects(!showProjects)}
            className="mt-5 text-gray-800 dark:text-white mx-4 uppercase flex items-center"
          >
            <span className="">Projects</span>
            <span className="ml-2">{showProjects ? "▲" : "▼"}</span>
          </button>
          {showProjects &&
            projects?.map((project) => (
              <SidebarLink
                isCollapsed={isSidebarCollapsed}
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))}

          <button
            onClick={() => setShowPriority(!showPriority)}
            className="mt-5 text-gray-800 dark:text-white mx-4 uppercase flex items-center"
          >
            <span className="">Priority</span>
            <span className="ml-2">{showPriority ? "▲" : "▼"}</span>
          </button>
          {showPriority && (
            <>
              <SidebarLink
                isCollapsed={isSidebarCollapsed}
                icon={AlertCircle}
                label="Urgent"
                href="/priority/urgent"
              />
              <SidebarLink
                isCollapsed={isSidebarCollapsed}
                icon={AlertCircle}
                label="High"
                href="/priority/high"
              />
              <SidebarLink
                isCollapsed={isSidebarCollapsed}
                icon={AlertCircle}
                label="Medium"
                href="/priority/medium"
              />
              <SidebarLink
                isCollapsed={isSidebarCollapsed}
                icon={AlertCircle}
                label="Low"
                href="/priority/low"
              />
              <SidebarLink
                isCollapsed={isSidebarCollapsed}
                icon={AlertCircle}
                label="Backlog"
                href="/priority/backlog"
              />
            </>
          )}
        </nav>
      </div>
      <div className="flex flex-col h-fit md:hidden items-center mx-8 py-4 gap-4">
        <div className="flex w-full items-center">
          <div className="w-9 h-9 flex justify-center align-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="rounded-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 rounded-full dark:text-white self-center cursor-pointer" />
            )}
          </div>
          <span className="text-gray-800 dark:text-white mx-3">
            {currentUserDetails?.username}
          </span>
        </div>
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded self-start"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
