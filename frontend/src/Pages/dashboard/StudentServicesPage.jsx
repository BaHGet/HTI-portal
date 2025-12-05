import React, { useState } from "react";
import {
  Grid,
  Card,
  Text,
  Button,
  Divider,
  Stack,
  Group,
  Select,
  Alert,
  TextInput,
  Textarea,
  Flex,
  Modal,
  FileButton,
  Badge,
  Table,
  ScrollArea,
  rem,
} from "@mantine/core";
import {
  ClipboardList,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Upload,
} from "lucide-react";

// ** 1. البيانات الثابتة وأنواع الطلبات
const requestTypes = [
  { value: "certificate", label: "طلب شهادة تعريف طالب/انتظام" },
  { value: "transcript", label: "طلب كشف درجات رسمي (Transcript)" },
  { value: "withdrawal", label: "طلب تأجيل/انسحاب من فصل دراسي" },
  { value: "transfer", label: "طلب تحويل داخلي/خارجي" },
  { value: "id_replacement", label: "طلب بدل فاقد للبطاقة الجامعية" },
];

// دالة مساعدة لتحديد شكل حالة الطلب في الجدول
const getStatusBadgeProps = (status) => {
  switch (status) {
    case "Ready":
      return {
        color: "teal",
        text: "جاهز للاستلام",
        icon: <Download size={12} />,
      };
    case "InProgress":
      return { color: "blue", text: "قيد المراجعة", icon: <Clock size={12} /> };
    case "Rejected":
      return { color: "red", text: "مرفوض", icon: <XCircle size={12} /> };
    case "Submitted":
      return {
        color: "orange",
        text: "تم الإرسال",
        icon: <CheckCircle size={12} />,
      };
    default:
      return { color: "gray", text: "غير محدد" };
  }
};

// ** 2. بيانات وهمية لطلبات الطالب السابقة
const previousRequests = [
  {
    id: "SRV-2024001",
    date: "2024-11-01",
    type: "certificate",
    subject: "شهادة انتظام موجهة لوزارة التعليم",
    status: "Ready",
    details: "الجهة: وزارة التعليم، اللغة: عربي",
  },
  {
    id: "SRV-2024002",
    date: "2024-11-05",
    type: "withdrawal",
    subject: "تأجيل الفصل الحالي (المرض)",
    status: "InProgress",
    details: "تم إرسال التقرير الطبي، بانتظار موافقة العميد.",
  },
  {
    id: "SRV-2024003",
    date: "2024-11-10",
    type: "transcript",
    subject: "طلب كشف درجات للتقديم لوظيفة",
    status: "Rejected",
    details: "السبب: وجود رسوم غير مسددة. يرجى مراجعة الشؤون المالية.",
  },
];

