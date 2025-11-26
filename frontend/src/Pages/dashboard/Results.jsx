import React, { useState, useEffect } from "react";
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
  LoadingOverlay,
} from "@mantine/core";
import { BookOpenText, CalendarSearch, GraduationCap } from "lucide-react";

import { getSemestersList, getSemesterResults } from "../../Api/Users/usersApi";

// GPA Color
const getGpaColor = (gpa) => {
  if (gpa >= 3.5) return "green";
  if (gpa >= 3.0) return "cyan";
  if (gpa >= 2.0) return "yellow";
  return "red";
};

const ResultsPage = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({
    GPA: 0,
    courses: [],
    isDataAvailable: false,
  });

  // ========== Fetch Semesters on Mount ==========
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setLoading(true);

        const res = await getSemestersList();

        const parsed = res.data.map((item) => ({
          value: item.SemesterID.toString(), // Mantine requires string
          label: item.SemesterName,
        }));

        setSemesters(parsed);

        if (parsed.length > 0) {
          setSelectedTerm(parsed[0].value); // auto select first term
        }
      } catch (err) {
        console.error("Error fetching semesters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  // ========== Fetch Results on Term Change ==========
  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!selectedTerm) return;

        setLoading(true);

        const res = await getSemesterResults(selectedTerm);

        setResults({
          GPA: parseFloat(res.GPA),
          courses: res.data,
          isDataAvailable: res.data && res.data.length > 0,
        });
      } catch (err) {
        console.error("Error fetching results:", err);
        setResults({
          GPA: 0,
          courses: [],
          isDataAvailable: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedTerm]);

  // ========== Table Rows ==========
  const rows =
    results.isDataAvailable && results.courses.length > 0 ? (
      results.courses.map((course, index) => (
        <Table.Tr key={index}>
          <Table.Td style={{ textAlign: "center" }}>
            {course.CourseCode}
          </Table.Td>
          <Table.Td style={{ textAlign: "center", minWidth: 200 }}>
            {course.CourseName}
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            {course.CreditHours}
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            {course.LetterGrade}
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            <Badge
              size="lg"
              color={getGpaColor(
                course.LetterGrade === "A"
                  ? 4
                  : course.LetterGrade === "B"
                  ? 3
                  : 2
              )}
              variant="filled"
            >
              {course.LetterGrade}
            </Badge>
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={5} style={{ textAlign: "center" }}>
          <Text fw={700} fz="lg" c="red">
            لا يوجد بيانات لهذا الفصل.
          </Text>
        </Table.Td>
      </Table.Tr>
    );

  return (
    <div style={{ position: "relative" }}>
      {/* ======= Blur + Loading ======= */}
      <LoadingOverlay visible={loading} blur={3} zIndex={1000} />

      <h1 className="title">نتائج الفصل الدراسي</h1>

      <Grid gutter="xl">
        {/* === Term Selector === */}
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
              data={semesters}
              value={selectedTerm}
              onChange={setSelectedTerm}
              rightSection={<BookOpenText size={18} />}
              size="md"
            />
          </Card>
        </Grid.Col>

        {/* === GPA Summary === */}
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
                  GPA الفصل
                </Text>
                <Badge
                  size="xl"
                  variant="filled"
                  color={
                    results.isDataAvailable ? getGpaColor(results.GPA) : "grey"
                  }
                >
                  {results.isDataAvailable ? results.GPA.toFixed(2) : "-"}
                </Badge>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>

        {/* === Courses Table === */}
        <Grid.Col span={12}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Flex align="center" gap="sm" mb="md">
              <BookOpenText size={22} color="#BBB" />
              <Text fw={700} fz="lg" c="dimmed">
                جدول نتائج المواد
              </Text>
            </Flex>
            <Divider mb="md" />

            <ScrollArea h={350}>
              <Table withColumnBorders withRowBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ textAlign: "center" }}>
                      كود المادة
                    </Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>
                      اسم المادة
                    </Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>الساعات</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>الدرجة</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>
                      التقدير (Letter)
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
