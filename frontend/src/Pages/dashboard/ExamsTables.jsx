import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Text,
  Table,
  Divider,
  Flex,
  ScrollArea,
  LoadingOverlay,
  Group,
  SegmentedControl,
  Button, // 👈 لإضافة زر التحميل
} from "@mantine/core";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Download,
  AlertCircle,
} from "lucide-react"; // أيقونات محدثة

// **بيانات وهمية مؤقتة لعرض الهيكل:**
// تم تعديل البيانات الوهمية لتشمل فقط نوعين من الجداول
const dummySchedule = [
  // بيانات الميدتيرم (Midterm)
  {
    CourseName: "برمجة متقدمة",
    CourseCode: "CS401",
    Date: "2026-01-15",
    Day: "الخميس",
    TimeStart: "10:00",
    TimeEnd: "12:00",
    Location: "قاعة 305",
    Type: "midterm",
  },
  {
    CourseName: "هياكل بيانات",
    CourseCode: "DS300",
    Date: "2026-01-18",
    Day: "الأحد",
    TimeStart: "14:00",
    TimeEnd: "16:00",
    Location: "مدرج ب",
    Type: "midterm",
  },
  // بيانات الفاينل (Final)
  //   {
  //     CourseName: "ذكاء اصطناعي",
  //     CourseCode: "AI505",
  //     Date: "2026-02-25",
  //     Day: "الأربعاء",
  //     TimeStart: "09:00",
  //     TimeEnd: "12:00",
  //     Location: "قاعة A",
  //     Type: "final",
  //   },
];

const ExamSchedulePage = () => {
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState("midterm"); // midterim or final
  const [scheduleData, setScheduleData] = useState(dummySchedule); // استخدام البيانات الوهمية

  // **منطق جلب البيانات الفعلي:**
  useEffect(() => {
    // يمكنك هنا استدعاء الـ API لجلب بيانات الجداول
    // مثال:
    // const fetchSchedule = async () => {
    //   setLoading(true);
    //   // const res = await getExamSchedule(selectedTerm);
    //   // setScheduleData(res.data);
    //   setLoading(false);
    // };
    // fetchSchedule();

    // محاكاة تحميل بسيط
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []); // تم إزالة selectedTerm لأنك لم تعد تستخدمه بشكل صريح

  // **فلترة الجدول بناءً على التحديد (Midterm/Final)**
  const currentSchedule = scheduleData.filter((exam) => exam.Type === examType);

  // لكي نختبر رسالة "لا توجد جداول"، يمكن تغيير هذا إلى []
  const isDataAvailable = scheduleData && scheduleData.length > 0;

  // **دالة وهمية للتحميل**
  const handleDownload = () => {
    alert(
      "جارٍ تحميل جدول امتحانات " +
        (examType === "midterm" ? "الميدتيرم" : "الفاينل")
    );
  };

  // **توليد صفوف الجدول**
  const rows =
    currentSchedule.length > 0 ? (
      currentSchedule.map((exam, index) => (
        <Table.Tr key={index}>
          <Table.Td style={{ textAlign: "center" }}>{exam.CourseName}</Table.Td>
          <Table.Td style={{ textAlign: "center" }}>{exam.CourseCode}</Table.Td>
          <Table.Td style={{ textAlign: "center" }}>{exam.Date}</Table.Td>
          <Table.Td style={{ textAlign: "center" }}>{exam.Day}</Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            <Group justify="center" gap={5}>
              <Clock size={16} />
              <Text>
                {exam.TimeStart} - {exam.TimeEnd}
              </Text>
            </Group>
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            <Group justify="center" gap={5}>
              <MapPin size={16} />
              <Text fw={700}>{exam.Location}</Text>
            </Group>
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      // رسالة عدم وجود بيانات فقط للجدول المختار
      <Table.Tr>
        <Table.Td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
          <Text fw={700} fz="lg" c="dimmed">
            لا توجد بيانات{" "}
            <Text span c="indigo" inherit>
              {examType === "midterm"
                ? "لامتحانات منتصف الفصل الدراسي"
                : "لامتحانات نهاية الفصل الدراسي"}
            </Text>{" "}
            حالياً.
          </Text>
        </Table.Td>
      </Table.Tr>
    );

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} blur={3} zIndex={1000} />

      <h1 className="title py-2">جداول الامتحانات</h1>

      <Grid gutter="xl">
        {/* === Exams Table & Controls (الكارد الكبير الموحد) === */}
        <Grid.Col span={12}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Flex
              justify="space-between"
              align="center"
              gap="md"
              mb="md"
              wrap="wrap"
            >
              {/* 1. العنوان والـ Tabs */}
              <Group>
                <CalendarCheck size={22} color="#BBB" />
                <Text fw={700} fz="lg" c="dimmed">
                  جدول الامتحانات
                </Text>
              </Group>
              {/* SegmentedControl للتحويل بين الميدتيرم والفاينل */}
              <SegmentedControl
                value={examType}
                onChange={setExamType}
                data={[
                  { label: "منتصف الفصل الدراسي", value: "midterm" },
                  { label: "الإمتحانات النهائية", value: "final" },
                ]}
                size="md"
                color="blue"
                ml="md"
              />
              {/* 2. زر التحميل */}
              {isDataAvailable && (
                <Button
                  variant="filled"
                  color="teal"
                  size="sm"
                  onClick={handleDownload}
                  leftSection={<Download size={18} />}
                >
                  تحميل الجدول
                </Button>
              )}
            </Flex>

            <Divider mb="md" />

            {/* **منطق عرض الجدول أو رسالة عدم وجود جداول عامة** */}
            {!isDataAvailable ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                p="xl"
                style={{ minHeight: "200px" }}
              >
                <AlertCircle size={48} color="red" />
                <Text fw={700} fz="xl" c="red" mt="md">
                  لا توجد جداول امتحانات حالياً
                </Text>
                <Text c="dimmed" mt="xs">
                  يرجى مراجعة إدارة الكلية لمعرفة مواعيد نشر الجداول.
                </Text>
              </Flex>
            ) : (
              <ScrollArea h={450}>
                <Table striped withColumnBorders withRowBorders withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ textAlign: "center" }}>
                        اسم المادة
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        كود المادة
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        التاريخ
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>اليوم</Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        التوقيت (من - إلى)
                      </Table.Th>
                      <Table.Th style={{ textAlign: "center" }}>
                        القاعة
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default ExamSchedulePage;
