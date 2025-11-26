import {
  Grid,
  Card,
  Flex,
  Text,
  Select,
  Table,
  Button,
  Divider,
  Stack,
  Group,
  Checkbox,
  Textarea,
  Modal,
  Badge,
  ScrollArea,
} from "@mantine/core";
import {
  FileText,
  BookOpenText,
  User,
  Hash,
  Award,
  CircleCheck,
  ClipboardList,
  MailOpen,
  Send,
  X,
  Clock,
} from "lucide-react";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

// ----------------------------------------------------
// Mock Data
// ----------------------------------------------------
const availableCourses = [
  {
    value: "CS301",
    label: "CS301 - هياكل البيانات",
    details: {
      name: "هياكل البيانات",
      doctor: "د. خالد إبراهيم",
      currentGrade: "B+",
      gradePoints: 3.3,
      gradeBreakdown: { midterm: 25, final: 40, activities: 20 },
    },
  },
  {
    value: "MA302",
    label: "MA302 - إحصاء وهندسة",
    details: {
      name: "إحصاء وهندسة",
      doctor: "د. ليلى أحمد",
      currentGrade: "C",
      gradePoints: 2.0,
      gradeBreakdown: { midterm: 15, final: 30, activities: 10 },
    },
  },
  {
    value: "EE305",
    label: "EE305 - إشارات ونظم",
    details: {
      name: "إشارات ونظم",
      doctor: "م. يوسف علي",
      currentGrade: "A",
      gradePoints: 4.0,
      gradeBreakdown: { midterm: 30, final: 50, activities: 20 },
    },
  },
];

const initialAppealsHistory = [
  {
    code: "MA201",
    name: "تفاضل وتكامل 2",
    date: "2024-05-10",
    status: "Approved",
    adjustment: "+5 درجات",
  },
  {
    code: "PH102",
    name: "فيزياء 2",
    date: "2023-12-01",
    status: "UnderReview",
    adjustment: "قيد المراجعة",
  },
  {
    code: "HU204",
    name: "أخلاقيات المهنة",
    date: "2023-09-15",
    status: "Rejected",
    adjustment: "لا تعديل",
  },
];

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------
const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return (
        <Badge color="teal" leftSection={<CircleCheck size={14} />}>
          تم التعديل
        </Badge>
      );
    case "UnderReview":
      return (
        <Badge color="yellow" leftSection={<Clock size={14} />}>
          قيد المراجعة
        </Badge>
      );
    case "Rejected":
      return (
        <Badge color="red" leftSection={<X size={14} />}>
          لا تعديل
        </Badge>
      );
    default:
      return <Badge color="gray">Unknown</Badge>;
  }
};

