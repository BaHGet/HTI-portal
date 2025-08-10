import { useContext } from "react";
import { ThemeProviderContext } from "../Context/theme-context";

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

    return context; // بيرجع { theme, setTheme }
};
