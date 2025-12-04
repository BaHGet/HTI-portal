import React, { useState, useMemo } from "react";
import {
  Grid,
  Card,
  Text,
  Button,
  Divider,
  Stack,
  Group,
  Select,
  TextInput,
  rem,
  Badge,
  Flex,
  Image,
  ScrollArea,
  Avatar,
  Pagination, // تم إضافة مكون Pagination
  Alert,
} from "@mantine/core";
import {
  Search,
  Mail,
  Phone,
  ExternalLink,
  Filter,
  CheckCircle,
  Clock,
} from "lucide-react";

// ** 1. البيانات الثابتة **
const departments = [
  { value: "CS", label: "قسم علوم الحاسوب" },
  { value: "EE", label: "قسم الهندسة الكهربائية" },
  { value: "BUSS", label: "قسم إدارة الأعمال" },
  { value: "ARCH", label: "قسم العمارة" },
  { value: "MATH", label: "قسم الرياضيات" },
  { value: "CHEM", label: "قسم الكيمياء" },
];

const ranks = [
  { value: "Professor", label: "أستاذ" },
  { value: "Associate", label: "أستاذ مشارك" },
  { value: "Assistant", label: "أستاذ مساعد" },
  { value: "Lecturer", label: "محاضر" },
];

// ** 2. البيانات الوهمية (تم زيادتها إلى 30) **
const generateFacultyData = (count) => {
  const data = [];
  const names = [
    { ar: "محمد", en: "Mohammed" },
    { ar: "فاطمة", en: "Fatimah" },
    { ar: "خالد", en: "Khalid" },
    { ar: "نورة", en: "Noura" },
    { ar: "علي", en: "Ali" },
    { ar: "سارة", en: "Sara" },
    { ar: "يوسف", en: "Yousef" },
    { ar: "مريم", en: "Maryam" },
    { ar: "عبد الله", en: "Abdullah" },
    { ar: "هدى", en: "Huda" },
    { ar: "ماجد", en: "Majid" },
    { ar: "ريما", en: "Rima" },
    { ar: "فيصل", en: "Faisal" },
    { ar: "لجين", en: "Lujain" },
    { ar: "سعود", en: "Saud" },
  ];
  const lastNames = [
    "الغامدي",
    "الحسني",
    "العلي",
    "القحطاني",
    "المالكي",
    "الرشيد",
  ];
  const specializations = [
    "الذكاء الاصطناعي",
    "إدارة الموارد البشرية",
    "أنظمة الطاقة",
    "التصميم المستدام",
    "التحليل العددي",
    "الكيمياء العضوية",
  ];

  for (let i = 1; i <= count; i++) {
    const nameIdx = i % names.length;
    const lastIdx = i % lastNames.length;
    const deptIdx = i % departments.length;
    const rankIdx = i % ranks.length;
    const specIdx = i % specializations.length;

    data.push({
      id: i,
      nameAr: `د. ${names[nameIdx].ar} ${lastNames[lastIdx]}`,
      nameEn: `Dr. ${names[nameIdx].en} ${lastNames[lastIdx]}`,
      rank: ranks[rankIdx].value,
      department: departments[deptIdx].value,
      specialization: specializations[specIdx],
      email: `${names[nameIdx].en.toLowerCase()}.${lastNames[lastIdx]
        .toLowerCase()
        .substring(0, 4)}@uni.edu`,
      phoneExt: `01023456789`,
      officeHours:
        i % 3 === 0
          ? "الاثنين والأربعاء: 14:00 - 15:00"
          : "الأحد والثلاثاء: 10:00 - 12:00",
      imageUrl: null, // تم إزالة الصور الثابتة لاستخدام Avatar
    });
  }
  return data;
};

const facultyData = generateFacultyData(30);
const RESULTS_PER_PAGE = 12; // عدد النتائج المطلوبة في كل صفحة

