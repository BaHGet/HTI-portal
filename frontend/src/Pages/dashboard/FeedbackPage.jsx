import React, { useState, useRef } from "react";
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
  Checkbox,
  FileButton,
  rem,
  Badge,
  Table,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Megaphone,
  MessageSquare,
  Send,
  UploadCloud,
  XCircle,
  AlertCircle,
  Hash,
  Mail,
  User,
  CheckCircle,
  Clock,
  ArrowLeft,
  Eye,
  Scroll,
} from "lucide-react";

// ** البيانات والقوائم الثابتة
const requestCategories = [
  { value: "complaint", label: "شكوى (تتطلب إجراء)" },
  { value: "suggestion", label: "اقتراح (تطوير)" },
  { value: "inquiry", label: "استفسار" },
  { value: "report", label: "بلاغ (مخالفة/مشكلة أمنية)" },
];

const targetDepartments = [
  { value: "academic", label: "الشؤون الأكاديمية" },
  { value: "finance", label: "الشؤون المالية" },
  { value: "registration", label: "التسجيل والقبول" },
  { value: "services", label: "الخدمات الجامعية والمرافق" },
  { value: "it", label: "تقنية المعلومات والدعم الفني" },
  { value: "dean", label: "العمادة والإدارة العليا" },
];

// ** بيانات وهمية للطلبات السابقة
const previousRequests = [
  {
    id: "TKT-10045",
    date: "2024-11-25",
    subject: "مشكلة في تسجيل مادة CS301",
    status: "Closed", // Closed, InProgress, Submitted
    category: "complaint",
    response: {
      date: "2024-11-28",
      text: "تمت مراجعة المشكلة وتصحيح تسجيل المادة في نظام البانر. يمكنك الآن التحقق من جدولك. شكراً لإبلاغك.",
      department: "التسجيل",
    },
  },
  {
    id: "TKT-10046",
    date: "2024-11-26",
    subject: "مقترح لتطوير المكتبة الإلكترونية",
    status: "InProgress",
    category: "suggestion",
    response: null,
  },
  {
    id: "TKT-10047",
    date: "2024-12-01",
    subject: "استفسار حول موعد تسليم الأبحاث",
    status: "Submitted",
    category: "inquiry",
    response: null,
  },
];

// ** دالة مساعدة لتحديد شكل حالة الطلب
const getStatusBadgeProps = (status) => {
  switch (status) {
    case "Closed":
      return {
        color: "teal",
        text: "تم الرد",
        icon: <CheckCircle size={12} />,
      };
    case "InProgress":
      return { color: "blue", text: "قيد المعالجة", icon: <Clock size={12} /> };
    case "Submitted":
      return { color: "orange", text: "تم الإرسال", icon: <Clock size={12} /> };
    default:
      return { color: "gray", text: "غير محدد" };
  }
};

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIMES = ["image/jpeg", "image/png", "application/pdf"];

