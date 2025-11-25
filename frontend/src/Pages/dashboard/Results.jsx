import {
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Select,
  Table,
  Divider,
  Badge,
  Flex,
  ScrollArea,
} from "@mantine/core";
import {
  BookOpenText,
  CalendarSearch,
  CheckSquare,
  GraduationCap,
} from "lucide-react";
import React, { useState } from "react";

// ----------------------------------------------------
// بيانات وهمية (Mock Data)
// ----------------------------------------------------

const availableTerms = [
  { value: "Term_4", label: "الفصل الدراسي الرابع (ربيع 2024)" },
  { value: "Term_3", label: "الفصل الدراسي الثالث (خريف 2023)" },
  { value: "Term_2", label: "الفصل الدراسي الثاني (ربيع 2023)" },
  { value: "Term_1", label: "الفصل الدراسي الأول (خريف 2022)" },
  { value: "Term_5", label: "الفصل الدراسي الخامس (صيف 2024) - غير متوفر" }, // ترم وهمي غير متوفر
];

const resultsData = {
  Term_4: {
    termGpa: 3.52,
    cumulativeGpa: 3.25,
    termHours: 18,
    isPassed: true,
    courses: [
      {
        code: "CS301",
        name: "هياكل البيانات",
        hours: 3,
        grade: 92,
        letter: "A",
      },
      {
        code: "MA302",
        name: "إحصاء وهندسة",
        hours: 4,
        grade: 88,
        letter: "B+",
      },
      { code: "EE305", name: "إشارات ونظم", hours: 4, grade: 85, letter: "B" },
    ],
  },
  Term_3: {
    termGpa: 3.05,
    cumulativeGpa: 3.1,
    termHours: 15,
    isPassed: true,
    courses: [
      { code: "CS201", name: "قواعد بيانات", hours: 3, grade: 80, letter: "B" },
      {
        code: "MA201",
        name: "تفاضل وتكامل 2",
        hours: 4,
        grade: 75,
        letter: "C",
      },
    ],
  },
  // Term_5 غير موجود في resultsData لتمثيل حالة عدم توفر البيانات
};

// ----------------------------------------------------
// دوال مساعدة
// ----------------------------------------------------

const getGpaColor = (gpa) => {
  if (gpa >= 3.5) return "green";
  if (gpa >= 3.0) return "cyan";
  if (gpa >= 2.0) return "yellow";
  return "red";
};

/**
 * دالة لمعالجة حالة عدم توفر البيانات وإرجاع بيانات عرض افتراضية
 */
const getDisplayData = (selectedTerm) => {
  const data = resultsData[selectedTerm];
  if (data) {
    return {
      ...data,
      isDataAvailable: true,
    };
  }
  // بيانات افتراضية عند عدم توفر نتائج
  return {
    termGpa: 0.0,
    cumulativeGpa: 0.0,
    termHours: 0,
    isPassed: false,
    courses: [],
    isDataAvailable: false,
  };
};

// ----------------------------------------------------
// المكون الرئيسي
// ----------------------------------------------------

