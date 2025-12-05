import { Table2, Download, Check } from "lucide-react";
import {
  Card,
  Text,
  Button,
  Group,
  Box,
  ScrollArea,
  Table,
  Flex,
} from "@mantine/core";
import { useState, useRef } from "react";
// ⭐ يجب استبدال الاستيراد التالي باستيراد مناسب لملف الصورة لديك
// import profileImage from "../../assets/user_img.jpg";
import * as htmlToImage from "html-to-image";

// ==========================================================
// 1. البيانات الثابتة (Data)
// ==========================================================

// أسماء الأيام
const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء"];

// فترات الحصص/المحاضرات
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

// بيانات الجدول الزمني (Sample Schedule Data)
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

// ==========================================================
// 2. الدوال المساعدة (Helper Functions)
// ==========================================================

// دالة لتوليد خريطة دمج الخلايا الأفقية (colSpan)
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

// دالة لتوليد لون الخلفية بناءً على كود المقرر
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

// ==========================================================
// 3. المكون المستقل (StudentTimetable Component)
// ==========================================================

// يتم توليد خريطة الدمج مرة واحدة عند تحميل البيانات
const mergedMap = generateMergedMap(sampleData);

export const StudentTimetable = () => {
  const cardRef = useRef(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // دالة محاكاة تحميل الجدول كصورة
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

  return (
    <Card shadow="sm" radius="md" w="100%" h="100%">
      <Flex
        align={"center"}
        justify="space-between"
        px={5}
        mb={10}
        direction={{ base: "column", sm: "row" }}
        gap="sm"
      >
        <Group>
          <Table2 size={22} color="#BBB" />
          <Text c="dimmed" fw={400} fz="lg" align="start" pr={0} mb={0}>
            الجدول الدراسي الحالي
          </Text>
        </Group>
        <Group
          gap="sm"
          justify={{ base: "center", sm: "flex-end" }}
          w={{ base: "100%", sm: "auto" }}
        >
          <Button
            leftSection={<Download size={14} />}
            variant="filled"
            color="teal"
          >
            تحميل كارت التسجيل
          </Button>
          <Button
            leftSection={
              isDownloaded ? (
                <Check size={16} className="animate-pulse" color="#FFF" />
              ) : (
                <Download size={16} color="#FFF" />
              )
            }
            variant="filled"
            color={isDownloaded ? "cyan" : "blue"}
            onClick={downloadImage}
          >
            {isDownloaded ? "تم التحميل" : "تحميل الجدول"}
          </Button>
        </Group>
      </Flex>
      <div className="flex w-full border-1 border-[#BBB] mb-3 p-0"></div>

      {/* الجدول نفسه */}
      <div className="" ref={cardRef}>
        <ScrollArea>
          <Table
            withColumnBorders
            withRowBorders
            withTableBorder
            highlightOnHover={false}
            style={{ minWidth: "700px" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "center",
                    border: "1px solid #ccc",
                    background: "#f1f3f5", // خلفية لرأس "اليوم"
                    minWidth: "70px",
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
                      minWidth: "75px",
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
                              border: "1px solid #ccc",
                              padding: 0, // إزالة الحشو للسماح بتنسيق Text داخلياً
                            }}
                          >
                            {/* القاعة أعلى اليسار */}
                            <Text
                              size="xs"
                              style={{
                                position: "absolute",
                                top: 4,
                                left: 6,
                                color: "#333", // لون داكن للقاعة
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
                                color: "#333", // لون داكن للكود
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
                              <Text size="sm" style={{ fontWeight: 600 }}>
                                {course.courseName}
                              </Text>
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

                      // تخطي الخلايا التي هي جزء من span
                      const merged = Object.keys(mergedMap)
                        .filter((k) => k.startsWith(dayCode))
                        .some((k) => {
                          const start = parseInt(k.split("-")[1]);
                          const span = mergedMap[k].colSpan;
                          return idx + 1 > start && idx + 1 < start + span;
                        });

                      if (merged) return null;

                      return (
                        <td
                          key={p.label}
                          style={{
                            height: "64px",
                            border: "1px solid #ccc",
                            background: "#fff",
                          }}
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
  );
};

export default StudentTimetable;
