import {
  BookOpenCheck,
  BookText,
  CalendarCheck,
  CalendarPlus,
  DollarSign,
  GraduationCap,
  Home,
  Info,
  LibraryBig,
  MinusCircle,
  NotepadText,
  Package,
  PackagePlus,
  Plus,
  PlusCircle,
  Settings,
  ShoppingBag,
  UserCheck,
  UserPlus,
  Users,
  UsersRound,
  XCircle,
} from "lucide-react";

import ProfileImage from "../assets/profile-img.png";
import ProductImage from "../assets/product-image.jpg";

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
        label: "جداول الإمتحانات",
        icon: CalendarCheck,
        path: "/exams-tables",
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

export const overviewData = [
  {
    name: "Jan",
    total: 1500,
  },
  {
    name: "Feb",
    total: 2000,
  },
  {
    name: "Mar",
    total: 1000,
  },
  {
    name: "Apr",
    total: 5000,
  },
  {
    name: "May",
    total: 2000,
  },
  {
    name: "Jun",
    total: 5900,
  },
  {
    name: "Jul",
    total: 2000,
  },
  {
    name: "Aug",
    total: 5500,
  },
  {
    name: "Sep",
    total: 2000,
  },
  {
    name: "Oct",
    total: 4000,
  },
  {
    name: "Nov",
    total: 1500,
  },
  {
    name: "Dec",
    total: 2500,
  },
];

export const recentSalesData = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    image: ProfileImage,
    total: 1500,
  },
  {
    id: 2,
    name: "James Smith",
    email: "james.smith@email.com",
    image: ProfileImage,
    total: 2000,
  },
  {
    id: 3,
    name: "Sophia Brown",
    email: "sophia.brown@email.com",
    image: ProfileImage,
    total: 4000,
  },
  {
    id: 4,
    name: "Noah Wilson",
    email: "noah.wilson@email.com",
    image: ProfileImage,
    total: 3000,
  },
  {
    id: 5,
    name: "Emma Jones",
    email: "emma.jones@email.com",
    image: ProfileImage,
    total: 2500,
  },
  {
    id: 6,
    name: "William Taylor",
    email: "william.taylor@email.com",
    image: ProfileImage,
    total: 4500,
  },
  {
    id: 7,
    name: "Isabella Johnson",
    email: "isabella.johnson@email.com",
    image: ProfileImage,
    total: 5300,
  },
];

