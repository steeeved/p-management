import { Search, Settings, Menu, Sun, Moon, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { signOut } from "aws-amplify/auth";
import { setIsSidebarCollapsed, setIsDarkMode } from "@/state";
import Link from "next/link";
import Image from "next/image";
import { useGetAuthUserQuery } from "@/state/api";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: currentUser } = useGetAuthUserQuery({});

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  return (
    <div
      className={
        isDarkMode
          ? "dark:flex dark:justify-between dark:items-center dark:px-4 dark:py-3 dark:bg-gray-800 shadow-md"
          : "flex justify-between items-center px-4 py-3 bg-white shadow-md"
      }
    >
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="w-8 h-8 dark:text-white" />
          </button>
        )}

        <div className="flex relative w-[200px] h-min">
          <Search className="dark:text-white mr-2 w-5 h-5 absolute cursor-pointer left-[4px] top-1/2 transform -translate-y-1/2" />
          <input
            className="bg-gray-100 dark:bg-gray-700 dark:text-white rounded border-none p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent placeholder-gray-500 dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `dark:hover:bg-gray-700 p-2 rounded`
              : `hover:bg-gray-100 p-2 rounded`
          }
        >
          {isDarkMode ? (
            <Sun className="cursor-pointer dark:text-white w-6 h-6" />
          ) : (
            <Moon className="cursor-pointer dark:text-white w-6 h-6" />
          )}
        </button>
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `dark:hover:bg-gray-700 p-2 rounded w-min h-min`
              : `hover:bg-gray-100 p-2 rounded w-min h-min`
          }
        >
          <Settings className="dark:text-white w-6 h-6 cursor-pointer" />
        </Link>
        <div className="hidden md:inline-block min-h-[2em] w-[0.1rem] bg-gray-200 ml-2 mr-5"></div>
        <div className="hidden md:flex justify-between items-center">
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
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded hidden md:flex"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
