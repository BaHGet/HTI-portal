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
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { getMyGrades, createAppeal } from "../../Api/Users/usersApi";

const AppealsPage = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [appealNotes, setAppealNotes] = useState("");
  const [checkedParts, setCheckedParts] = useState([]);
  const [appealHistory, setAppealHistory] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    alreadyAppealedOpened,
    { open: openAlreadyAppealedModal, close: closeAlreadyAppealedModal },
  ] = useDisclosure(false);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyGrades();
        if (res.success) {
          const courses = res.data.map((grade) => ({
            value: grade.GradeID.toString(),
            label: `المادة ${grade.GradeID}`,
            details: {
              name: `المادة ${grade.GradeID}`,
              doctor: "غير متوفر",
              currentGrade: grade.LetterGrade,
              gradeBreakdown: {
                midterm: grade.Midterm,
                final: grade.Final,
                activities: grade.Activities,
              },
              gradeAppeal: grade.GradeAppeal,
            },
          }));
          setAvailableCourses(courses);

          // Build appealHistory
          const history = res.data
            .filter((g) => g.GradeAppeal) // فقط المواد اللي فيها اعتراض
            .map((g) => ({
              code: g.GradeID.toString(),
              name: `المادة ${g.GradeID}`,
              date: g.GradeAppeal.CreatedAt
                ? new Date(g.GradeAppeal.CreatedAt).toLocaleDateString("ar-EG")
                : "-", // لو التاريخ متوفر
              status: g.GradeAppeal.Status, // Pending, Approved, Rejected
              adjustment:
                g.GradeAppeal.Status === "Pending"
                  ? "قيد المراجعة"
                  : g.GradeAppeal.Status === "Approved"
                  ? "تم التعديل"
                  : "لا تعديل",
            }));
          setAppealHistory(history);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);


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
    if (!currentCourse) {
      alert("الرجاء اختيار مادة.");
      return;
    }
    if (checkedParts.length === 0) {
      alert("الرجاء اختيار جزء واحد على الأقل للاعتراض.");
      return;
    }

    // لو المادة فيها اعتراض مسبق
    if (currentCourse.details.gradeAppeal) {
      // فتح مودال مختلف
      openAlreadyAppealedModal();
      return;
    }

    // لو لا -> فتح مودال التأكيد العادي
    open();
  };


  const confirmSubmission = async () => {
    close();
    try {
      const appealData = {
        gradeId: currentCourse.value.toString(),
        appealMidterm: checkedParts.includes("midterm") ? "true" : "false",
        appealFinal: checkedParts.includes("final") ? "true" : "false",
        appealActivities: checkedParts.includes("activities")
          ? "true"
          : "false",
        studentNotes: appealNotes,
      };

      const res = await createAppeal(appealData);

      if (res.success) {
        const newAppeal = {
          code: currentCourse.value,
          name: currentCourse.details.name,
          date: new Date(res.data.CreatedAt).toLocaleDateString("ar-EG"),
          status: "UnderReview",
          adjustment: "قيد المراجعة",
        };
        setAppealHistory([newAppeal, ...appealHistory]);
        setSelectedCourseCode(null);
        setCheckedParts([]);
        setAppealNotes("");
        alert(res.message);
      } else {
        alert(res.message || "حدث خطأ عند تقديم الالتماس.");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في الاتصال بالسيرفر.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge color="teal" leftSection={<CircleCheck size={14} />}>
            تم التعديل
          </Badge>
        );
      case "Pending":
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

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">صفحة تقديم الالتماسات</h1>
      <Modal
        opened={alreadyAppealedOpened}
        onClose={closeAlreadyAppealedModal}
        title="تنبيه"
      >
        <Text>تم تقديم التماس على هذه المادة من قبل.</Text>
        <Group position="right" mt="md">
          <Button onClick={closeAlreadyAppealedModal} color="red">
            إلغاء
          </Button>
        </Group>
      </Modal>

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
                    <Flex>
                      <Hash size={16} style={{ marginLeft: 5 }} />
                      كود المادة:
                    </Flex>
                  </Text>
                  <Text fw={700} size="md" color="blue">
                    {currentCourse.value}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <Flex>
                      <BookOpenText size={16} style={{ marginLeft: 5 }} />
                      اسم المادة:
                    </Flex>
                  </Text>
                  <Text size="md">{currentCourse.details.name}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <Flex>
                      <User size={16} style={{ marginLeft: 5 }} />
                      الدكتور:
                    </Flex>
                  </Text>
                  <Text size="md">{currentCourse.details.doctor}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} size="sm" c="dimmed">
                    <Flex>
                      <Award size={16} style={{ marginLeft: 5 }} />
                      التقدير الحالي:
                    </Flex>
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
