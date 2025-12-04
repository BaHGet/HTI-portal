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
} from "@mantine/core";
import { Search, Mail, Phone, ExternalLink, Filter } from "lucide-react";

// ** 1. البيانات الثابتة والوهمية **
// قوائم التصفية
const departments = [
  { value: "CS", label: "قسم علوم الحاسوب" },
  { value: "EE", label: "قسم الهندسة الكهربائية" },
  { value: "BUSS", label: "قسم إدارة الأعمال" },
  { value: "ARCH", label: "قسم العمارة" },
];

const ranks = [
  { value: "Professor", label: "أستاذ" },
  { value: "Associate", label: "أستاذ مشارك" },
  { value: "Assistant", label: "أستاذ مساعد" },
  { value: "Lecturer", label: "محاضر" },
];

// بيانات أعضاء هيئة التدريس الوهمية
const facultyData = [
  {
    id: 1,
    nameAr: "د. محمد سعيد الغامدي",
    nameEn: "Dr. Mohammed Alghamdi",
    rank: "Professor",
    department: "CS",
    specialization: "الذكاء الاصطناعي وتعلم الآلة",
    email: "m.alghamdi@uni.edu",
    phoneExt: "01023456789",
    officeHours: "الأحد والثلاثاء: 10:00 - 12:00",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-fbab4cba431a?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    nameAr: "أ.د. فاطمة علي الحسني",
    nameEn: "Prof. Fatimah Alhasani",
    rank: "Associate",
    department: "BUSS",
    specialization: "إدارة الموارد البشرية",
    email: "f.alhasani@uni.edu",
    phoneExt: "01023456789",
    officeHours: "الاثنين والأربعاء: 14:00 - 15:00",
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    nameAr: "د. خالد عبد العزيز",
    nameEn: "Dr. Khalid Abdulaziz",
    rank: "Assistant",
    department: "EE",
    specialization: "أنظمة الطاقة المتجددة",
    email: "k.abdulaziz@uni.edu",
    phoneExt: "01023456789",
    officeHours: "يومياً: 11:00 - 12:00",
    imageUrl:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    nameAr: "م. نورة فيصل القحطاني",
    nameEn: "Eng. Noura Alqahtani",
    rank: "Lecturer",
    department: "ARCH",
    specialization: "التصميم المستدام",
    email: "n.alqahtani@uni.edu",
    phoneExt: "01023456789",
    officeHours: "الثلاثاء والخميس: 09:00 - 10:00",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29329?auto=format&fit=crop&w=300&q=80",
  },
];

// ** 2. مكون بطاقة العضو **
const FacultyCard = ({ faculty }) => {
  // دالة لإنشاء حرفين اختصاراً للاسم (إذا لم تتوفر صورة)
  const getInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card shadow="sm" radius="md" padding="lg" withBorder>
      <Stack gap="md">
        <Group wrap="nowrap" align="flex-start" gap="md">
          {/* الصورة أو Avatar */}
          <Avatar
            src={faculty.imageUrl}
            alt={faculty.nameAr}
            size={rem(80)}
            radius="md"
            color="indigo"
          >
            {getInitials(faculty.nameAr)}
          </Avatar>

          {/* البيانات الأساسية */}
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

        {/* التفاصيل والتواصل */}
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

// ** 3. المكون الرئيسي للصفحة **
const FacultyDirectory = () => {
  // حالات التصفية
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);

  // دالة التصفية الرئيسية (استخدام useMemo لتحسين الأداء)
  const filteredFaculty = useMemo(() => {
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

  // عرض بطاقات النتائج
  const facultyCards = filteredFaculty.map((member) => (
    <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={member.id}>
      <FacultyCard faculty={member} />
    </Grid.Col>
  ));

  return (
    <div dir="rtl">
      <Text component="h1" fw={700} fz="xl" mb="xl">
        دليل أعضاء هيئة التدريس
      </Text>

      <Grid gutter="xl">
        {/* العمود الأيمن: أدوات البحث والتصفية */}
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder >
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
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment(null);
                  setSelectedRank(null);
                }}
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
              {/* يمكن إضافة زر للتبديل بين طريقة العرض (قائمة/بطاقات) هنا */}
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
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default FacultyDirectory;
