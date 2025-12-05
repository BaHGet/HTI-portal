import React, { useState, useEffect } from "react";
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
  ScrollArea, // تم إضافة ScrollArea
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
  ClipboardList, // أيقونة لجدول المواد
} from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
// يجب استبدال هذا بالمسار الصحيح لمكون جدول الطالب
import StudentTimetable from "../../Components/StudentTimetable";

// ** API Stubs (لأغراض العرض والمحاكاة)
const fetchStudentData = () =>
  Promise.resolve({
    academicGPA: 3.45,
    registeredHours: 9, // تم تعديلها لتتناسب مع المواد المسجلة
    droppedHours: 6,
    maxDropHours: 12,
  });

const fetchRegisteredSubjects = () =>
  Promise.resolve([
    {
      id: 1,
      code: "CS101",
      name: "مقدمة في علوم الحاسوب",
      hours: 3,
      professor: "د. خالد فوزي",
      status: "Registered", // Registered, Dropped
      schedule: "أحد/ثلاثاء 10:00 - 11:30",
    },
    {
      id: 2,
      code: "MATH202",
      name: "التفاضل والتكامل 2",
      hours: 3,
      professor: "أ.د. نجلاء علي",
      status: "Dropped",
      schedule: "إثنين/أربعاء 13:00 - 14:30",
    },
    {
      id: 3,
      code: "PHYS100",
      name: "فيزياء عامة",
      hours: 3,
      professor: "د. مصطفى جابر",
      status: "Registered",
      schedule: "ثلاثاء/خميس 08:00 - 09:30",
    },
    {
      id: 4,
      code: "SE310",
      name: "هندسة المتطلبات",
      hours: 3,
      professor: "د. ريم أحمد",
      status: "Registered",
      schedule: "إثنين/أربعاء 15:00 - 16:30",
    },
    {
      id: 5,
      code: "IS450",
      name: "أمن المعلومات المتقدم",
      hours: 3,
      professor: "أ. سعيد حامد",
      status: "Registered",
      schedule: "أحد/ثلاثاء 16:00 - 17:30",
    },
    {
      id: 6,
      code: "AR100",
      name: "مهارات اللغة العربية",
      hours: 2,
      professor: "د. وفاء علي",
      status: "Registered",
    },
    {
      id: 7,
      code: "EN100",
      name: "اللغة الإنجليزية 1",
      hours: 3,
      professor: "أ. ياسر خالد",
      status: "Registered",
    },
    {
      id: 8,
      code: "ECO200",
      name: "مبادئ الإقتصاد",
      hours: 3,
      professor: "د. علي محمد",
      status: "Registered",
    },
  ]);

const dropSubjectApi = (subjectId, reason) =>
  Promise.resolve({ success: true, message: `تم سحب المادة بنجاح.` });

const restoreSubjectApi = (subjectId) =>
  Promise.resolve({ success: true, message: `تمت استعادة المادة بنجاح.` });

