import {
  School,
  Calendar,
  Phone,
  Mail,
  Trophy,
  Bell,
  Table2,
  Download,
  Info,
  GraduationCap,
  Check,
  ChartNoAxesCombined,
} from "lucide-react";
import { LineChart } from "@mantine/charts";
import { useTheme } from "../../hooks/use-theme";
import {
  Card,
  Text,
  Button,
  Badge,
  Group,
  Grid,
  Avatar,
  Stack,
  Flex,
  Progress,
  Table,
  Box,
  ScrollArea,
  Notification,
  Divider,
  SemiCircleProgress,
} from "@mantine/core";
import { Footer } from "../../layouts/footer";
import profileImage from "../../assets/user_img.jpg";
import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import StudentTimetable from "../../Components/StudentTimetable";

const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء"];
const periods = [
  { label: "P1", start: "09:00", end: "09:45" },
  { label: "P2", start: "09:45", end: "10:30" },
  { label: "P3", start: "10:30", end: "11:15" },
  { label: "P4", start: "11:15", end: "12:00" },
  { label: "P5", start: "12:00", end: "12:45" },
  { label: "P6", start: "12:45", end: "01:30" },
  { label: "P7", start: "01:30", end: "02:15" },
  { label: "P8", start: "02:15", end: "03:00" },
];
const sampleData = [
  {
    courseCode: "EEC251",
    courseName: "اتصالات 4",
    groupNumber: "G1",
    professorName: "د اسلام سامي",
    room: "C506",
    schedule: [
      { day: "D1", time: "P3" },
      { day: "D1", time: "P4" },
      { day: "D1", time: "P5" },
      { day: "D2", time: "P5" },
      { day: "D2", time: "P6" },
    ],
  },
  {
    courseCode: "MTH104",
    courseName: "تحليل رياضي",
    groupNumber: "G1",
    professorName: "د حنان احمد",
    room: "S110",
    schedule: [
      { day: "D2", time: "P1" },
      { day: "D2", time: "P2" },
      { day: "D5", time: "P1" },
      { day: "D5", time: "P2" },
    ],
  },
  {
    courseCode: "EEC280",
    courseName: "تأمين الاتصالات",
    groupNumber: "G1",
    professorName: "د نجوان ابراهيم",
    room: "C510",
    schedule: [
      { day: "D4", time: "P7" },
      { day: "D4", time: "P8" },
      { day: "D5", time: "P7" },
      { day: "D5", time: "P8" },
    ],
  },
  {
    courseCode: "EEC154",
    courseName: "الآت كهربية",
    groupNumber: "G1",
    professorName: "د تغريد سعيد",
    room: "C315",
    schedule: [
      { day: "D2", time: "P3" },
      { day: "D2", time: "P4" },
      { day: "D4", time: "P3" },
    ],
  },
  {
    courseCode: "MNG101",
    courseName: "ضبط الجودة",
    groupNumber: "G1",
    professorName: "د رضوي غزالة",
    room: "R406",
    schedule: [
      { day: "D5", time: "P3" },
      { day: "D5", time: "P4" },
    ],
  },
  {
    courseCode: "EEC224",
    courseName: "شبكات الحاسب",
    groupNumber: "G2",
    professorName: "د محمد عادل",
    room: "C407",
    schedule: [
      { day: "D3", time: "P3" },
      { day: "D3", time: "P4" },
      { day: "D3", time: "P5" },
      { day: "D4", time: "P4" },
      { day: "D4", time: "P5" },
    ],
  },
];

const initialNotifications = [
  {
    id: 1,
    title: "فتح التسجيل",
    message: "التسجيل للفصل الدراسي الجديد أصبح مفتوح الآن.",
    type: "important", // الأحمر
  },
  {
    id: 2,
    title: "دفع المصاريف",
    message: "المصاريف لم تُدفع بعد، يرجى الإسراع بالدفع.",
    type: "important", // الأحمر
  },
  {
    id: 3,
    title: "إعلام عام",
    message: "تم تحديث مواعيد المحاضرات الأسبوع القادم.",
    type: "info", // أزرق
  },
  {
    id: 4,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success", // أخضر
  },
  {
    id: 5,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success", // أخضر
  },
  {
    id: 6,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success", // أخضر
  },
  {
    id: 7,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success", // أخضر
  },
];