const getPartLabel = (key) => {
  switch (key) {
    case "midterm":
      return "الميدتيرم (Midterm)";
    case "final":
      return "النهائي (Final)";
    case "activities":
      return "أعمال السنة (Activities)";
    default:
      return key;
  }
};

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
const AppealsPage = () => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [appealNotes, setAppealNotes] = useState("");
  const [checkedParts, setCheckedParts] = useState([]);
  const [appealHistory, setAppealHistory] = useState(initialAppealsHistory);
  const [opened, { open, close }] = useDisclosure(false);

  const currentCourse = availableCourses.find(
    (c) => c.value === selectedCourseCode
  );
  const totalGrade = currentCourse
    ? Object.values(currentCourse.details.gradeBreakdown).reduce(
        (sum, score) => sum + score,
        0
      )
    : 0;

  const handleCheckboxChange = (part) => {
    setCheckedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleSelectAll = (checked) => {
    if (currentCourse) {
      if (checked) {
        setCheckedParts(Object.keys(currentCourse.details.gradeBreakdown));
      } else {
        setCheckedParts([]);
      }
    }
  };

  const submitAppeal = () => {
    if (
      !currentCourse ||
      checkedParts.length === 0 ||
      appealNotes.trim() === ""
    ) {
      alert(
        "Please select a course, check at least one part to appeal, and write your notes."
      );
      return;
    }
    open();
  };

  const confirmSubmission = () => {
    close();
    const newAppeal = {
      code: currentCourse.value,
      name: currentCourse.details.name,
      date: new Date().toLocaleDateString("ar-EG"),
      status: "UnderReview",
      adjustment: "قيد المراجعة",
      parts: checkedParts.map((p) => getPartLabel(p)).join(", "),
      notes: appealNotes || "No additional notes.",
    };
    setAppealHistory([newAppeal, ...appealHistory]);
    setSelectedCourseCode(null);
    setCheckedParts([]);
    setAppealNotes("");
    alert(
      "تم تقديم الالتماس بنجاح! سيتم مراجعة طلبك وإبلاغك بالتحديثات."
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">صفحة تقديم الالتماسات</h1>

      <Modal
        opened={opened}
        dir="rtl"
        onClose={close}
        title={
          <Text fw={700} fz="lg">
            تأكيد تقديم الالتماس
          </Text>
        }
        centered
      >
        <Stack spacing="md">
          <Text>هل أنت متأكد من رغبتك في تقديم التماس بهذه البيانات؟</Text>
          <Divider />
          <Group justify="space-between">
            <Text fw={700}>المادة:</Text>
            <Text>
              {currentCourse?.details.name} ({currentCourse?.value})
            </Text>
          </Group>
          <Group justify="space-between">
            <Text fw={700}>أجزاء الاعتراض:</Text>
            <Badge color="red" variant="light">
              {checkedParts.map((p) => getPartLabel(p)).join(" | ")}
            </Badge>
          </Group>
          <Group justify="space-between" align="flex-start">
            <Text fw={700}>ملاحظات الطالب:</Text>
            <ScrollArea
              h={80}
              w={250}
              p="xs"
              style={{ border: "1px dashed #ccc", borderRadius: "4px" }}
            >
              <Text size="sm">{appealNotes || "لا توجد ملاحظات."}</Text>
            </ScrollArea>
          </Group>
          <Divider />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              إلغاء
            </Button>
            <Button
              leftSection={<Send size={16} />}
              onClick={confirmSubmission}
            >
              تأكيد وتقديم
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <MailOpen size={22} color="#4C6EF5" />
              <Text fw={700} fz="lg" c="dimmed">
                بيانات تقديم الالتماس
              </Text>
            </Group>
            <Divider mb="lg" />
            <Select
              label="اختر المادة المراد الاعتراض عليها"
              placeholder="ابحث بكود أو اسم المادة..."
              data={availableCourses}
              value={selectedCourseCode}
              onChange={setSelectedCourseCode}
              searchable
              nothingFoundMessage="لم يتم العثور على المادة..."
              size="md"
            />
            {currentCourse && (
              <Stack
                spacing="xs"
                mt="xl"
                p="md"
                style={{ backgroundColor: "#F8F9FA", borderRadius: "4px" }}
              >
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <Hash size={16} style={{ marginLeft: 5 }} />
                    كود المادة:
                  </Text>
                  <Text fw={700} size="md" color="blue">
                    {currentCourse.value}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <BookOpenText size={16} style={{ marginLeft: 5 }} />
                    اسم المادة:
                  </Text>
                  <Text size="md">{currentCourse.details.name}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <User size={16} style={{ marginLeft: 5 }} />
                    الدكتور:
                  </Text>
                  <Text size="md">{currentCourse.details.doctor}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <Award size={16} style={{ marginLeft: 5 }} />
                    التقدير الحالي:
                  </Text>
                  <Badge size="lg" color="green">
                    {currentCourse.details.currentGrade}
                  </Badge>
                </Group>
              </Stack>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder h="100%">
            <Group mb="md">
              <ClipboardList size={22} color="#FAB005" />
              <Text fw={700} fz="lg" c="dimmed">
                تحديد أجزاء الاعتراض والملاحظات
              </Text>
            </Group>
            <Divider mb="lg" />
            {!currentCourse ? (
              <Text c="red" fz="md" align="center" mt="xl">
                الرجاء اختيار مادة من القائمة لتمكين خيارات الاعتراض.
              </Text>
            ) : (
              <Stack spacing="xl">
                <Table withColumnBorders withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: "40%" }}>الجزء</Table.Th>
                      <Table.Th style={{ width: "30%" }}>
                        الدرجة المتحصل عليها
                      </Table.Th>
                      <Table.Th style={{ width: "30%", textAlign: "center" }}>
                        الاعتراض
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {Object.entries(currentCourse.details.gradeBreakdown).map(
                      ([key, score]) => (
                        <Table.Tr key={key}>
                          <Table.Td>{getPartLabel(key)}</Table.Td>
                          <Table.Td fw={700} c="blue">
                            {score} درجة
                          </Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>
                            <Checkbox
                              checked={checkedParts.includes(key)}
                              onChange={() => handleCheckboxChange(key)}
                              color="orange"
                            />
                          </Table.Td>
                        </Table.Tr>
                      )
                    )}
                  </Table.Tbody>
                  <Table.Tfoot>
                    <Table.Tr style={{ backgroundColor: "#F8F9FA" }}>
                      <Table.Td colSpan={2} fw={700}>
                        المجموع الكلي للدرجات: {totalGrade}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "center" }}>
                        <Checkbox
                          label="اعتراض على الكل"
                          checked={
                            checkedParts.length ===
                            Object.keys(currentCourse.details.gradeBreakdown)
                              .length
                          }
                          onChange={(event) =>
                            handleSelectAll(event.currentTarget.checked)
                          }
                          color="red"
                        />
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
                <Textarea
                  label="ملاحظات الطالب وسبب تقديم الالتماس (مطلوب)"
                  placeholder="وضح بالتفصيل سبب اعتراضك على الدرجة..."
                  value={appealNotes}
                  onChange={(event) =>
                    setAppealNotes(event.currentTarget.value)
                  }
                  minRows={3}
                  maxRows={6}
                />
                <Button
                  leftSection={<Send size={18} />}
                  onClick={submitAppeal}
                  disabled={
                    checkedParts.length === 0 || appealNotes.trim() === ""
                  }
                  size="lg"
                  color="indigo"
                >
                  تقديم الالتماس
                </Button>
              </Stack>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      <Divider label="سجل الالتماسات" labelPosition="center" my="sm" />

      <Card shadow="sm" radius="md" padding="lg" withBorder>
        <Group mb="md">
          <FileText size={22} color="#40C057" />
          <Text fw={700} fz="lg" c="dimmed">
            سجل الالتماسات المقدمة
          </Text>
        </Group>
        <ScrollArea h={300}>
          <Table withColumnBorders withTableBorder highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: "15%", textAlign: "center" }}>
                  كود المادة
                </Table.Th>
                <Table.Th style={{ width: "25%", textAlign: "center" }}>
                  اسم المادة
                </Table.Th>
                <Table.Th style={{ width: "15%", textAlign: "center" }}>
                  تاريخ التقديم
                </Table.Th>
                <Table.Th style={{ width: "20%", textAlign: "center" }}>
                  الحالة
                </Table.Th>
                <Table.Th style={{ width: "25%", textAlign: "center" }}>
                  التعديل الناتج
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {appealHistory.length > 0 ? (
                appealHistory.map((appeal, index) => (
                  <Table.Tr key={index}>
                    <Table.Td style={{ textAlign: "center" }}>
                      {appeal.code}
                    </Table.Td>
                    <Table.Td>{appeal.name}</Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {appeal.date}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {getStatusBadge(appeal.status)}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {appeal.adjustment}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                    <Text c="dimmed">لم يتم تقديم أي التماسات سابقة.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AppealsPage;
