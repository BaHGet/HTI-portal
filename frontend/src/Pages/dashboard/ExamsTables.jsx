import React, { useState, useEffect } from "react";
import { getExamSchedule } from "../../api/Users/usersApi";
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
  Button,
} from "@mantine/core";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Download,
  AlertCircle,
} from "lucide-react";

const ExamSchedulePage = () => {
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState("Midterm"); // Midterm أو Final
  const [scheduleData, setScheduleData] = useState([]);

  // جلب البيانات عند تغيير النوع
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const result = await getExamSchedule(examType);
        if (result.success) {
          setScheduleData(result.data);
        }
      } catch (error) {
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [examType]);

  // دالة مساعدة لتحويل التاريخ لاسم اليوم
  const getDayName = (dateString) => {
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return days[new Date(dateString).getDay()];
  };

  const isDataAvailable = scheduleData && scheduleData.length > 0;

  const handleDownload = () => {
    alert(
      `جارٍ تحميل جدول امتحانات ${
        examType === "Midterm" ? "منتصف الفصل" : "النهائية"
      }`
    );
  };

  // بناء الصفوف بناءً على الـ JSON المرسل
  const rows = isDataAvailable ? (
    scheduleData.map((exam, index) => (
      <Table.Tr key={index}>
        <Table.Td style={{ textAlign: "center" }}>
          {exam.SemesterCourse?.Course?.CourseName}
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          {exam.SemesterCourse?.Course?.CourseCode}
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>{exam.ExamDate}</Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          {getDayName(exam.ExamDate)}
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          <Group justify="center" gap={5}>
            <Clock size={16} />
            <Text fz="sm">
              {exam.StartTime?.slice(0, 5)} - {exam.EndTime?.slice(0, 5)}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          <Group justify="center" gap={5}>
            <MapPin size={16} />
            <Text fw={700}>{exam.Room}</Text>
          </Group>
        </Table.Td>
      </Table.Tr>
    ))
  ) : (
    <Table.Tr>
      <Table.Td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
        <Text c="dimmed">لا توجد جداول متاحة لهذا النوع حالياً.</Text>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <h1 className="title py-2">جداول الامتحانات</h1>

      <Grid gutter="xl">
        <Grid.Col span={12}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Flex
              justify="space-between"
              align="center"
              mb="md"
              wrap="wrap"
              gap="md"
            >
              <Group>
                <CalendarCheck size={22} color="#BBB" />
                <Text fw={700} fz="lg" c="dimmed">
                  جدول الامتحانات
                </Text>
              </Group>

              <SegmentedControl
                value={examType}
                onChange={setExamType}
                data={[
                  { label: "منتصف الفصل", value: "Midterm" },
                  { label: "الامتحانات النهائية", value: "Final" },
                ]}
                size="md"
                color="blue"
              />

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

            {!isDataAvailable && !loading ? (
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
              </Flex>
            ) : (
              <ScrollArea h={450}>
                <Table striped withColumnBorders withTableBorder>
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
                        التوقيت
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