const termData = [
  { term: "1-2021", gpa: 3.2 },
  { term: "2-2021", gpa: 3.4 },
  { term: "3-2021", gpa: 3.1 },
  { term: "1-2022", gpa: 3.5 },
  { term: "2-2022", gpa: 3.6 },
  { term: "3-2022", gpa: 3.3 },
  { term: "1-2023", gpa: 3.7 },
  { term: "2-2023", gpa: 3.8 },
  { term: "3-2023", gpa: 3.6 },
  { term: "1-2024", gpa: 3.4 },
  { term: "2-2024", gpa: 3.5 },
  { term: "3-2024", gpa: 3.7 },
  { term: "1-2025", gpa: 3.9 },
];
const data = [
  {
    date: "Mar 22",
    Apples: 50,
  },
  {
    date: "Mar 23",
    Apples: 60,
  },
  {
    date: "Mar 24",
    Apples: 40,
  },
  {
    date: "Mar 25",
    Apples: 30,
  },
  {
    date: "Mar 26",
    Apples: 0,
  },
  {
    date: "Mar 27",
    Apples: 20,
  },
  {
    date: "Mar 28",
    Apples: 20,
  },
  {
    date: "Mar 29",
    Apples: 10,
  },
];

const coursesThisTerm = [
  { code: "CS101", name: "Introduction to CS", grade: 85, hours: 3 }, // B → 3.3
  { code: "MATH201", name: "Calculus", grade: 92, hours: 3 }, // A → 4.0
  { code: "PHY101", name: "Physics I", grade: 76, hours: 2 }, // C+ → 2.7
  { code: "ENG101", name: "English", grade: 89, hours: 2 }, // B+ → 3.3
  { code: "HIST101", name: "History", grade: 95, hours: 2 }, // A+ → 4.0
  { code: "CHEM101", name: "Chemistry", grade: 67, hours: 3 }, // C → 2.3
  { code: "BIO101", name: "Biology", grade: 88, hours: 3 }, // F → 0
];



