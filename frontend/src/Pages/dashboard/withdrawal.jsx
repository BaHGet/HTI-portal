import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Card,
  Text,
  Button,
  Divider,
  Stack,
  Group,
  Table,
  Badge,
  Modal,
  Textarea,
  Loader,
  Flex,
  ScrollArea,
  Alert,
} from "@mantine/core";
import {
  Hourglass,
  Clock,
  Trash2,
  Undo2,
  AlertTriangle,
  Send,
  User,
  Hash,
  BookOpen,
  CircleCheck,
  X,
  ClipboardList,
} from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  getRegisteredSubjects,
  getMe,
  withdrawSubject,
  restoreSubject,
} from "../../Api/Users/usersApi"; // تعديل استيراد الـ API
import StudentTimetable from "../../Components/studentTimetable.jsx";
import { useRegisteredSchedule } from "../../hooks/queries/use-registered-schedule";

// ** Main DropSubjectsPage Component
const DropSubjectsPage = () => {
  const { refetch } = useRegisteredSchedule();

  const [studentInfo, setStudentInfo] = useState({
    academicGPA: 0,
    registeredHours: 0,
    droppedHours: 0,
    maxDropHours: 12,
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal logic for dropping and restoring subjects
  const [dropModalOpened, { open: openDropModal, close: closeDropModal }] =
    useDisclosure(false);
  const [
    statusModalOpened,
    { open: openStatusModal, close: closeStatusModal },
  ] = useDisclosure(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dropReason, setDropReason] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Fetch student data and registered subjects
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [info, subs] = await Promise.all([
        getMe(),
        getRegisteredSubjects(),
      ]);
      setStudentInfo({
        academicGPA: info?.GPA,
        maxDropHours: info?.maxDropHours || 12,  // Ensure to fetch maxDropHours from the response if available
        registeredHours: subs.data.reduce(
          (total, sub) => total + sub.CourseGroup.Course.CreditHours,
          0
        ),
        droppedHours: subs.data.filter(sub => sub.status === "Withdrawn").reduce(
          (total, sub) => total + sub.CourseGroup.Course.CreditHours,
          0
        ), 
      });
      setSubjects(subs.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDropClick = (subject) => {
    setSelectedSubject(subject);
    setDropReason("");
    openDropModal();
  };

  const confirmDrop = async () => {
    if (dropReason.trim() === "") {
      return;
    }
    if (!selectedSubject) return;

    closeDropModal();
    setLoading(true);

    try {
      const res = await withdrawSubject(selectedSubject.EnrollmentID);
      setSubjects((prev) =>
        prev.map((sub) =>
          sub.EnrollmentID === selectedSubject.EnrollmentID
            ? { ...sub, status: "Withdrawn" }
            : sub
        )
      );
      setStudentInfo((prev) => ({
        ...prev,
        registeredHours:
          prev.registeredHours - selectedSubject.CourseGroup.Course.CreditHours,
        droppedHours:
          prev.droppedHours + selectedSubject.CourseGroup.Course.CreditHours,
      }));
      setStatusMessage({ type: "success", text: res.message });

      // Refetch the data after withdrawal
      refetch(); // This will trigger a refetch of the registered schedule.
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "فشل عملية السحب. حدث خطأ في النظام.",
      });
    } finally {
      setLoading(false);
      openStatusModal();
    }
  };

  const handleRestore = async (subject) => {
    setLoading(true);
    setStatusMessage({ type: "", text: "" });
    try {
      const res = await restoreSubject(subject.EnrollmentID);
      setSubjects((prev) =>
        prev.map((sub) =>
          sub.EnrollmentID === subject.EnrollmentID
            ? { ...sub, status: "Registered" }
            : sub
        )
      );
      setStudentInfo((prev) => ({
        ...prev,
        registeredHours:
          prev.registeredHours + subject.CourseGroup.Course.CreditHours,
        droppedHours:
          prev.droppedHours - subject.CourseGroup.Course.CreditHours,
      }));
      setStatusMessage({ type: "success", text: res.message });
      refetch(); // Refetch data after restoring the subject.
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "فشل استعادة المادة. حدث خطأ في النظام.",
      });
      console.error(err);
    } finally {
      setLoading(false);
      openStatusModal();
    }
  };

  const subjectRows = subjects.map((sub) => (
    <Table.Tr
      key={sub.EnrollmentID} // استخدام EnrollmentID كـ key فريد
      style={{
        textDecoration: sub.status === "Withdrawn" ? "line-through" : "none", // شطب المادة المسحوبة
        opacity: sub.status === "Withdrawn" ? 0.6 : 1,
      }}
    >
      <Table.Td style={{ textAlign: "center" }}>
        {sub.CourseGroup?.Course?.CourseCode}
      </Table.Td>
      <Table.Td>{sub.CourseGroup?.Course?.CourseName}</Table.Td>
      <Table.Td style={{ textAlign: "center" }}>
        {sub.CourseGroup?.Course?.CreditHours}
      </Table.Td>
      <Table.Td style={{ textAlign: "center" }}>
        {sub.Status === "Registered" ? (
          <Button
            size="xs"
            color="red"
            variant="light"
            leftSection={<Trash2 size={16} />}
            onClick={() => handleDropClick(sub)}
          >
            انسحاب
          </Button>
        ) : (
          <Button
            size="xs"
            color="orange"
            variant="light"
            leftSection={<Undo2 size={16} />}
            onClick={() => handleRestore(sub)}
          >
            استعادة
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-col gap-y-6" dir="rtl">
      <h1 className="title">سحب المقررات</h1>
      {loading && <Loader />}

      <Modal
        opened={dropModalOpened}
        onClose={closeDropModal}
        title={
          <Group gap="xs">
            <AlertTriangle size={20} color="red" />
            <Text fw={700} fz="lg">
              تأكيد سحب مقرر
            </Text>
          </Group>
        }
        centered
        dir="rtl"
      >
        <Stack spacing="md">
          <Alert color="red" title="تنبيه هام">
            السحب قد يؤثر على وضعك الأكاديمي، تأكد من قرارك.
          </Alert>

          {selectedSubject && (
            <Card shadow="none" withBorder p="md" dir="rtl">
              <Group justify="space-between" mb={5}>
                <Text fw={700}>المادة:</Text>
                <Text c="blue">
                  {selectedSubject.CourseGroup?.Course?.CourseName}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={700}>كود المادة:</Text>
                <Text c="blue">
                  {selectedSubject.CourseGroup?.Course?.CourseCode}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={700}>عدد الساعات:</Text>
                <Badge color="red">
                  {selectedSubject.CourseGroup?.Course?.CreditHours} ساعة
                </Badge>
              </Group>
            </Card>
          )}

          <Textarea
            label="الرجاء كتابة سبب سحب المادة (مطلوب)"
            placeholder="مثال: صعوبة المادة."
            value={dropReason}
            onChange={(event) => setDropReason(event.currentTarget.value)}
            minRows={3}
            error={
              dropReason.trim() === "" ? "السبب مطلوب لتأكيد السحب." : false
            }
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeDropModal}>
              إلغاء
            </Button>
            <Button
              rightSection={<Send size={16} />}
              onClick={confirmDrop}
              color="red"
              disabled={dropReason.trim() === "" || loading}
            >
              تأكيد السحب
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={statusModalOpened}
        onClose={closeStatusModal}
        title={
          <Group gap="xs">
            {statusMessage.type === "success" ? (
              <CircleCheck size={20} color="teal" />
            ) : (
              <X size={20} color="red" />
            )}
            <Text
              fw={700}
              fz="lg"
              c={statusMessage.type === "success" ? "teal" : "red"}
            >
              {statusMessage.type === "success"
                ? "نجاح العملية"
                : "فشل العملية"}
            </Text>
          </Group>
        }
        dir="rtl"
      >
        <Text c={statusMessage.type === "success" ? "black" : "red"}>
          {statusMessage.text}
        </Text>
      </Modal>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <User size={22} color="#4C6EF5" />
              <Text fw={700} fz="lg" c="dimmed">
                ملخص بيانات الطالب
              </Text>
            </Group>
            <Divider mb="lg" />

            {loading ? (
              <Flex justify="center" align="center" h={150}>
                <Loader size="sm" />
              </Flex>
            ) : (
              <Stack spacing="md">
                <Group justify="space-between">
                  <Text fw={500} c="dimmed">
                    الساعات المسجلة حالياً:
                  </Text>
                  <Badge
                    size="lg"
                    color="blue"
                    leftSection={<Clock size={16} />}
                  >
                    {studentInfo.registeredHours} ساعة
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} c="dimmed">
                    الساعات المسحوبة:
                  </Text>
                  <Badge
                    size="lg"
                    color="red"
                    leftSection={<Trash2 size={16} />}
                  >
                    {studentInfo.droppedHours} ساعة
                  </Badge>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text fw={700}>الحد الأقصى للساعات المسحوبة:</Text>
                  <Text fw={700} c="orange">
                    {studentInfo.maxDropHours} ساعة
                  </Text>
                </Group>
              </Stack>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <StudentTimetable />
        </Grid.Col>
      </Grid>

      <Grid gutter="lg">
        <Grid.Col span={12}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <ClipboardList size={22} color="#FAB005" />
              <Text fw={700} fz="lg" c="dimmed">
                المقررات المسجلة والقابلة للسحب
              </Text>
            </Group>
            <Divider mb="lg" />

            {loading ? (
              <Flex justify="center" align="center" h={200}>
                <Loader />
              </Flex>
            ) : (
              <ScrollArea h={300}>
                <Table withColumnBorders withTableBorder highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: "15%", textAlign: "center" }}>
                        <Flex>
                          <Hash size={16} /> كود المادة
                        </Flex>
                      </Table.Th>
                      <Table.Th style={{ width: "35%" }}>اسم المادة</Table.Th>
                      <Table.Th style={{ width: "15%", textAlign: "center" }}>
                        ساعات
                      </Table.Th>
                      <Table.Th style={{ width: "15%", textAlign: "center" }}>
                        الإجراء
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{subjectRows}</Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default DropSubjectsPage;
