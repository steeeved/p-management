"use client";

import {
  Grid3x3,
  List,
  Clock,
  Table,
  User,
  Filter,
  Share2,
  PlusSquare,
} from "lucide-react";
import { useGetAuthUserQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { useState } from "react";
import ModalNewProject from "./ModalNewProject";

interface TabButtonProps {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
}

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;
  const baseStyle =
    "pb-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
  const activeStyle =
    "text-blue-600 border-b-2 border-blue-600 dark:text-blue-300 dark:border-blue-300";

  return (
    <button
      className={`${isActive ? activeStyle : baseStyle}`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

interface ProjectHeaderProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

const ProjectHeader = ({ activeTab, setActiveTab }: ProjectHeaderProps) => {
  const { data: currentUser } = useGetAuthUserQuery({});
  console.log("currentUser:", currentUser);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  const isSuperadminOrOwner =
    currentUser?.userRole === "SuperAdmin" ||
    currentUser?.userRole === "ProductOwner" ||
    currentUser?.userRole === "ProjectManager";
  console.log("isSuperadminOrOwner:", isSuperadminOrOwner);

  return (
    <div className="px-6 py-4 dark:bg-gray-800">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="flex justify-between items-center mb-2">
        <Header
          name="Product Design Development"
          buttonComponent={
            isSuperadminOrOwner && (
              <button
                className="text-blue-600 bg-blue-100 px-3 py-1 rounded-md flex items-center hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                onClick={() => setIsModalNewProjectOpen(true)}
              >
                <PlusSquare className="w-5 h-5 mr-2" /> New Boards
              </button>
            )
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 dark:border-gray-600">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="w-5 h-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="w-5 h-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="w-5 h-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="w-5 h-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
            <Filter className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
            <Share2 className="w-5 h-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="pl-10 pr-4 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Grid3x3 className="w-4 h-4 absolute top-2 left-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