const page = () => {
  const cardRef = useRef(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const completedHoures = 126;
  const [notifications, setNotifications] = useState(initialNotifications);

  const downloadImage = () => {
    if (cardRef.current === null) return;

    htmlToImage
      .toPng(cardRef.current, { quality: 1 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "schedule.png";
        link.href = dataUrl;
        link.click();
        // ⭐ إظهار علامة الصح
        setIsDownloaded(true);

        // ⏳ رجوع للشكل الطبيعي بعد ثانيتين
        setTimeout(() => setIsDownloaded(false), 2000);
      })
      .catch((err) => {
        console.error("Error generating image", err);
      });
  };

  function calculateTermGPA(courses, prevGPA = 0, prevHours = 0) {
    // تحويل الدرجة من 100 إلى GPA 4
    const gradeToGPA = (grade) => {
      if (grade >= 95) return 4.0; // A+
      if (grade >= 90) return 4.0; // A
      if (grade >= 85) return 3.7; // A-
      if (grade >= 80) return 3.3; // B+
      if (grade >= 75) return 3.0; // B
      if (grade >= 70) return 2.7; // C+
      if (grade >= 65) return 2.3; // C
      if (grade >= 60) return 2.0; // D
      return 0.0; // F
    };

    const totalNewHours = courses.reduce((acc, c) => acc + c.hours, 0);
    const totalNewPoints = courses.reduce(
      (acc, c) => acc + gradeToGPA(c.grade) * c.hours,
      0
    );

    const totalHours = prevHours + totalNewHours;
    const totalPoints = prevGPA * prevHours + totalNewPoints;

    return totalHours === 0 ? 0 : totalPoints / totalHours;
  }

  function getLetterGrade(grade) {
    if (grade >= 94) return "A+";
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  }

  function gradeToGPA(grade) {
    if (grade >= 95) return 4.0; // A+
    if (grade >= 90) return 4.0; // A
    if (grade >= 85) return 3.7; // A-
    if (grade >= 80) return 3.3; // B+
    if (grade >= 75) return 3.0; // B
    if (grade >= 70) return 2.7; // C+
    if (grade >= 65) return 2.3; // C
    if (grade >= 60) return 2.0; // D
    return 0.0; // F
  }

  const prevGPA = 3.01;
  const prevHours = 126;

  const totalNewHours = coursesThisTerm.reduce((acc, c) => acc + c.hours, 0); // 18
  const totalNewPoints = coursesThisTerm.reduce(
    (acc, c) => acc + gradeToGPA(c.grade) * c.hours,
    0
  );
  const newTermGPA = calculateTermGPA(coursesThisTerm, prevGPA, prevHours);
  const newCumulativeGPA =
    (prevGPA * prevHours + totalNewPoints) / (prevHours + totalNewHours);

  // دالة لإغلاق notification
  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // دمج أفقي colSpan
  const generateMergedMap = (data) => {
    const map = {};

    data.forEach((course) => {
      const groupedByDay = {};

      course.schedule.forEach(({ day, time }) => {
        const p = parseInt(time.replace("P", ""));
        if (!groupedByDay[day]) groupedByDay[day] = [];
        groupedByDay[day].push(p);
      });

      Object.keys(groupedByDay).forEach((day) => {
        const sorted = groupedByDay[day].sort((a, b) => a - b);

        let start = sorted[0];
        let count = 1;

        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i] === sorted[i - 1] + 1) {
            count++;
          } else {
            map[`${day}-${start}`] = { colSpan: count, course };
            start = sorted[i];
            count = 1;
          }
        }

        map[`${day}-${start}`] = { colSpan: count, course };
      });
    });

    return map;
  };

  function getNotificationColor(type) {
    switch (type) {
      case "important":
        return "red";
      case "info":
        return "blue";
      case "success":
        return "green";
      default:
        return "gray";
    }
  }

  // ألوان مختلفة حسب أول حرف من الكود
  const getColor = (code) => {
    const courseColors = [
      "#EDE9FE", // بنفسجي فاتح 2
      "#BBF7D0", // أخضر فاتح 2
      "#BFDBFE", // أزرق فاتح 2
      "#FCE7F3", // وردي فاتح 2
      "#FEF3C7", // أصفر فاتح 2
      "#FECACA", // أحمر فاتح
      "#FEF3C7", // أصفر فاتح
      "#D1FAE5", // أخضر فاتح
      "#DBEAFE", // أزرق فاتح
      "#E9D5FF", // بنفسجي فاتح
      "#FBCFE8", // وردي فاتح
      "#FEF9C3", // أصفر باهت
      "#CFFAFE", // أزرق سماوي فاتح
      "#FED7AA", // برتقالي فاتح
      "#CCFBF1", // أخضر سماوي فاتح
      "#FBCFE8", // وردي فاتح 3
      "#E0E7FF", // أزرق فاتح 3
      "#ECFCCB", // أخضر فاتح 3
      "#FEF3C7", // أصفر فاتح 3
      "#E0F2FE", // أزرق فاتح 4
    ];
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash + code.charCodeAt(i) * (i + 1)) % 1000;
    }
    return courseColors[hash % courseColors.length];
  };

  const mergedMap = generateMergedMap(sampleData);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">الصفحة الرئيسية</h1>
      <Grid gutter="xl">
        {/*
          1. كارت بيانات الطالب
          الشاشات الصغيرة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات المتوسطة: يأخذ 6 أعمدة (نصف السطر)
          الشاشات الكبيرة: يأخذ 5 أعمدة
        */}
        <Grid.Col span={{ base: 12, md: 6, lg: 5 }} className="">
          <Flex>
            <Card shadow="sm" radius="md" padding="sm" w="100%" h="100%">
              <Group align="flex-start">
                {/* الصورة */}
                <Flex
                  direction={"column"}
                  align="center"
                  mr={10}
                  justify="center"
                >
                  <Avatar
                    src={profileImage}
                    radius={10}
                    size={120}
                    className="border"
                  />
                  <Text fw={400} fz="xm" align="center" pt={10} w={120}>
                    م.أ د نورا علي
                  </Text>
                </Flex>

                {/* اسم الطالب و البيانات */}
                <Stack spacing={6} style={{ flex: 1 }}>
                  <Text fw={700} fz="xl" align="center">
                    أحمد حازم أحمد محرم عبدالشافي
                  </Text>
                  <Text fw={700} fz="lg" align="center">
                    20210741
                  </Text>

                  {/* الصف الأول - يجب أن تتكيف المجموعة هنا */}
                  <Group
                    gap="xl"
                    mt="sm"
                    justify="space-between"
                    dir="ltr"
                    px={{ base: 10, md: 50 }} // تقليل المساحة على الشاشات الصغيرة
                  >
                    <Group gap={6}>
                      <School size={18} />
                      <Text fz="sm">قسم الهندسة الكهربية</Text>
                    </Group>

                    <Group gap={6}>
                      <Calendar size={18} />
                      <Text fz="sm" pr={35}>
                        1 DEC 2025
                      </Text>
                    </Group>
                  </Group>

                  {/* الصف الثاني - يجب أن تتكيف المجموعة هنا */}
                  <Group
                    gap="xl"
                    justify="space-between"
                    dir="ltr"
                    px={{ base: 10, md: 50 }} // تقليل المساحة على الشاشات الصغيرة
                  >
                    <Group gap={6}>
                      <Mail size={18} />
                      <Text fz="sm">amdhazm0@gmail.com</Text>
                    </Group>

                    <Group gap={6}>
                      <Phone size={18} />
                      <Text fz="sm">+2010 9655 9353</Text>
                    </Group>
                  </Group>
                  <Badge
                    ms={{ base: 0, md: 100 }} // تعديل الهامش على الشاشات الصغيرة
                    size="xl"
                    w={{ base: "100%", md: 250 }} // جعل العرض كاملًا على الشاشات الصغيرة
                    variant="gradient"
                    gradient={{ from: "teal", to: "lime", deg: 90 }}
                    style={{ marginInline: "auto" }} // لمركزة الـ Badge عند العرض الكامل
                  >
                    طالب مقيد
                  </Badge>
                </Stack>
              </Group>
            </Card>
          </Flex>
        </Grid.Col>

        {/*
          2. كارت Hours Progress
          الشاشات الصغيرة: يأخذ 12 عمود
          الشاشات المتوسطة: يأخذ 6 أعمدة (بجانب كارت بيانات الطالب)
          الشاشات الكبيرة: يأخذ 4 أعمدة
        */}
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }} className="">
          <Flex justify="center" align="center" h="100%">
            <Card shadow="sm" radius="md" w="100%" h="100%">
              <Text c="dimmed" fw={400} fz="lg" align="center">
                Hours Progress
              </Text>
              <div className="flex w-full border-1 border-[#BBB] p-0"></div>
              <Stack spacing={20} mt={10} px={20} justify="space-around">
                <Flex justify={"space-around"} align="center" mt={10}>
                  <Text fw={400} fz="lg" align="end" mt={10}>
                    Remaining: {180 - completedHoures}H
                  </Text>
                  <Text fw={400} fz="lg" align="end" mt={10}>
                    Completed: {completedHoures}H
                  </Text>
                </Flex>
                <Progress
                  dir="ltr"
                  size="xl"
                  value={(completedHoures / 180) * 100}
                  striped
                />
              </Stack>
            </Card>
          </Flex>
        </Grid.Col>

        {/*
          3. كارت المعدل الأكاديمي (GPA)
          الشاشات الصغيرة: يأخذ 12 عمود
          الشاشات المتوسطة: يأخذ 6 أعمدة
          الشاشات الكبيرة: يأخذ 3 أعمدة
        */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} className="">
          <Flex justify="center" align="center" h="100%">
            <Card shadow="sm" radius="md" w="100%" h="100%">
              <Flex justify="start" align="center">
                <Info size={22} color="#BBB" />
                <Text c="dimmed" fw={400} fz="lg" align="center" px={5}>
                  المعدل الاكاديمي
                </Text>
              </Flex>
              <div className="flex w-full border-1 border-[#BBB] p-0"></div>
              <Flex justify={"center"} align="center" mt={25}>
                <Stack>
                  <SemiCircleProgress
                    fillDirection="left-to-right"
                    orientation="up"
                    label={"GPA: 3.07"}
                    filledSegmentColor="blue"
                    size={160} // تقليل الحجم قليلاً للملاءمة
                    thickness={16}
                    value={(3.07 / 4) * 100}
                  />
                  <Text c="dimmed" fw={500} fz="lg" align="center">
                    جيد جداً
                  </Text>
                </Stack>
              </Flex>
            </Card>
          </Flex>
        </Grid.Col>

        {/*
          4. كارت الجدول الدراسي
          الشاشات الصغيرة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات المتوسطة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات الكبيرة: يأخذ 7 أعمدة (يحتل مساحة أكبر بجانب التنبيهات)
        */}
        <Grid.Col span={{ base: 12, lg: 7 }} className="">
          <Flex justify="center" align="center">
            <StudentTimetable/>
          </Flex>
        </Grid.Col>

        {/*
          5. كارت عدد الساعات المسجلة والترتيب
          الشاشات الصغيرة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات المتوسطة: يأخذ 6 أعمدة (بجانب كارت التنبيهات)
          الشاشات الكبيرة: يأخذ 2 عمود (بجانب الجدول)
        */}
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }} className="">
          <Flex direction="column" style={{ height: "100%" }} gap="xl">
            {/* الكارت الصغير */}
            <Card shadow="sm" radius="md" style={{ flex: 3 }}>
              <Text c="dimmed" fw={400} fz="lg" align="center" pr={5} mb={0}>
                عدد الساعات المسجلة
              </Text>
              <div className="flex w-full border-1 border-[#BBB] p-0"></div>

              <p className="text-4xl text-center font-semibold flex justify-center mt-8">
                16
              </p>
              <p className="text-xl text-[#BBB] text-center  flex justify-center mt-2">
                ساعة معتمدة
              </p>
            </Card>

            {/* الكارت الكبير */}
            <Card shadow="sm" radius="md" w="100%" h="100%" style={{ flex: 5 }}>
              <Text c="dimmed" fw={400} fz="lg" align="center">
                الـترتـيـب
              </Text>
              <div className="flex w-full border-1 border-[#BBB] p-0"></div>
              <Flex justify={"center"} align="center" mt={40}>
                <p className="text-4xl px-3">21</p>
                <Trophy size={48} />
              </Flex>
              <Text c="dimmed" fw={300} fz="lg" align="center" mt={25}>
                علي مستوي قسم الهندسة الكهربية دفعة 2021
              </Text>
            </Card>
          </Flex>
        </Grid.Col>

        {/*
          6. كارت التنبيهات والإعلامات
          الشاشات الصغيرة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات المتوسطة: يأخذ 6 أعمدة (بجانب كارت الساعات والترتيب)
          الشاشات الكبيرة: يأخذ 3 أعمدة
        */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} className="">
          <Flex justify="center" align="center">
            <Card shadow="sm" radius="md" w="100%" h="100%">
              <Flex align={"center"} mb={15}>
                <Bell color="#BBB" size={22} />
                <Text c="dimmed" fw={400} fz="lg" align="center" pr={5} mb={0}>
                  التنبيهات و الإعلامات
                </Text>
              </Flex>
              <div className="flex w-full border-1 border-[#BBB] p-0"></div>
              <ScrollArea px={5} py={10} h={375}>
                <Stack spacing="xs">
                  {notifications.map((notif) => (
                    <Notification
                      key={notif.id}
                      title={notif.title}
                      color={getNotificationColor(notif.type)}
                      onClose={() => handleClose(notif.id)}
                      closeButtonProps={{ "aria-label": "Hide notification" }}
                    >
                      {notif.message}
                    </Notification>
                  ))}
                </Stack>
              </ScrollArea>
            </Card>
          </Flex>
        </Grid.Col>

        {/*
          7. كارت كشف درجات الترم الحالي
          الشاشات الصغيرة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات المتوسطة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات الكبيرة: يأخذ 5 أعمدة
        */}
        <Grid.Col span={{ base: 12, lg: 5 }} className="">
          <Flex justify="center" align="center">
            <Card shadow="sm" radius="md" p="md" w="100%" h="100%" withBorder>
              <Flex align={"center"} mb={10}>
                <GraduationCap color="#BBB" size={22} />
                <Text c="dimmed" fw={400} fz="lg" align="center" pr={5} mb={0}>
                  كشف درجات الترم الحالي
                </Text>
              </Flex>
              <Divider mb="md" />
              {/* الحسابات أعلى الكارد */}
              <Flex
                justify="space-between"
                mb="md"
                direction={{ base: "column", sm: "row" }} // وضع العناصر تحت بعضها على الشاشات الصغيرة جداً
                align="center"
                gap="sm"
              >
                <Group direction="column" spacing={2} align="center">
                  <Text size="sm" c="dimmed">
                    عدد ساعات الترم
                  </Text>
                  <Text weight={700}>{totalNewHours}</Text>
                </Group>

                <Group direction="column" spacing={2} align="center">
                  <Text size="sm" c="dimmed">
                    المعدل التراكمي للترم
                  </Text>
                  <Text weight={700}>{(3.052).toFixed(2)}</Text>
                </Group>

                <Group direction="column" spacing={2} align="center">
                  <Text size="sm" c="dimmed">
                    المعدل الإجمالي
                  </Text>
                  <Text weight={700}>{newCumulativeGPA.toFixed(2)}</Text>
                </Group>
              </Flex>

              <Divider mb="md" />

              {/* جدول الدرجات */}
              <ScrollArea h={250}>
                {/* يتم استخدام Table عادي مع ScrollArea لضمان الاستجابة */}
                <Table withColumnBorders withRowBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ textAlign: "center" }}>
                        كود المادة
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        اسم المادة
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        الدرجة
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        التقدير
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {coursesThisTerm.map((course) => (
                      <Table.Tr key={course.code}>
                        <Table.Td style={{ textAlign: "center" }}>
                          {course.code}
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          {course.name}
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          {course.grade}
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          {getLetterGrade(course.grade)}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Flex>
        </Grid.Col>

        {/*
          8. كارت تطور المعدل التراكمي
          الشاشات الصغيرة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات المتوسطة: يأخذ 12 عمود (السطر بالكامل)
          الشاشات الكبيرة: يأخذ 7 أعمدة (يملاً باقي السطر)
        */}
        <Grid.Col span={{ base: 12, lg: 7 }} className="">
          <Flex justify="center" align="center">
            <Card shadow="sm" radius="md" p="md" w="100%" h="100%" withBorder>
              <Flex align={"center"} mb={10}>
                <ChartNoAxesCombined color="#BBB" size={22} />
                <Text c="dimmed" fw={400} fz="lg" align="center" pr={5} mb={0}>
                  تطور المعدل التراكمي عبر الفصول الدراسية
                </Text>
              </Flex>
              <Divider mb="md" />
              {/* الخط البياني */}
              <ScrollArea>
                {/* لا يحتاج الخط البياني لتعديل لأنه يستجيب للعرض المتاح له */}
                <LineChart
                  h={300}
                  data={termData}
                  dataKey="term"
                  yAxisProps={{ domain: [0, 4] }}
                  series={[{ name: "gpa", color: "indigo.6" }]}
                />
              </ScrollArea>

              <Divider mt="md" />
            </Card>
          </Flex>
        </Grid.Col>
      </Grid>
      <Footer />
    </div>
  );
};

export default page;