const ResultsPage = () => {
  const [selectedTerm, setSelectedTerm] = useState("Term_4");
  const currentResults = getDisplayData(selectedTerm); // استخدام الدالة الجديدة

  // ----------------------------------------------------
  // بناء صفوف الجدول
  // ----------------------------------------------------

  let rows;

  if (currentResults.isDataAvailable && currentResults.courses.length > 0) {
    // حالة توفر البيانات وعرض الصفوف الحقيقية
    rows = currentResults.courses.map((course) => (
      <Table.Tr key={course.code}>
        <Table.Td style={{ textAlign: "center" }}>{course.code}</Table.Td>
        <Table.Td style={{ textAlign: "center", minWidth: 200 }}>
          {course.name}
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>{course.hours}</Table.Td>
        <Table.Td style={{ textAlign: "center" }}>{course.grade}</Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          <Badge
            color={getGpaColor(course.letter === "A" ? 4.0 : 3.0)}
            variant="filled"
          >
            {course.letter}
          </Badge>
        </Table.Td>
      </Table.Tr>
    ));
  } else {
    // حالة عدم توفر البيانات وعرض صف واحد برسالة خطأ
    rows = (
      <Table.Tr>
        <Table.Td colSpan={5} style={{ textAlign: "center" }}>
          <Text fw={700} fz="lg" c="red">
            لا يوجد بيانات لعرضها لهذا الفصل الدراسي حتى الآن.
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">نتائج الفصل الدراسي</h1>

      <Grid gutter="xl">
        {/*
        ==================================================
        الصف الأول: اختيار الفصل الدراسي وإحصائيات GPA
        ==================================================
        */}

        {/* كارد اختيار الفصل الدراسي (span={4}) */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Flex align="center" gap="sm" mb="md">
              <CalendarSearch size={22} color="#BBB" />
              <Text fw={700} fz="lg" c="dimmed">
                اختر الفصل الدراسي
              </Text>
            </Flex>
            <Divider mb="md" />
            <Select
              placeholder="اختر فصلاً دراسياً..."
              data={availableTerms}
              value={selectedTerm}
              onChange={setSelectedTerm}
              rightSection={<BookOpenText size={18} />}
              size="md"
            />
          </Card>
        </Grid.Col>

        {/* كارد إحصائيات الترم (GPA, Hours) (span={8}) */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Flex align="center" gap="sm" mb="md">
              <GraduationCap size={22} color="#BBB" />
              <Text fw={700} fz="lg" c="dimmed">
                ملخص الفصل المختار
              </Text>
            </Flex>
            <Divider mb="md" />
            <Group justify="space-around" grow>
              <Stack align="center" gap={3}>
                <Text size="sm" c="dimmed">
                  GPA الفصل الدراسي
                </Text>
                <Badge
                  size="xl"
                  variant="filled"
                  // نستخدم اللون الأحمر مباشرة إذا كانت البيانات غير متوفرة
                  color={
                    currentResults.isDataAvailable
                      ? getGpaColor(currentResults.termGpa)
                      : "red"
                  }
                >
                  {currentResults.isDataAvailable
                    ? currentResults.termGpa.toFixed(2)
                    : "غير متوفر"}
                </Badge>
              </Stack>
              <Stack align="center" gap={3}>
                <Text size="sm" c="dimmed">
                  المعدل التراكمي الإجمالي
                </Text>
                <Badge
                  size="xl"
                  variant="outline"
                  color={
                    currentResults.isDataAvailable
                      ? getGpaColor(currentResults.cumulativeGpa)
                      : "red"
                  }
                >
                  {currentResults.isDataAvailable
                    ? currentResults.cumulativeGpa.toFixed(2)
                    : "غير متوفر"}
                </Badge>
              </Stack>
              <Stack align="center" gap={3}>
                <Text size="sm" c="dimmed">
                  ساعات الترم المعتمدة
                </Text>
                <Text
                  fw={700}
                  fz="xl"
                  color={currentResults.isDataAvailable ? "blue" : "red"}
                >
                  {currentResults.termHours} ساعة
                </Text>
              </Stack>
              <Stack align="center" gap={3}>
                <Text size="sm" c="dimmed">
                  الحالة
                </Text>
                <Badge
                  size="lg"
                  color={
                    currentResults.isDataAvailable
                      ? currentResults.isPassed
                        ? "teal"
                        : "red"
                      : "red"
                  }
                  leftSection={<CheckSquare size={14} />}
                >
                  {currentResults.isDataAvailable
                    ? currentResults.isPassed
                      ? "اجتياز بنجاح"
                      : "إنذار أكاديمي"
                    : "غير متوفر"}
                </Badge>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>

        {/*
        ==================================================
        الصف الثاني: جدول نتائج المواد
        ==================================================
        */}
        <Grid.Col span={12}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Flex align="center" gap="sm" mb="md">
              <BookOpenText size={22} color="#BBB" />
              <Text fw={700} fz="lg" c="dimmed">
                جدول نتائج المواد -{" "}
                {availableTerms.find((t) => t.value === selectedTerm)?.label}
              </Text>
            </Flex>
            <Divider mb="md" />

            <ScrollArea h={350}>
              <Table
                withColumnBorders
                withRowBorders
                withTableBorder
                highlightOnHover={currentResults.isDataAvailable}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ textAlign: "center", width: "15%" }}>
                      {" "}
                      كود المادة{" "}
                    </Table.Th>
                    <Table.Th style={{ textAlign: "center", width: "40%" }}>
                      {" "}
                      اسم المادة{" "}
                    </Table.Th>
                    <Table.Th style={{ textAlign: "center", width: "15%" }}>
                      {" "}
                      الساعات{" "}
                    </Table.Th>
                    <Table.Th style={{ textAlign: "center", width: "15%" }}>
                      {" "}
                      الدرجة{" "}
                    </Table.Th>
                    <Table.Th style={{ textAlign: "center", width: "15%" }}>
                      {" "}
                      التقدير (Letter Grade){" "}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default ResultsPage;