const FeedbackPage = () => {
  // حالة النموذج
  const [category, setCategory] = useState(null);
  const [department, setDepartment] = useState(null);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contactName, setContactName] = useState("محمد علي أحمد");
  const [contactEmail, setContactEmail] = useState("mohammed.ali@uni.edu");

  // حالة الملفات
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  // حالة المودال والردود
  const [
    successModalOpened,
    { open: openSuccessModal, close: closeSuccessModal },
  ] = useDisclosure(false);
  const [
    responseModalOpened,
    { open: openResponseModal, close: closeResponseModal },
  ] = useDisclosure(false); // مودال عرض الرد
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);

  // ---------------------------------
  // معالجة اختيار الملفات (كما كانت سابقاً)
  // ---------------------------------
  const handleFileChange = (file) => {
    setFileError(null);
    if (!file) {
      setAttachmentFile(null);
      return;
    }
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(`الحد الأقصى لحجم الملف هو ${MAX_FILE_SIZE_MB} ميجا بايت.`);
      setAttachmentFile(null);
      return;
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      setFileError("الصيغ المقبولة هي: JPG, PNG, PDF.");
      setAttachmentFile(null);
      return;
    }
    setAttachmentFile(file);
  };

  // ---------------------------------
  // إرسال النموذج (محاكاة)
  // ---------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !department || !subject || !details || fileError) {
      alert("الرجاء التحقق من المدخلات المطلوبة والمرفقات.");
      return;
    }

    // محاكاة الإرسال
    const newTicketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketNumber(newTicketNumber);

    // إضافة الطلب الجديد (للعرض الفوري في الجدول) - اختياري
    previousRequests.unshift({
      id: newTicketNumber,
      date: new Date().toISOString().slice(0, 10),
      subject: subject,
      status: "Submitted",
      category: category,
      response: null,
    });

    // إعادة تعيين النموذج (اختياري)
    setCategory(null);
    setDepartment(null);
    setSubject("");
    setDetails("");
    setAttachmentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;

    openSuccessModal();
  };

  // ---------------------------------
  // عرض الرد في مودال
  // ---------------------------------
  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    openResponseModal();
  };

  // ---------------------------------
  // جدول عرض الطلبات السابقة
  // ---------------------------------
  const rows = previousRequests.map((item) => {
    const statusProps = getStatusBadgeProps(item.status);
    const hasResponse = item.response !== null;

    // إيجاد التصنيف المقابل (لجعل الجدول احترافياً)
    const categoryLabel =
      requestCategories.find((c) => c.value === item.category)?.label ||
      item.category;

    return (
      <Table.Tr key={item.id}>
        <Table.Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <Text fw={700} fz="xs">
            {item.id}
          </Text>
        </Table.Td>
        <Table.Td fz="sm" style={{ whiteSpace: "nowrap" }}>
          {item.date}
        </Table.Td>
        <Table.Td fz="sm" style={{ whiteSpace: "nowrap" }}>
          {categoryLabel}
        </Table.Td>
        <Table.Td
          fz="sm"
          style={{
            maxWidth: rem(150),
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.subject}
        </Table.Td>

        {/* العمود المدمج للحالة/الرد */}
        <Table.Td
          style={{ textAlign: "center", whiteSpace: "nowrap", width: rem(100) }}
        >
          {hasResponse ? (
            <Button
              size="xs"
              variant="light"
              color="teal"
              leftSection={<Eye size={16} />}
              onClick={() => handleViewResponse(item.response)}
            >
              عرض الرد
            </Button>
          ) : (
            <Badge
              color={statusProps.color}
              size="sm"
              variant="light"
              leftSection={statusProps.icon}
            >
              {statusProps.text}
            </Badge>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div dir="rtl">
      <h1 className="title py-2">الاقتراحات والشكاوى</h1>

      {/* 1. Modal: تأكيد الإرسال برقم متابعة */}
      <Modal
        opened={successModalOpened}
        onClose={closeSuccessModal}
        title={
          <Group gap="xs">
            <CheckCircle size={20} color="teal" />
            <Text fw={700} fz="lg" c="teal">
              تم إرسال طلبك بنجاح
            </Text>
          </Group>
        }
        centered
        dir="rtl"
      >
        <Stack gap="md">
          <Text>تم استلام طلبك بنجاح. سيتم مراجعته من قبل القسم المختص.</Text>
          <Alert color="blue" title="رقم المتابعة">
            الرجاء الاحتفاظ بهذا الرقم لمتابعة حالة طلبك:{" "}
            <Text fw={700} fz="lg" display="inline">
              {ticketNumber}
            </Text>
          </Alert>
          <Flex justify="flex-end">
            <Button onClick={closeSuccessModal}>حسناً</Button>
          </Flex>
        </Stack>
      </Modal>

      {/* 2. Modal: عرض الرد الكامل */}
      <Modal
        opened={responseModalOpened}
        onClose={closeResponseModal}
        title={
          <Group gap="xs">
            <ArrowLeft size={20} color="blue" />
            <Text fw={700} fz="lg" c="blue">
              الرد على طلبك
            </Text>
          </Group>
        }
        centered
        dir="rtl"
      >
        {selectedResponse && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={700}>الرد من:</Text>
              <Badge color="cyan">{selectedResponse.department}</Badge>
            </Group>
            <Group justify="space-between">
              <Text fw={700}>تاريخ الرد:</Text>
              <Text>{selectedResponse.date}</Text>
            </Group>
            <Divider />
            <Text>{selectedResponse.text}</Text>
          </Stack>
        )}
        <Flex justify="flex-end" mt="md">
          <Button onClick={closeResponseModal}>إغلاق</Button>
        </Flex>
      </Modal>

      <Grid gutter="xl">
        {/* العمود الأيمن (الجدول والإرشادات) - Col 5 */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="xl">
            {/* بطاقة الإرشادات (في الأعلى حسب الطلب) */}
            <Card shadow="sm" radius="md" padding="lg" withBorder>
              <Group mb="md">
                <Megaphone size={22} color="#15AABF" />
                <Text fw={700} fz="lg" c="dimmed">
                  إرشادات هامة
                </Text>
              </Group>
              <Divider mb="lg" />
              <Stack gap="xs" fz="sm">
                <Text>
                  <Flex align={"center"} gap={4}>
                    <Hash
                      size={16}
                      style={{ verticalAlign: "middle" }}
                      color="#15AABF"
                    />
                    يرجى اختيار القسم والتصنيف بدقة لضمان سرعة المعالجة.
                  </Flex>
                </Text>
                <Text>
                  <Flex align={"center"} gap={4}>
                    <Hash
                      size={16}
                      style={{ verticalAlign: "middle" }}
                      color="#15AABF"
                    />
                    يتم الرد على الشكاوى خلال **5 أيام عمل** كحد أقصى.
                  </Flex>
                </Text>
                <Text>
                  <Flex align={"center"} gap={4}>
                    <Hash
                      size={16}
                      style={{ verticalAlign: "middle" }}
                      color="#15AABF"
                    />
                    يمكنك الإرسال مجهولاً، ولكن لن يتم التواصل معك للمتابعة.
                  </Flex>
                </Text>
              </Stack>
            </Card>

            {/* بطاقة جدول الطلبات */}
            <Card shadow="sm" radius="md" padding="lg" withBorder>
              <Group mb="md">
                <MessageSquare size={22} color="#FAB005" />
                <Text fw={700} fz="lg" c="dimmed">
                  جدول الطلبات المقدمة
                </Text>
              </Group>
              <Divider mb="lg" />

              <ScrollArea h={rem(300)}>
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
                      <Table.Th style={{ width: "20%" }}>التصنيف</Table.Th>
                      <Table.Th style={{ width: "30%" }}>الموضوع</Table.Th>
                      {/* تم دمج عمود الحالة والرد في عمود واحد */}
                      <Table.Th style={{ width: "20%", textAlign: "center" }}>
                        الحالة/الرد
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Stack>
        </Grid.Col>

        {/* العمود الأيسر: نموذج الإرسال (Col 7) */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <MessageSquare size={22} color="#F03E3E" />
              <Text fw={700} fz="lg" c="dimmed">
                نموذج إرسال طلب جديد
              </Text>
            </Group>
            <Divider mb="lg" />

            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                <Grid gutter="md">
                  {/* تصنيف الطلب */}
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="تصنيف الطلب (مطلوب)"
                      placeholder="اختر نوع الطلب"
                      data={requestCategories}
                      value={category}
                      onChange={setCategory}
                      required
                    />
                  </Grid.Col>
                  {/* القسم المستهدف */}
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="القسم المستهدف (مطلوب)"
                      placeholder="اختر القسم المعني"
                      data={targetDepartments}
                      value={department}
                      onChange={setDepartment}
                      required
                    />
                  </Grid.Col>
                </Grid>

                {/* الموضوع الرئيسي */}
                <TextInput
                  label="الموضوع الرئيسي (مطلوب)"
                  placeholder="وصف مختصر للشكوى/الاقتراح"
                  value={subject}
                  onChange={(e) => setSubject(e.currentTarget.value)}
                  required
                />

                {/* نص الرسالة التفصيلي */}
                <Textarea
                  label="نص الرسالة والتفاصيل (مطلوب)"
                  placeholder="الرجاء تقديم كافة التفاصيل الممكنة للمساعدة في حل المشكلة."
                  minRows={5}
                  value={details}
                  onChange={(e) => setDetails(e.currentTarget.value)}
                  required
                />

                <Divider label="المرفقات وبيانات التواصل" my="sm" />

                <Grid gutter="md">
                  {/* رفع المرفقات */}
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Group align="flex-end" wrap="nowrap" gap="sm">
                      <div style={{ flexGrow: 1 }}>
                        <Text fw={500} size="sm" mb={rem(4)}>
                          المرفقات (صورة أو PDF)
                        </Text>

                        <TextInput
                          placeholder={`الحد الأقصى ${MAX_FILE_SIZE_MB}MB. الصيغ: JPG, PNG, PDF`}
                          value={attachmentFile ? attachmentFile.name : ""}
                          readOnly
                          error={fileError}
                          rightSection={
                            attachmentFile && (
                              <XCircle
                                style={{
                                  width: rem(18),
                                  height: rem(18),
                                  cursor: "pointer",
                                }}
                                color="red"
                                onClick={() => {
                                  setAttachmentFile(null);
                                  setFileError(null);
                                  if (fileInputRef.current)
                                    fileInputRef.current.value = null;
                                }}
                              />
                            )
                          }
                        />
                      </div>

                      <FileButton
                        onChange={handleFileChange}
                        accept={ALLOWED_MIMES.join(",")}
                        ref={fileInputRef}
                      >
                        {(props) => (
                          <Button
                            {...props}
                            leftSection={<UploadCloud size={16} />}
                            color="dark"
                            size="md"
                          >
                            رفع ملف
                          </Button>
                        )}
                      </FileButton>
                    </Group>
                    {fileError && (
                      <Alert
                        icon={<AlertCircle size={16} />}
                        color="red"
                        title="خطأ في الملف"
                        mt="xs"
                      >
                        {fileError}
                      </Alert>
                    )}
                  </Grid.Col>

                  {/* خيار الإرسال المجهول */}
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Checkbox
                      label="إرسال الطلب مجهول الهوية"
                      checked={isAnonymous}
                      onChange={(event) =>
                        setIsAnonymous(event.currentTarget.checked)
                      }
                      mt={rem(25)}
                    />
                  </Grid.Col>
                </Grid>

                {/* بيانات التواصل */}
                {!isAnonymous && (
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="الاسم الكامل"
                        placeholder="الاسم لغرض المتابعة"
                        value={contactName}
                        onChange={(e) => setContactName(e.currentTarget.value)}
                        required={!isAnonymous}
                        leftSection={<User size={16} />}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="البريد الإلكتروني"
                        placeholder="البريد للتواصل"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.currentTarget.value)}
                        required={!isAnonymous}
                        leftSection={<Mail size={16} />}
                        type="email"
                      />
                    </Grid.Col>
                  </Grid>
                )}

                {/* زر الإرسال */}
                <Group justify="flex-end" mt="md">
                  <Button
                    type="submit"
                    rightSection={<Send size={16} />}
                    color="green"
                    disabled={
                      !category ||
                      !department ||
                      !subject ||
                      !details ||
                      !!fileError ||
                      (!isAnonymous && (!contactName || !contactEmail))
                    }
                  >
                    إرسال الطلب
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default FeedbackPage;
