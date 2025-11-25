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
  IndentIncrease,
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
} from "@mantine/core";
import { Footer } from "../../layouts/footer";
import profileImage from "../../assets/user_img.jpg";
import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";

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
        <Grid.Col span={5} className="">
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

                {/* اسم الطالب*/}
                <Stack spacing={6} style={{ flex: 1 }}>
                  <Text fw={700} fz="xl" align="center">
                    أحمد حازم أحمد محرم عبدالشافي
                  </Text>
                  <Text fw={700} fz="lg" align="center">
                    20210741
                  </Text>

                  {/* الصف الأول */}
                  <Group
                    gap="xl"
                    mt="sm"
                    justify="space-between"
                    dir="ltr"
                    px={50}
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

                  {/* الصف الثاني */}
                  <Group gap="xl" justify="space-between" dir="ltr" px={50}>
                    <Group gap={6}>
                      <Mail size={18} />
                      <Text fz="sm">amdhazm0@gmail.com</Text>
                    </Group>

                    <Group gap={6}>
                      <Phone size={18} />
                      <Text fz="sm">+2010 9655 9353</Text>
                    </Group>
                  </Group>
                </Stack>
              </Group>
            </Card>
          </Flex>
        </Grid.Col>

        <Grid.Col span={4} className="">
          <Flex justify="center" align="center" h="100%">
            <Card shadow="sm" radius="md" w="100%" h="100%">
              <Text c="dimmed" fw={400} fz="lg" align="center">
                GPA / Hours Progress
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
                  <Text fw={400} fz="lg" align="end" mt={10}>
                    GPA : 3.01
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

        <Grid.Col span={2} className="">
          <Flex justify="center" align="center" h="100%">
            <Card shadow="sm" radius="md" w="100%" h="100%">
              <Flex justify="start" align="center">
                <Info size={22} color="#BBB" />
                <Text c="dimmed" fw={400} fz="lg" align="center" px={5}>
                  حالة الطالب
                </Text>
              </Flex>
              <div className="flex w-full border-1 border-[#BBB] p-0"></div>
              <Flex justify={"center"} align="center" mt={50}>
                <Badge
                  size="xl"
                  w={250}
                  variant="gradient"
                  gradient={{ from: "teal", to: "lime", deg: 90 }}
                >
                  طالب مقيد
                </Badge>
              </Flex>
            </Card>
          </Flex>
        </Grid.Col>
        <Grid.Col span={7} className="">
          <Flex justify="center" align="center">
            <Card shadow="sm" radius="md" w="100%" h="100%">
              <Flex align={"center"} justify="space-between" px={5} mb={10}>
                <Group>
                  <Table2 size={22} color="#BBB" />
                  <Text c="dimmed" fw={400} fz="lg" align="start" pr={0} mb={0}>
                    الجدول الدراسي الحالي
                  </Text>
                </Group>
                <Group>
                  <Button
                    leftSection={<Download size={14} />}
                    variant="filled"
                    color="teal"
                  >
                    تحميل كارت التسجيل
                  </Button>
                  <Button
                    leftSection={<Download size={14} />}
                    onClick={downloadImage}
                  >
                    تحميل الجدول
                  </Button>
                </Group>
              </Flex>
              <div className="flex w-full border-1 border-[#BBB] mb-3 p-0"></div>
              <div className="" ref={cardRef}>
                <ScrollArea>
                  <Table
                    withColumnBorders
                    withRowBorders
                    withTableBorder
                    highlightOnHover={false} // ❌ منع الهوفر
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "center",
                            border: "1px solid #ccc",
                            background: "#fff",
                          }}
                        >
                          اليوم
                        </th>

                        {periods.map((p) => (
                          <th
                            key={p.label}
                            style={{
                              textAlign: "center",
                              border: "1px solid #ccc",
                              background: "#fff",
                            }}
                          >
                            {p.label}
                            <br />
                            <Text size="xs">
                              {p.start} - {p.end}
                            </Text>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {days.map((day, dayIndex) => {
                        const dayCode = `D${dayIndex + 1}`;

                        return (
                          <tr key={day}>
                            {/* عمود اليوم */}
                            <td
                              style={{
                                background: "#f1f3f5",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ccc",
                              }}
                            >
                              {day}
                            </td>

                            {/* فترات الزمن */}
                            {periods.map((p, idx) => {
                              const key = `${dayCode}-${idx + 1}`;

                              if (mergedMap[key]) {
                                const { colSpan, course } = mergedMap[key];

                                return (
                                  <td
                                    key={p.label}
                                    colSpan={colSpan}
                                    style={{
                                      background: getColor(course.courseCode),
                                      position: "relative",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      height: "64px",
                                      border: "1px solid #ccc", // 👍 border للمربعات المدموجة
                                    }}
                                  >
                                    {/* القاعة أعلى اليسار */}
                                    <Text
                                      size="xs"
                                      style={{
                                        position: "absolute",
                                        top: 4,
                                        left: 6,
                                      }}
                                    >
                                      {course.room}
                                    </Text>

                                    {/* كود المادة أعلى اليمين */}
                                    <Text
                                      size="xs"
                                      style={{
                                        position: "absolute",
                                        top: 4,
                                        right: 6,
                                      }}
                                    >
                                      {course.courseCode}
                                    </Text>

                                    {/* اسم المادة في المنتصف */}
                                    <Box
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                      }}
                                    >
                                      {course.courseName}
                                    </Box>

                                    {/* الدكتور أسفل اليمين */}
                                    <Text
                                      size="xs"
                                      c="dimmed"
                                      style={{
                                        position: "absolute",
                                        bottom: 4,
                                        right: 6,
                                      }}
                                    >
                                      {course.professorName}
                                    </Text>
                                  </td>
                                );
                              }

                              // خلية ضمن span → skip
                              const merged = Object.keys(mergedMap)
                                .filter((k) => k.startsWith(dayCode))
                                .some((k) => {
                                  const start = parseInt(k.split("-")[1]);
                                  const span = mergedMap[k].colSpan;
                                  return (
                                    idx + 1 > start && idx + 1 < start + span
                                  );
                                });

                              if (merged) return null;

                              return (
                                <td
                                  key={p.label}
                                  style={{
                                    height: "64px",
                                    border: "1px solid #ccc",
                                    background: "#fff",
                                  }} // border للخلية العادية
                                ></td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </ScrollArea>
              </div>
            </Card>
          </Flex>
        </Grid.Col>
        <Grid.Col span={2} className="">
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
              <p className="text-xl text-[#BBB] text-center  flex justify-center mt-2">
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
        <Grid.Col span={3} className="">
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
        <Grid.Col span={5} className="">
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
              <Flex justify="space-between" mb="md">
                <Group direction="column" spacing={2}>
                  <Text size="sm" c="dimmed">
                    عدد ساعات الترم
                  </Text>
                  <Text weight={700}>{totalNewHours}</Text>
                </Group>

                <Group direction="column" spacing={2}>
                  <Text size="sm" c="dimmed">
                    المعدل التراكمي للترم
                  </Text>
                  <Text weight={700}>{(3.052).toFixed(2)}</Text>
                </Group>

                <Group direction="column" spacing={2}>
                  <Text size="sm" c="dimmed">
                    المعدل الإجمالي
                  </Text>
                  <Text weight={700}>{newCumulativeGPA.toFixed(2)}</Text>
                </Group>
              </Flex>

              <Divider mb="md" />

              {/* جدول الدرجات */}
              <ScrollArea h={250}>
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
        <Grid.Col span={6} className="">
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

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="card">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <Package size={26} />
            </div>
            <p className="card-title">Total Products</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              25,154
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              25%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <DollarSign size={26} />
            </div>
            <p className="card-title">Total Paid Orders</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              $16,000
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              12%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <Users size={26} />
            </div>
            <p className="card-title">Total Customers</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              15,400k
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              15%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <CreditCard size={26} />
            </div>
            <p className="card-title">Sales</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              12,340
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              19%
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="card col-span-1 md:col-span-2 lg:col-span-4">
          <div className="card-header">
            <p className="card-title">Overview</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={overviewData}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} formatter={(value) => `$${value}`} />

                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card col-span-1 md:col-span-2 lg:col-span-3">
          <div className="card-header">
            <p className="card-title">Recent Sales</p>
          </div>
          <div className="card-body h-[300px] overflow-auto p-0">
            {recentSalesData.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-x-4 py-2 pr-2"
              >
                <div className="flex items-center gap-x-4">
                  <img
                    src={sale.image}
                    alt={sale.name}
                    className="size-10 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-y-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {sale.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {sale.email}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  ${sale.total}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <Footer />
    </div>
  );
};

export default page;