// ** 3. المكون الرئيسي للصفحة
const StudentServicesPage = () => {
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [formData, setFormData] = useState({});

  // ---------------------------------
  // رندرة الحقول الديناميكية بناءً على نوع الطلب
  // ---------------------------------
  const renderDynamicFields = (type) => {
    const updateField = (key, value) =>
      setFormData((prev) => ({ ...prev, [key]: value }));

    // إعادة تعيين البيانات عند تغيير نوع الطلب
    if (selectedRequestType !== type) {
      setSelectedRequestType(type);
      setFormData({});
      return null; // عدم عرض الحقول حتى يتم اختيار نوع طلب جديد
    }

    switch (type) {
      case "certificate":
        return (
          <Stack gap="md">
            <Text fw={700} fz="sm">
              متطلبات طلب شهادة التعريف/الانتظام:
            </Text>
            <TextInput
              label="الجهة الموجهة إليها الشهادة (مطلوب)"
              placeholder="مثال: وزارة التعليم، سفارة، جهة عمل..."
              required
              value={formData.targetEntity || ""}
              onChange={(e) =>
                updateField("targetEntity", e.currentTarget.value)
              }
            />
            <Select
              label="لغة الشهادة"
              data={[
                { value: "ar", label: "العربية" },
                { value: "en", label: "الإنجليزية" },
              ]}
              placeholder="اختر اللغة"
              required
              value={formData.language || ""}
              onChange={(val) => updateField("language", val)}
            />
          </Stack>
        );
      case "transcript":
        return (
          <Stack gap="md">
            <Text fw={700} fz="sm">
              متطلبات طلب كشف الدرجات:
            </Text>
            <TextInput
              label="الغرض من الطلب (مطلوب)"
              placeholder="مثال: التقديم لدراسات عليا، وظيفة..."
              required
              value={formData.purpose || ""}
              onChange={(e) => updateField("purpose", e.currentTarget.value)}
            />
            <TextInput
              label="عدد النسخ المطلوبة"
              placeholder="العدد"
              type="number"
              min={1}
              value={formData.copies || 1}
              onChange={(e) => updateField("copies", e.currentTarget.value)}
            />
          </Stack>
        );
      case "withdrawal":
        return (
          <Stack gap="md">
            <Text fw={700} fz="sm">
              متطلبات طلب التأجيل/الانسحاب:
            </Text>
            <TextInput
              label="الفصل الدراسي المستهدف (مطلوب)"
              placeholder="مثال: الفصل الدراسي الأول 2025"
              required
              value={formData.semester || ""}
              onChange={(e) => updateField("semester", e.currentTarget.value)}
            />
            <Textarea
              label="سبب التأجيل/الانسحاب بالتفصيل (مطلوب)"
              placeholder="اشرح الأسباب التي دفعتك لتقديم الطلب."
              required
              minRows={3}
              value={formData.reason || ""}
              onChange={(e) => updateField("reason", e.currentTarget.value)}
            />
            <FileButton
              onChange={(file) => updateField("attachment", file)}
              accept="application/pdf,image/*"
            >
              {(props) => (
                <Button
                  {...props}
                  variant="outline"
                  leftSection={<Upload size={16} />}
                >
                  {formData.attachment
                    ? `تم إرفاق: ${formData.attachment.name}`
                    : "إرفاق وثيقة داعمة (اختياري)"}
                </Button>
              )}
            </FileButton>
          </Stack>
        );
      case "transfer":
        return (
          <Stack gap="md">
            <Text fw={700} fz="sm">
              متطلبات طلب التحويل:
            </Text>
            <TextInput
              label="القسم/الكلية المطلوب التحويل إليها"
              placeholder="القسم المطلوب"
              required
              value={formData.newTarget || ""}
              onChange={(e) => updateField("newTarget", e.currentTarget.value)}
            />
            <Textarea
              label="سبب طلب التحويل (مطلوب)"
              placeholder="اشرح دوافعك للتحويل."
              required
              minRows={3}
              value={formData.reason || ""}
              onChange={(e) => updateField("reason", e.currentTarget.value)}
            />
          </Stack>
        );
      case "id_replacement":
        return (
          <Stack gap="md">
            <Text fw={700} fz="sm">
              متطلبات طلب بدل فاقد للبطاقة:
            </Text>
            <Textarea
              label="سبب فقدان البطاقة أو تلفها (مطلوب)"
              placeholder="اشرح الظروف التي أدت إلى الحاجة لبدل فاقد."
              required
              minRows={2}
              value={formData.details || ""}
              onChange={(e) => updateField("details", e.currentTarget.value)}
            />
            <Alert color="red" icon={<AlertCircle size={16} />}>
              قد تترتب رسوم على طلب بدل فاقد.
            </Alert>
          </Stack>
        );
      default:
        return null;
    }
  };

  // ---------------------------------
  // معالجة الإرسال
  // ---------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRequestType || Object.keys(formData).length === 0) {
      setSubmissionMessage({
        color: "red",
        text: "الرجاء اختيار نوع الطلب وتعبئة جميع الحقول المطلوبة.",
      });
      return;
    }

    const newId = `SRV-${Math.floor(2024000 + Math.random() * 900)}`;
    const selectedLabel = requestTypes.find(
      (t) => t.value === selectedRequestType
    )?.label;

    // محاكاة إضافة الطلب الجديد إلى القائمة
    previousRequests.unshift({
      id: newId,
      date: new Date().toISOString().slice(0, 10),
      type: selectedRequestType,
      subject: `${selectedLabel} - ${
        formData.targetEntity || formData.purpose || formData.semester || "جديد"
      }`,
      status: "Submitted",
      details: JSON.stringify(formData), // حفظ بيانات النموذج للعرض في التفاصيل
    });

    setSubmissionMessage({
      color: "teal",
      text: `تم إرسال طلبك (${newId}) بنجاح. سيتم مراجعته خلال 7 أيام عمل.`,
    });

    // إعادة تعيين النموذج
    setSelectedRequestType(null);
    setFormData({});
  };

  // ---------------------------------
  // جدول عرض الطلبات السابقة
  // ---------------------------------
  const rows = previousRequests.map((item) => {
    const statusProps = getStatusBadgeProps(item.status);
    const requestLabel =
      requestTypes.find((t) => t.value === item.type)?.label || item.type;

    return (
      <Table.Tr key={item.id}>
        <Table.Td style={{ textAlign: "center" }}>
          <Text fw={700} fz="xs">
            {item.id}
          </Text>
        </Table.Td>
        <Table.Td>{item.date}</Table.Td>
        <Table.Td>{requestLabel}</Table.Td>
        <Table.Td>{item.subject}</Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          <Badge
            color={statusProps.color}
            size="md"
            leftSection={statusProps.icon}
          >
            {statusProps.text}
          </Badge>
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          {item.status !== "Ready" && (
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              leftSection={<Eye size={16} />}
            >
              التفاصيل
            </Button>
          )}
          {item.status === "Ready" && (
            <Button
              size="xs"
              variant="filled"
              color="teal"
              leftSection={<Download size={16} />}
            >
              استلام
            </Button>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div dir="rtl">
      <h1 className="title py-2">بوابة خدمات شؤون الطلاب الإلكترونية</h1>

      <Grid gutter="xl">
        {/* العمود الأيمن: نموذج تقديم الطلب */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <ClipboardList size={22} color="#F03E3E" />
              <Text fw={700} fz="lg" c="dimmed">
                تقديم طلب جديد
              </Text>
            </Group>
            <Divider mb="lg" />

            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                {/* اختيار نوع الطلب */}
                <Select
                  label="اختر نوع الطلب المطلوب (مطلوب)"
                  placeholder="انقر للاختيار"
                  data={requestTypes}
                  value={selectedRequestType}
                  onChange={setSelectedRequestType}
                  required
                />

                {/* عرض الحقول الديناميكية */}
                {selectedRequestType && (
                  <Card withBorder p="md" radius="md">
                    {renderDynamicFields(selectedRequestType)}
                  </Card>
                )}

                {submissionMessage && (
                  <Alert
                    color={submissionMessage.color}
                    title={
                      submissionMessage.color === "teal" ? "نجاح" : "تنبيه"
                    }
                    icon={
                      submissionMessage.color === "teal" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )
                    }
                    mt="md"
                  >
                    {submissionMessage.text}
                  </Alert>
                )}

                {/* زر الإرسال */}
                <Group justify="flex-end" mt="md">
                  <Button
                    type="submit"
                    rightSection={<Send size={16} />}
                    color="green"
                    disabled={
                      !selectedRequestType || Object.keys(formData).length === 0
                    }
                  >
                    إرسال الطلب
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Grid.Col>

        {/* العمود الأيسر: جدول تتبع الطلبات */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <Clock size={22} color="#FAB005" />
              <Text fw={700} fz="lg" c="dimmed">
                تتبع الطلبات السابقة
              </Text>
            </Group>
            <Divider mb="lg" />

            <Alert
              color="blue"
              title="مدة المعالجة المتوقعة"
              icon={<AlertCircle size={16} />}
            >
              تستغرق معظم الطلبات ما بين 5 إلى 10 أيام عمل للمعالجة والموافقة.
            </Alert>

            <ScrollArea mt="lg">
              <Table
                withTableBorder
                withColumnBorders
                highlightOnHover
                verticalSpacing="sm"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: "15%", textAlign: "center" }}>
                      # الرقم
                    </Table.Th>
                    <Table.Th style={{ width: "15%" }}>التاريخ</Table.Th>
                    <Table.Th style={{ width: "20%" }}>النوع</Table.Th>
                    <Table.Th style={{ width: "25%" }}>الموضوع</Table.Th>
                    <Table.Th style={{ width: "15%", textAlign: "center" }}>
                      الحالة
                    </Table.Th>
                    <Table.Th style={{ width: "10%", textAlign: "center" }}>
                      الإجراء
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

export default StudentServicesPage;
