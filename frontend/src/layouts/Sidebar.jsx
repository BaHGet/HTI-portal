import React, { forwardRef } from "react";
import { cn } from "../utils/cn";
import LogoLight from "../assets/HTI-Logo-light.png";
import LogoDark from "../assets/HTI-Logo-dark .png";
import PropTypes from "prop-types";
import { navbarLinks } from "../constants";
import { NavLink } from "react-router-dom";

const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            dir="rtl"
            ref={ref}
            className={cn(
                "fixed right-0 z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-l border-slate-300 bg-white transition-all dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-right-full" : "max-md:right-0",
            )}
        >
            <div className="flex items-center gap-x-3 p-3">
                <div className="w-[70px]">
                    <img
                        src={LogoLight}
                        alt="Logoipsum"
                        className="dark:hidden"
                    />
                    <img
                        src={LogoDark}
                        alt="Logoipsum"
                        className="hidden dark:block"
                    />
                </div>
                {!collapsed && <p className="text-lg font-medium text-slate-900 dark:text-slate-50">بوابة الطلاب</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-x-hidden overflow-y-auto p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-groub", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                            >
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};

export default Sidebar;