const DropSubjectsPage = () => {
  // حالة البيانات الأساسية
  const [studentInfo, setStudentInfo] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // حالة المودال والعمليات
  const [dropModalOpened, { open: openDropModal, close: closeDropModal }] =
    useDisclosure(false);
  const [
    statusModalOpened,
    { open: openStatusModal, close: closeStatusModal },
  ] = useDisclosure(false);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dropReason, setDropReason] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // -------------------------------
  // جلب البيانات الأولية
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [info, subs] = await Promise.all([
        fetchStudentData(),
        fetchRegisteredSubjects(),
      ]);
      setStudentInfo(info);
      setSubjects(subs);
      setLoading(false);
    };
    fetchData();
  }, []);

  // -------------------------------
  // بدء عملية السحب (فتح مودال التأكيد)
  // -------------------------------
  const handleDropClick = (subject) => {
    setSelectedSubject(subject);
    setDropReason("");
    openDropModal();
  };

  // -------------------------------
  // تأكيد عملية السحب
  // -------------------------------
  const confirmDrop = async () => {
    // التحقق من إدخال السبب
    if (dropReason.trim() === "") {
      // يمكن إظهار رسالة خطأ داخل مودال التأكيد نفسه
      return;
    }
    if (!selectedSubject) return;

    closeDropModal();
    setLoading(true);

    try {
      const res = await dropSubjectApi(selectedSubject.id, dropReason);

      // تحديث الحالة المحلية للمادة
      setSubjects((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubject.id ? { ...sub, status: "Dropped" } : sub
        )
      );

      // تحديث عدد الساعات المسحوبة في بيانات الطالب
      setStudentInfo((prev) => ({
        ...prev,
        registeredHours: prev.registeredHours - selectedSubject.hours,
        droppedHours: prev.droppedHours + selectedSubject.hours,
      }));

      setStatusMessage({ type: "success", text: res.message });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "فشل عملية السحب. حدث خطأ في النظام.",
      });
    } finally {
      setLoading(false);
      setSelectedSubject(null);
      openStatusModal(); // فتح مودال الإشعار الجديد
    }
  };

  // -------------------------------
  // استعادة المادة المسحوبة
  // -------------------------------
  const handleRestore = async (subject) => {
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await restoreSubjectApi(subject.id);

      // تحديث الحالة المحلية للمادة
      setSubjects((prev) =>
        prev.map((sub) =>
          sub.id === subject.id ? { ...sub, status: "Registered" } : sub
        )
      );

      // تحديث عدد الساعات المسجلة والمسحوبة في بيانات الطالب
      setStudentInfo((prev) => ({
        ...prev,
        registeredHours: prev.registeredHours + subject.hours,
        droppedHours: prev.droppedHours - subject.hours,
      }));

      setStatusMessage({ type: "success", text: res.message });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "فشل استعادة المادة. حدث خطأ في النظام.",
      });
    } finally {
      setLoading(false);
      openStatusModal(); // فتح مودال الإشعار الجديد
    }
  };

  // -------------------------------
  // Rows for the subjects table
  // -------------------------------
  const subjectRows = subjects.map((sub) => (
    <Table.Tr
      key={sub.id}
      // تطبيق الشطب والشفافية على المادة المسحوبة
      style={{
        textDecoration: sub.status === "Dropped" ? "line-through" : "none",
        opacity: sub.status === "Dropped" ? 0.6 : 1,
      }}
    >
      <Table.Td style={{ textAlign: "center" }}>{sub.code}</Table.Td>
      <Table.Td>{sub.name}</Table.Td>
      <Table.Td style={{ textAlign: "center" }}>{sub.hours}</Table.Td>
      <Table.Td>{sub.professor}</Table.Td>
      <Table.Td style={{ textAlign: "center" }}>
        {sub.status === "Registered" ? (
          <Button
            size="xs"
            color="red"
            variant="light"
            leftSection={<Trash2 size={16} />}
            onClick={() => handleDropClick(sub)}
          >
            سحب
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

      {/* 1. Modal: تأكيد السحب (يطلب السبب) */}
      <Modal
        opened={dropModalOpened}
        onClose={closeDropModal}
        title={
          <Group gap="xs">
            <AlertTriangle size={20} color="red" />
            <Text fw={700} fz="lg" c="">
              تأكيد سحب مقرر
            </Text>
          </Group>
        }
        centered
        dir="rtl" // لضمان الاتجاه الصحيح داخل المودال
      >
        <Stack spacing="md">
          <Alert color="red" title="تنبيه هام">
            السحب قد يؤثر على وضعك الأكاديمي، تأكد من قرارك.
          </Alert>

          {selectedSubject && (
            <Card shadow="none" withBorder p="md" dir="rtl">
              <Group justify="space-between" mb={5}>
                <Text fw={700}>المادة:</Text>
                <Text c="blue">{selectedSubject.name}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={700}>كود المادة:</Text>
                <Text c="blue">{selectedSubject.code}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={700}>عدد الساعات:</Text>
                <Badge color="red">{selectedSubject.hours} ساعة</Badge>
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

      {/* 2. Modal: إشعار حالة العملية (نجاح/فشل) */}
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

      {/* Main Layout: Row 1 (Data & Timetable) */}
      <Grid gutter="lg">
        {/* بيانات الطالب وملخص الساعات (Col 6) */}
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
                    المعدل الأكاديمي (GPA):
                  </Text>
                  <Badge size="lg" color="green">
                    {studentInfo.academicGPA}
                  </Badge>
                </Group>
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
                    الساعات المسحوبة (في هذا الفصل):
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

        {/* جدول مواعيد الطالب (Col 6) */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <StudentTimetable />
        </Grid.Col>
      </Grid>

      {/* Main Layout: Row 2 (Subjects Table) */}
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
              // استخدام ScrollArea لتحديد الارتفاع الأقصى
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
                      <Table.Th style={{ width: "20%" }}>الأستاذ</Table.Th>
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
