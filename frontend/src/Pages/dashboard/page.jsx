import {
  School,
  Calendar,
  Phone,
  Mail,
  Trophy,
  Bell,
  Info,
  GraduationCap,
  ChartNoAxesCombined,
} from "lucide-react";
import { LineChart } from "@mantine/charts";
import {
  Card,
  Text,
  Badge,
  Group,
  Grid,
  Avatar,
  Stack,
  Flex,
  Progress,
  Table,
  ScrollArea,
  Notification,
  Divider,
  SemiCircleProgress,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { Footer } from "../../layouts/footer";
import profileImage from "../../assets/user_img.jpg";
import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import StudentTimetable from "../../Components/StudentTimetable";

// ✅ عدّل المسار ده حسب مكان hook عندك
import { useMe } from "../../hooks/queries/useMe";

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

const initialNotifications = [
  {
    id: 1,
    title: "فتح التسجيل",
    message: "التسجيل للفصل الدراسي الجديد أصبح مفتوح الآن.",
    type: "important",
  },
  {
    id: 2,
    title: "دفع المصاريف",
    message: "المصاريف لم تُدفع بعد، يرجى الإسراع بالدفع.",
    type: "important",
  },
  {
    id: 3,
    title: "إعلام عام",
    message: "تم تحديث مواعيد المحاضرات الأسبوع القادم.",
    type: "info",
  },
  {
    id: 4,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success",
  },
  {
    id: 5,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success",
  },
  {
    id: 6,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success",
  },
  {
    id: 7,
    title: "موافقة على طلب",
    message: "تم الموافقة على طلبك لتغيير المجموعة.",
    type: "success",
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

const coursesThisTerm = [
  { code: "CS101", name: "Introduction to CS", grade: 85, hours: 3 },
  { code: "MATH201", name: "Calculus", grade: 92, hours: 3 },
  { code: "PHY101", name: "Physics I", grade: 76, hours: 2 },
  { code: "ENG101", name: "English", grade: 89, hours: 2 },
  { code: "HIST101", name: "History", grade: 95, hours: 2 },
  { code: "CHEM101", name: "Chemistry", grade: 67, hours: 3 },
  { code: "BIO101", name: "Biology", grade: 88, hours: 3 },
];

const page = () => {
  const cardRef = useRef(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // ✅ getMe مرة واحدة (React Query cache)
  const { data: meResponse, isLoading: isMeLoading } = useMe();
  const me = meResponse?.data;

  // ✅ أثناء اللودينج: ممنوع أي داتا ستاتيك تظهر
  const showStatic = !isMeLoading;

  const studentName = isMeLoading ? "" : me?.StudentName || "";
  const studentId = isMeLoading ? "" : me?.StudentID ?? "";
  const departmentName = isMeLoading
    ? ""
    : me?.department?.DepartmentName || "";

  const completedHoures = isMeLoading ? 0 : Number(me?.CreditHours ?? 0);
  const totalRequiredCredits = isMeLoading
    ? 0
    : Number(me?.AcademicRegulation?.TotalRequiredCredits ?? 0);

  const remainingHours = isMeLoading
    ? ""
    : Math.max(totalRequiredCredits - completedHoures, 0);

  const gpaNumber = isMeLoading ? null : Number(me?.gpa ?? 0);
  const gpaLabel = isMeLoading
    ? "GPA: --"
    : `GPA: ${Number.isFinite(gpaNumber) ? gpaNumber.toFixed(2) : "--"}`;

  const gpaValuePct =
    isMeLoading || !Number.isFinite(gpaNumber)
      ? 0
      : Math.min(Math.max((gpaNumber / 4) * 100, 0), 100);

  const gpaText = (() => {
    if (isMeLoading || !Number.isFinite(gpaNumber)) return "";
    if (gpaNumber >= 3.4) return "ممتاز";
    if (gpaNumber >= 2.8) return "جيد جداً";
    if (gpaNumber >= 2.2) return "جيد";
    if (gpaNumber >= 2.0) return "مقبول";
    return "ضعيف";
  })();

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
        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 2000);
      })
      .catch((err) => {
        console.error("Error generating image", err);
      });
  };

  function calculateTermGPA(courses, prevGPA = 0, prevHours = 0) {
    const gradeToGPA = (grade) => {
      if (grade >= 95) return 4.0;
      if (grade >= 90) return 4.0;
      if (grade >= 85) return 3.7;
      if (grade >= 80) return 3.3;
      if (grade >= 75) return 3.0;
      if (grade >= 70) return 2.7;
      if (grade >= 65) return 2.3;
      if (grade >= 60) return 2.0;
      return 0.0;
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
    if (grade >= 95) return 4.0;
    if (grade >= 90) return 4.0;
    if (grade >= 85) return 3.7;
    if (grade >= 80) return 3.3;
    if (grade >= 75) return 3.0;
    if (grade >= 70) return 2.7;
    if (grade >= 65) return 2.3;
    if (grade >= 60) return 2.0;
    return 0.0;
  }

  // ✅ الحسابات دي ملهاش API واضح عندك دلوقتي، فهنسيبها (بس مش هتظهر أثناء اللودينج)
  const prevGPA = 3.01;
  const prevHours = 126;

  const safeCoursesThisTerm = isMeLoading ? [] : coursesThisTerm;

  const totalNewHours = safeCoursesThisTerm.reduce(
    (acc, c) => acc + c.hours,
    0
  );
  const totalNewPoints = safeCoursesThisTerm.reduce(
    (acc, c) => acc + gradeToGPA(c.grade) * c.hours,
    0
  );

  const newTermGPA = calculateTermGPA(safeCoursesThisTerm, prevGPA, prevHours);
  const newCumulativeGPA =
    prevHours + totalNewHours === 0
      ? 0
      : (prevGPA * prevHours + totalNewPoints) / (prevHours + totalNewHours);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">الصفحة الرئيسية</h1>

      {/* ✅ بلور عالي على كل الصفحة لحد ما getMe يرجع */}
      <Box pos="relative">
        <LoadingOverlay
          visible={isMeLoading}
          zIndex={2000}
          overlayProps={{ blur: 18, opacity: 0.55 }}
        />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6, lg: 5 }} className="">
            <Flex>
              <Card shadow="sm" radius="md" padding="sm" w="100%" h="100%">
                <Group align="flex-start">
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
                      {showStatic ? "م.أ د نورا علي" : ""}
                    </Text>
                  </Flex>

                  <Stack spacing={6} style={{ flex: 1 }}>
                    <Text fw={700} fz="xl" align="center">
                      {studentName}
                    </Text>
                    <Text fw={700} fz="lg" align="center">
                      {studentId}
                    </Text>

                    <Group
                      gap="xl"
                      mt="sm"
                      justify="space-between"
                      dir="ltr"
                      px={{ base: 10, md: 50 }}
                    >
                      <Group gap={6}>
                        <School size={18} />
                        {/* ✅ اسم القسم فقط */}
                        <Text fz="sm">{departmentName}</Text>
                      </Group>

                      <Group gap={6}>
                        <Calendar size={18} />
                        <Text fz="sm" pr={35}>
                          {showStatic ? "1 DEC 2025" : ""}
                        </Text>
                      </Group>
                    </Group>

                    <Group
                      gap="xl"
                      justify="space-between"
                      dir="ltr"
                      px={{ base: 10, md: 50 }}
                    >
                      <Group gap={6}>
                        <Mail size={18} />
                        <Text fz="sm">
                          {showStatic ? "amdhazm0@gmail.com" : ""}
                        </Text>
                      </Group>

                      <Group gap={6}>
                        <Phone size={18} />
                        <Text fz="sm">
                          {showStatic ? "+2010 9655 9353" : ""}
                        </Text>
                      </Group>
                    </Group>

                    <Badge
                      ms={{ base: 0, md: 100 }}
                      size="xl"
                      w={{ base: "100%", md: 250 }}
                      variant="gradient"
                      gradient={{ from: "teal", to: "lime", deg: 90 }}
                      style={{ marginInline: "auto" }}
                    >
                      {showStatic ? "طالب مقيد" : ""}
                    </Badge>
                  </Stack>
                </Group>
              </Card>
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} className="">
            <Flex justify="center" align="center" h="100%">
              <Card shadow="sm" radius="md" w="100%" h="100%">
                <Text c="dimmed" fw={400} fz="lg" align="center">
                  Hours Progress
                </Text>
                <div className="flex w-full border-1 border-[#BBB] p-0"></div>
                <Stack spacing={20} mt={10} px={20} justify="space-around">
                  <Flex justify={"space-around"} align="center" mt={10}>
                    <Text fw={400} fz="lg" align="end" mt={10}>
                      Remaining:{" "}
                      {remainingHours !== "" ? `${remainingHours}H` : ""}
                    </Text>
                    <Text fw={400} fz="lg" align="end" mt={10}>
                      Completed: {!isMeLoading ? `${completedHoures}H` : ""}
                    </Text>
                  </Flex>

                  <Progress
                    dir="ltr"
                    size="xl"
                    value={
                      !isMeLoading && totalRequiredCredits > 0
                        ? (completedHoures / totalRequiredCredits) * 100
                        : 0
                    }
                    striped
                  />
                </Stack>
              </Card>
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} className="">
            <Flex justify="center" align="center" h="100%">
              <Card shadow="sm" radius="md" w="100%" h="100%">
                <Flex justify="start" align="center">
                  <Info size={22} color="#BBB" />
                  <Text c="dimmed" fw={400} fz="lg" align="center" px={5}>
                    المعدل الاكاديمي
                  </Text>
                </Flex>

                <div className="flex w-full border-1 border-[#BBB] p-0"></div>

                <Flex justify={"center"} align="center" mt={25}>
                  <Stack>
                    <SemiCircleProgress
                      fillDirection="left-to-right"
                      orientation="up"
                      label={gpaLabel}
                      filledSegmentColor="blue"
                      size={160}
                      thickness={16}
                      value={gpaValuePct}
                    />
                    <Text c="dimmed" fw={500} fz="lg" align="center">
                      {gpaText}
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 7 }} className="">
            <Flex justify="center" align="center">
              <StudentTimetable />
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }} className="">
            <Flex direction="column" style={{ height: "100%" }} gap="xl">
              <Card shadow="sm" radius="md" style={{ flex: 3 }}>
                <Text c="dimmed" fw={400} fz="lg" align="center" pr={5} mb={0}>
                  عدد الساعات المسجلة
                </Text>
                <div className="flex w-full border-1 border-[#BBB] p-0"></div>

                <p className="text-4xl text-center font-semibold flex justify-center mt-8">
                  {showStatic ? "16" : ""}
                </p>
                <p className="text-xl text-[#BBB] text-center  flex justify-center mt-2">
                  {showStatic ? "ساعة معتمدة" : ""}
                </p>
              </Card>

              <Card
                shadow="sm"
                radius="md"
                w="100%"
                h="100%"
                style={{ flex: 5 }}
              >
                <Text c="dimmed" fw={400} fz="lg" align="center">
                  الـترتـيـب
                </Text>
                <div className="flex w-full border-1 border-[#BBB] p-0"></div>
                <Flex justify={"center"} align="center" mt={40}>
                  <p className="text-4xl px-3">{showStatic ? "21" : ""}</p>
                  <Trophy size={48} />
                </Flex>
                <Text c="dimmed" fw={300} fz="lg" align="center" mt={25}>
                  {showStatic ? "علي مستوي قسم الهندسة الكهربية دفعة 2021" : ""}
                </Text>
              </Card>
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} className="">
            <Flex justify="center" align="center">
              <Card shadow="sm" radius="md" w="100%" h="100%">
                <Flex align={"center"} mb={15}>
                  <Bell color="#BBB" size={22} />
                  <Text
                    c="dimmed"
                    fw={400}
                    fz="lg"
                    align="center"
                    pr={5}
                    mb={0}
                  >
                    التنبيهات و الإعلامات
                  </Text>
                </Flex>

                <div className="flex w-full border-1 border-[#BBB] p-0"></div>

                <ScrollArea px={5} py={10} h={375}>
                  <Stack spacing="xs">
                    {showStatic
                      ? notifications.map((notif) => (
                          <Notification
                            key={notif.id}
                            title={notif.title}
                            color={getNotificationColor(notif.type)}
                            onClose={() => handleClose(notif.id)}
                            closeButtonProps={{
                              "aria-label": "Hide notification",
                            }}
                          >
                            {notif.message}
                          </Notification>
                        ))
                      : null}
                  </Stack>
                </ScrollArea>
              </Card>
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }} className="">
            <Flex justify="center" align="center">
              <Card shadow="sm" radius="md" p="md" w="100%" h="100%" withBorder>
                <Flex align={"center"} mb={10}>
                  <GraduationCap color="#BBB" size={22} />
                  <Text
                    c="dimmed"
                    fw={400}
                    fz="lg"
                    align="center"
                    pr={5}
                    mb={0}
                  >
                    كشف درجات الترم الحالي
                  </Text>
                </Flex>

                <Divider mb="md" />

                <Flex
                  justify="space-between"
                  mb="md"
                  direction={{ base: "column", sm: "row" }}
                  align="center"
                  gap="sm"
                >
                  <Group direction="column" spacing={2} align="center">
                    <Text size="sm" c="dimmed">
                      عدد ساعات الترم
                    </Text>
                    <Text weight={700}>{showStatic ? totalNewHours : ""}</Text>
                  </Group>

                  <Group direction="column" spacing={2} align="center">
                    <Text size="sm" c="dimmed">
                      المعدل التراكمي للترم
                    </Text>
                    <Text weight={700}>
                      {showStatic ? (3.052).toFixed(2) : ""}
                    </Text>
                  </Group>

                  <Group direction="column" spacing={2} align="center">
                    <Text size="sm" c="dimmed">
                      المعدل الإجمالي
                    </Text>
                    <Text weight={700}>
                      {showStatic ? newCumulativeGPA.toFixed(2) : ""}
                    </Text>
                  </Group>
                </Flex>

                <Divider mb="md" />

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
                      {safeCoursesThisTerm.map((course) => (
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

          <Grid.Col span={{ base: 12, lg: 7 }} className="">
            <Flex justify="center" align="center">
              <Card shadow="sm" radius="md" p="md" w="100%" h="100%" withBorder>
                <Flex align={"center"} mb={10}>
                  <ChartNoAxesCombined color="#BBB" size={22} />
                  <Text
                    c="dimmed"
                    fw={400}
                    fz="lg"
                    align="center"
                    pr={5}
                    mb={0}
                  >
                    تطور المعدل التراكمي عبر الفصول الدراسية
                  </Text>
                </Flex>

                <Divider mb="md" />

                <ScrollArea>
                  <LineChart
                    h={300}
                    data={showStatic ? termData : []}
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
      </Box>

      <Footer />
    </div>
  );
};

export default page;
