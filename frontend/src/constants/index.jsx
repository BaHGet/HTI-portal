import { BookOpenCheck ,BookText,CalendarPlus,DollarSign, GraduationCap, Home, Info, LibraryBig, MinusCircle, NotepadText, Package, PackagePlus, Plus, PlusCircle, Settings, ShoppingBag, UserCheck, UserPlus, Users, UsersRound, XCircle } from "lucide-react";

// import ProfileImage from "@/assets/profile-image.jpg";
// import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
    {
        title: "الرئيسية",
        links: [
            {
                label: "الصفحة الرئيسية",
                icon: Home,
                path: "/",
            },
            {
                label: "النتائج",
                icon: BookOpenCheck,
                path: "/results",
            },
            {
                label: "التقارير",
                icon: NotepadText,
                path: "/reports",
            },
            {
                label: "المصروفات",
                icon: DollarSign,
                path: "/payments",
            },
        ],
    },
    {
        title: "التسجيل",
        links: [
            {
                label: "تسجيل المقررات",
                icon: PlusCircle,
                path: "/registeration",
            },
            {
                label: "الانسحاب من المقررات",
                icon: MinusCircle,
                path: "/withdrawal",
            },
            {
                label: "الالتماسات",
                icon: XCircle,
                path: "/Petitions",
            },
        ],
    },
    {
        title: "أدوات مساعدة",
        links: [
            {
                label: "اللوائح الدراسية",
                icon: BookText,
                path: "/Regulations",
            },
            {
                label: "عمل جدول",
                icon: CalendarPlus,
                path: "/create-table",
            },
            {
                label: "بنك المواد",
                icon: LibraryBig,
                path: "/materials",
            },
        ],
    },
    {
        title: "التواصل والاقتراحات",
        links: [
            {
                label: "شؤون الطلاب",
                icon: UsersRound,
                path: "/student-affairs",
            },
            {
                label: "أعضاء هيئة التدريس",
                icon: GraduationCap,
                path: "/faculty-members",
            },
            {
                label: "الإقتراحات والشكاوى",
                icon: Info,
                path: "/complaints-and-suggestions",
            },
        ],
    },
];