export const registableCourses = [
  {
    code: "EEC112",
    name: "تصميم منطقي (1)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "09:00AM",
        timeEnd: "10:30AM",
        availableSeats: 30,
      },
      {
        groupNumber: 2,
        days: ["Day2", "Day4"],
        timeStart: "11:00AM",
        timeEnd: "12:30PM",
        availableSeats: 28,
      },
    ],
  },
  {
    code: "EEC113",
    name: "هندسة الحاسبات (1)",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "01:00PM",
        timeEnd: "02:00PM",
        availableSeats: 25,
      },
    ],
  },
  {
    code: "EEC115",
    name: "اشارات ونظم",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "10:00AM",
        timeEnd: "11:30AM",
        availableSeats: 27,
      },
      {
        groupNumber: 2,
        days: ["Day1", "Day3"],
        timeStart: "02:00PM",
        timeEnd: "03:30PM",
        availableSeats: 26,
      },
    ],
  },
  {
    code: "EEC121",
    name: "دوائر كهربية (2)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "09:30AM",
        timeEnd: "11:00AM",
        availableSeats: 32,
      },
    ],
  },
  {
    code: "EEC123",
    name: "قياسات كهربية",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "01:00PM",
        timeEnd: "02:30PM",
        availableSeats: 29,
      },
    ],
  },
  {
    code: "EEC124",
    name: "هندسة الحاسبات (2)",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "08:30AM",
        timeEnd: "09:30AM",
        availableSeats: 20,
      },
      {
        groupNumber: 2,
        days: ["Day2", "Day5"],
        timeStart: "11:00AM",
        timeEnd: "12:00PM",
        availableSeats: 18,
      },
    ],
  },
  {
    code: "EEC125",
    name: "انظمة التحكم (1)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "02:00PM",
        timeEnd: "03:30PM",
        availableSeats: 24,
      },
    ],
  },
  {
    code: "EEC141",
    name: "الكترونيات (2)",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "09:00AM",
        timeEnd: "10:00AM",
        availableSeats: 22,
      },
    ],
  },
  {
    code: "EEC142",
    name: "تصميم منطقي (2)",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "11:30AM",
        timeEnd: "12:30PM",
        availableSeats: 25,
      },
    ],
  },
  {
    code: "EEC151",
    name: "الكترونيات (3)",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "01:30PM",
        timeEnd: "02:30PM",
        availableSeats: 21,
      },
    ],
  },
  {
    code: "EEC152",
    name: "مجالات كهرومغناطيسية (1)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "03:00PM",
        timeEnd: "04:30PM",
        availableSeats: 26,
      },
    ],
  },
  {
    code: "EEC154",
    name: "آلات كهربية",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "10:30AM",
        timeEnd: "11:30AM",
        availableSeats: 23,
      },
    ],
  },
  {
    code: "EEC211",
    name: "مجالات كهرومغناطيسية (2)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "09:30AM",
        timeEnd: "11:00AM",
        availableSeats: 28,
      },
    ],
  },
  {
    code: "EEC212",
    name: "انظمة التحكم (2)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "01:00PM",
        timeEnd: "02:30PM",
        availableSeats: 27,
      },
    ],
  },
  {
    code: "EEC213",
    name: "اتصالات (1)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "02:00PM",
        timeEnd: "03:30PM",
        availableSeats: 30,
      },
      {
        groupNumber: 2,
        days: ["Day2", "Day4"],
        timeStart: "11:00AM",
        timeEnd: "12:30PM",
        availableSeats: 28,
      },
    ],
  },
  {
    code: "EEC214",
    name: "حاسب العمليات الدقيقة",
    creditHours: 4,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "09:00AM",
        timeEnd: "11:00AM",
        availableSeats: 20,
      },
    ],
  },
  {
    code: "EEC216",
    name: "تركيبات وتنظيم الكمبيوتر",
    creditHours: 4,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day4"],
        timeStart: "01:30PM",
        timeEnd: "03:30PM",
        availableSeats: 22,
      },
    ],
  },
  {
    code: "EEC222",
    name: "هندسة الميكروويف",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day5"],
        timeStart: "09:30AM",
        timeEnd: "11:00AM",
        availableSeats: 25,
      },
    ],
  },
  {
    code: "EEC223",
    name: "اتصالات (2)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "10:00AM",
        timeEnd: "11:30AM",
        availableSeats: 29,
      },
    ],
  },
  {
    code: "EEC224",
    name: "اتصالات البيانات وشبكات الحاسب",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day4"],
        timeStart: "08:30AM",
        timeEnd: "10:00AM",
        availableSeats: 26,
      },
    ],
  },
  {
    code: "EEC225",
    name: "معالجة الاشارات الرقمية (1)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "02:00PM",
        timeEnd: "03:30PM",
        availableSeats: 28,
      },
    ],
  },
  {
    code: "EEC241",
    name: "الهوائيات",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "11:30AM",
        timeEnd: "01:00PM",
        availableSeats: 24,
      },
    ],
  },
  {
    code: "EEC242",
    name: "اتصالات (3)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "09:00AM",
        timeEnd: "10:30AM",
        availableSeats: 30,
      },
    ],
  },
  {
    code: "EEC251",
    name: "اتصالات (4)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day5"],
        timeStart: "01:00PM",
        timeEnd: "02:30PM",
        availableSeats: 25,
      },
    ],
  },
  {
    code: "EEC255",
    name: "تحكم عمليات صناعية",
    creditHours: 2,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "10:30AM",
        timeEnd: "11:30AM",
        availableSeats: 23,
      },
    ],
  },
  {
    code: "EEC290",
    name: "مشروع التخرج",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day4"],
        timeStart: "12:00PM",
        timeEnd: "02:00PM",
        availableSeats: 20,
      },
    ],
  },
  {
    code: "FTR231",
    name: "تدريب ميداني (3)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day4"],
        timeStart: "09:00AM",
        timeEnd: "11:00AM",
        availableSeats: 35,
      },
    ],
  },
  {
    code: "FTR261",
    name: "تدريب ميداني (4)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day3", "Day5"],
        timeStart: "01:00PM",
        timeEnd: "03:00PM",
        availableSeats: 33,
      },
    ],
  },
  {
    code: "MTH101",
    name: "الرياضيات (3)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day1", "Day3"],
        timeStart: "08:00AM",
        timeEnd: "09:30AM",
        availableSeats: 40,
      },
    ],
  },
  {
    code: "MTH102",
    name: "الرياضيات (4)",
    creditHours: 3,
    groups: [
      {
        groupNumber: 1,
        days: ["Day2", "Day5"],
        timeStart: "10:00AM",
        timeEnd: "11:30AM",
        availableSeats: 38,
      },
    ],
  },
];
