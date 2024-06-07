"use client";

import Header from "@/app/(components)/Header";

const SettingsPage = () => {
  // Mock user data for display
  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  return (
    <div className="p-6">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Username
          </label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white">
            {userSettings.username}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Email
          </label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white">
            {userSettings.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Team
          </label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white">
            {userSettings.teamName}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Role
          </label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white">
            {userSettings.roleName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
