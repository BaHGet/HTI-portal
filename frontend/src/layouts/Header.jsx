import { useTheme } from "../hooks/use-theme";
import { Menu, Button, Text } from "@mantine/core";
import { PropTypes } from "prop-types";
import {
  Bell,
  ChevronDown,
  Logs,
  Moon,
  Search,
  Sun,
  Settings,
  LogOut,
} from "lucide-react";
import profileImg from "../assets/profile-img.png"; // Adjust the path as necessary
import { logout } from "../Api/auth/authApi";
import { useNavigate } from "react-router-dom";

const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  function handleLogout() {
    console.log("Logout Clicked");
    logout();

    navigate("/login");
  }

  return (
    <header
      dir="rtl"
      className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900"
    >
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <Logs className={collapsed && "rotate-180"} />
        </button>
        <div className="input">
          <Search size={20} className="text-slate-300" />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
          />
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
            console.log("theme change");
          }}
        >
          <Sun size={20} className="dark:hidden" />
          <Moon size={20} className="hidden dark:block" />
        </button>
        <button className="btn-ghost size-10">
          <Bell size={20} />
        </button>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button className="flex items-center gap-x-2 rounded-lg bg-slate-100 px-3 py-1 text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700">
              <ChevronDown size={20} />
              <p className="text-sm">احمد حازم احمد محرم</p>
              <img
                src={profileImg}
                alt="profile image"
                className="size-10 object-cover rounded-full"
              />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<Settings size={14} />}>Settings</Menu.Item>
            <Menu.Item
              onClick={handleLogout}
              color="red"
              leftSection={<LogOut size={14} />}
            >
              LogOut
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {/* <button className="flex items-center gap-x-2 rounded-lg bg-slate-100 px-3 py-1 text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700">
          <ChevronDown size={20} />
          <p className="text-sm">احمد حازم احمد محرم</p>
          <img
            src={profileImg}
            alt="profile image"
            className="size-10 object-cover rounded-full"
          />
        </button> */}
      </div>
    </header>
  );
};

export default Header;

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