// ** 3. مكون بطاقة العضو (Faculty Member Card) **
const FacultyCard = ({ faculty }) => {
  const getInitials = (name) => {
    const parts = name.split(" ").filter((p) => p.length > 1);
    if (parts.length >= 2) {
      return (parts[1][0] + parts[2][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card shadow="sm" radius="md" padding="lg" withBorder h="100%">
      <Stack gap="md">
        <Group wrap="nowrap" align="flex-start" gap="md">
          <Avatar
            src={faculty.imageUrl}
            alt={faculty.nameAr}
            size={rem(80)}
            radius="md"
            color="indigo"
          >
            {getInitials(faculty.nameAr)}
          </Avatar>

          <Stack gap={rem(4)} style={{ flexGrow: 1 }}>
            <Text fw={700} fz="lg" c="blue">
              {faculty.nameAr}
            </Text>
            <Text fz="sm" c="dimmed">
              {faculty.nameEn}
            </Text>
            <Group gap="xs">
              <Badge color="cyan" variant="filled">
                {ranks.find((r) => r.value === faculty.rank)?.label}
              </Badge>
            </Group>
          </Stack>
        </Group>

        <Divider />

        <Stack gap="xs" fz="sm">
          <Group wrap="nowrap" gap="xs">
            <Text fw={500} style={{ minWidth: rem(80) }}>
              القسم:
            </Text>
            <Text>
              {departments.find((d) => d.value === faculty.department)?.label}
            </Text>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <Text fw={500} style={{ minWidth: rem(80) }}>
              التخصص:
            </Text>
            <Text fz="sm">{faculty.specialization}</Text>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <Text fw={500} style={{ minWidth: rem(80) }}>
              ساعات المكتب:
            </Text>
            <Text fz="sm" c="green">
              {faculty.officeHours}
            </Text>
          </Group>
        </Stack>

        <Group justify="space-between" mt="sm">
          <Button
            variant="light"
            color="red"
            size="sm"
            leftSection={<Mail size={16} />}
            component="a"
            href={`mailto:${faculty.email}`}
          >
            البريد الإلكتروني
          </Button>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<Phone size={16} />}
            disabled={!faculty.phoneExt}
          >
           {faculty.phoneExt}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

// ** 4. المكون الرئيسي للصفحة (FacultyDirectory) **
const FacultyDirectory = () => {
  // حالات التصفية
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);

  // حالة Pagination
  const [activePage, setPage] = useState(1);

  // دالة التصفية الرئيسية (استخدام useMemo لتحسين الأداء)
  const filteredFaculty = useMemo(() => {
    // نعود دائماً للصفحة الأولى عند تغيير شروط التصفية
    setPage(1);

    return facultyData.filter((member) => {
      // 1. تصفية البحث النصي (الاسم والتخصص)
      const matchesSearch =
        searchTerm.toLowerCase() === "" ||
        member.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. تصفية القسم
      const matchesDepartment =
        selectedDepartment === null || member.department === selectedDepartment;

      // 3. تصفية الرتبة
      const matchesRank = selectedRank === null || member.rank === selectedRank;

      return matchesSearch && matchesDepartment && matchesRank;
    });
  }, [searchTerm, selectedDepartment, selectedRank]);

  // حساب إجمالي عدد الصفحات
  const totalPages = Math.ceil(filteredFaculty.length / RESULTS_PER_PAGE);

  // حساب البيانات المعروضة في الصفحة الحالية
  const startIndex = (activePage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedFaculty = filteredFaculty.slice(startIndex, endIndex);

  // عرض بطاقات النتائج
  const facultyCards = paginatedFaculty.map((member) => (
    // يتم عرض 4 أعمدة على الشاشات الكبيرة (lg) و 2 على الشاشات المتوسطة (sm) وعمود واحد على الشاشات الصغيرة (base)
    <Grid.Col span={{ base: 12, sm: 8, lg: 4 }} key={member.id}>
      <FacultyCard faculty={member} />
    </Grid.Col>
  ));

  // عند إعادة تعيين التصفية، نعود للصفحة الأولى
  const handleReset = () => {
    setSearchTerm("");
    setSelectedDepartment(null);
    setSelectedRank(null);
    setPage(1);
  };

  return (
    <div dir="rtl">
      <Text component="h1" fw={700} fz="xl" mb="xl">
        دليل أعضاء هيئة التدريس
      </Text>

      <Grid gutter="xl">
        {/* العمود الأيمن: أدوات البحث والتصفية */}
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Stack gap="md">
              <Group>
                <Filter size={20} color="#339AF0" />
                <Text fw={600} fz="lg">
                  تصفية البحث
                </Text>
              </Group>

              <Divider />

              {/* البحث النصي */}
              <TextInput
                label="البحث السريع"
                placeholder="الاسم أو التخصص"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                leftSection={<Search size={16} />}
                clearable
              />

              {/* التصفية حسب القسم */}
              <Select
                label="القسم الأكاديمي"
                placeholder="اختر القسم"
                data={departments}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                clearable
              />

              {/* التصفية حسب الرتبة */}
              <Select
                label="الرتبة الأكاديمية"
                placeholder="اختر الرتبة"
                data={ranks}
                value={selectedRank}
                onChange={setSelectedRank}
                clearable
              />

              {/* زر إعادة تعيين */}
              <Button
                variant="light"
                color="gray"
                onClick={handleReset}
                mt="sm"
              >
                إعادة تعيين التصفية
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        {/* العمود الأيسر: عرض النتائج */}
        <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group justify="space-between" mb="lg">
              <Text fw={700} fz="lg" c="indigo">
                النتائج: ({filteredFaculty.length} عضو)
              </Text>
            </Group>

            <Divider mb="lg" />

            <Grid gutter="lg">
              {facultyCards.length > 0 ? (
                facultyCards
              ) : (
                <Grid.Col span={12}>
                  <Alert color="orange" title="لا توجد نتائج">
                    لم يتم العثور على أعضاء هيئة تدريس مطابقين لمعايير البحث
                    المحددة.
                  </Alert>
                </Grid.Col>
              )}
            </Grid>

            {/* Pagination - التقسيم إلى صفحات */}
            {totalPages > 1 && (
              <Flex justify="center" mt="xl">
                <Pagination
                  total={totalPages}
                  value={activePage}
                  onChange={setPage}
                  siblings={1}
                  boundaries={1}
                />
              </Flex>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default FacultyDirectory;
