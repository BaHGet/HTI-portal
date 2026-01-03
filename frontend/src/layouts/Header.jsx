import { useTheme } from "../hooks/use-theme";
import { Menu } from "@mantine/core";
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
import profileImg from "../assets/profile-img.png";
import { logout } from "../Api/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// ✅ استيراد Hook getMe
import { useMe } from "../hooks/queries/useMe"; // عدّل المسار حسب مشروعك

const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ قراءة بيانات الطالب من الكاش (React Query)
  const { data: me, isLoading } = useMe();

  const studentName = me?.data?.StudentName || (isLoading ? "..." : ""); // fallback بسيط بدون تغيير UI

  async function handleLogout() {
    console.log("Logout Clicked");

    try {
      // 1) اطلب من الباك اند يمسح الكوكيز
      await logout();
      
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      // 2) امسح كاش الداتا الخاصة بالطالب
      queryClient.clear();
      navigate("/login", { replace: true });
      // 3) روح للوجن
      
    }
  }

  return (
    <header
      dir="rtl"
      className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900"
    >
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setCollapsed(!collapsed)}
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
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
              {/* ✅ الاسم من getMe بدل static */}
              <p className="text-sm">{studentName}</p>
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
      </div>
    </header>
  );
};

export default Header;

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
