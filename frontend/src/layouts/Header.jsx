import React from "react";
import { useTheme } from "../hooks/use-theme";
import { PropTypes } from "prop-types";
import {  Menu, Moon, Search, Sun } from "lucide-react";

const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    
    return (
        <header dir="rtl" className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                >
                    <Menu className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
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
                    onClick={() => {setTheme(theme === "light" ? "dark" : "light");console.log("theme change");}}
                    
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
            </div>
        </header>
    );
};

export default Header;

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
