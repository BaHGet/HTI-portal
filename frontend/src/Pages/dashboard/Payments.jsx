import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Badge,
  TextInput,
  Textarea,
  Flex,
  Modal,
  Radio,
  FileButton,
  rem,
  Loader,
  Skeleton, // استخدمنا Skeleton لعرض حالة التحميل
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  User,
  DollarSign,
  Wallet,
  Landmark,
  FileUp,
  CreditCard,
  Send,
  Hourglass,
  CircleCheck,
  X,
  FileText,
  UploadCloud,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { getStudentPayment } from "../../api/Users/usersApi"; // استيراد دالة جلب بيانات الدفع من الـ API

// ** البيانات الثابتة (Stubs) تم إخفائها
const BANK_DETAILS = {
  bankDeposit: {
    accountName: "المعهد التكنولوجي العالي بالعاشر من رمضان",
    accountNumber: "1234567890",
    bankName: "البنك العربي الأفريقي",
  },
  instapay: {
    instapayID: "nileuni.pay",
    bankName: "InstaPay/البنوك المشتركة",
  },
};
const studentData = {
  id: "20230123",
  name: "محمد علي أحمد",
  id: "20210741",
  department: "علوم الحاسوب",
  initialPaymentStatus: "NotPaid",
};

// ** القيود
const MAX_FILE_SIZE_MB = 1;
const ALLOWED_MIMES = ["image/jpeg", "image/png", "application/pdf"];


// ** دالة لتحديد شكل حالة الدفع
const getStatusBadge = (status) => {
  switch (status) {
    case "Paid":
      return {
        text: "تم الدفع",
        color: "teal",
        icon: <CircleCheck size={16} />,
      };
    case "NotPaid":
      return { text: "لم يتم الدفع", color: "red", icon: <X size={16} /> };
    case "Reviewing":
      return {
        text: "قيد المراجعة",
        color: "yellow",
        icon: <Hourglass size={16} />,
      };
    default:
      return { text: "غير محدد", color: "gray" };
  }
};

const TuitionFeesPage = () => {
  const [termType, setTermType] = useState("full_year");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("NotPaid");
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [apiData, setApiData] = useState(null); // لتخزين بيانات الـ API بعد تحميلها

  const [
    uploadModalOpened,
    { open: openUploadModal, close: closeUploadModal },
  ] = useDisclosure(false);

  const fileInputRef = useRef(null);

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true); // عند بدء التحميل نحدد أن البيانات في حالة تحميل
        const response = await getStudentPayment("20230123"); // استدعاء الـ API
        setApiData(response.data); // تخزين البيانات عند تحميلها
        console.log("Fetched payment data:", response.data);
        setLoading(false); // عند الانتهاء من التحميل نقوم بتعيين الـ loading إلى false
      } catch (error) {
        setLoading(false);
        console.error("Error fetching payment data:", error);
      }
    };
    fetchPaymentData();
  }, []);

  // حساب المصروفات بناءً على اختيار المستخدم
  const currentFees = useMemo(() => {
    if (loading || !apiData) {
      return {
        breakdown: {
          basicFees: 0,
          additionalFees: 0,
          appealFees: 0,
          idCardFees: 0,
          retakeFees: 0,
        },
        status: {
          isFirstInstallmentDone: false,
          isFullPaid: false,
        },
        summary: {
          remainingTotal: 0,
          remainingFirstInstallment: 0,
        },
      }; // إرجاع قيم فارغة أثناء التحميل
    }
    return apiData; // إذا تم تحميل البيانات نستخدمها
  }, [apiData, loading]);

  const statusInfo = getStatusBadge(
    apiData
      ? (apiData.status.isFirstInstallmentDone || apiData.status.isFullPaid)?'Paid':'NotPaid'
      : paymentStatus
  );

  // ---------------------------------
  // معالجة اختيار الملف
  // ---------------------------------
  const handleFileChange = (file) => {
    setFileError(null);
    if (!file) {
      setReceiptFile(null);
      return;
    }

    // 1. التحقق من الحجم
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`الحد الأقصى لحجم الملف هو ${MAX_FILE_SIZE_MB} ميجا بايت.`);
      setReceiptFile(null);
      return;
    }

    // 2. التحقق من نوع الملف (MIME Type)
    if (!ALLOWED_MIMES.includes(file.type)) {
      setFileError("الصيغ المقبولة هي: JPG, PNG, PDF.");
      setReceiptFile(null);
      return;
    }

    setReceiptFile(file);
  };

  // ---------------------------------
  // محاكاة عملية الدفع (للتجربة)
  // ---------------------------------
  const handleSubmitPayment = () => {
    if (paymentMethod === "visa") {
      alert("جاري تحويلك لبوابة الدفع الآمنة...");
      setPaymentStatus("Paid");
    } else {
      if (!receiptFile) {
        alert("الرجاء إرفاق إيصال الدفع.");
        return;
      }
      if (fileError) {
        alert("يرجى إصلاح خطأ الملف المرفق قبل الإرسال.");
        return;
      }
      setPaymentStatus("Reviewing");
      openUploadModal();
    }
    // إعادة تعيين حالة النموذج
    setNotes("");
    setReceiptFile(null);
    setPaymentMethod("");
  };

  // ---------------------------------
  // مكون عرض تفاصيل المصروفات
  // ---------------------------------
  const FeeDetailsTable = ({ fees }) => (
    <Stack gap="xs" dir="rtl">
      <Group justify="space-between">
        <Text fw={500} c="dimmed">
          المصروفات الدراسية الأساسية:
        </Text>
        <Text fw={700} c="blue">
          {fees.breakdown.basicFees
            ? (termType == 'full_year'? fees.breakdown.basicFees.toLocaleString(): (fees.breakdown.basicFees /2 ).toLocaleString())
            : 0}{" "}
          ج.م
        </Text>
      </Group>
      <Group justify="space-between">
        <Text fw={500} c="dimmed">
          مصاريف إضافية (خدمات):
        </Text>
        <Text>
          {fees.breakdown.additionalFees
            ? fees.breakdown.additionalFees.toLocaleString()
            : 0}{" "}
          ج.م
        </Text>
      </Group>
      <Group justify="space-between">
        <Text fw={500} c="dimmed">
          مصاريف التماس:
        </Text>
        <Text>
          {fees.breakdown.appealFees
            ? fees.breakdown.appealFees.toLocaleString()
            : 0}{" "}
          ج.م
        </Text>
      </Group>
      <Group justify="space-between">
        <Text fw={500} c="dimmed">
          مصاريف كارنيه الطالب:
        </Text>
        <Text>
          {fees.breakdown.idCardFees
            ? fees.breakdown.idCardFees.toLocaleString()
            : 0}{" "}
          ج.م
        </Text>
      </Group>
      <Group justify="space-between">
        <Text fw={500} c="dimmed">
          مصاريف رسوب (إن وجدت):
        </Text>
        <Text>
          {fees.breakdown.retakeFees
            ? fees.breakdown.retakeFees.toLocaleString()
            : 0}{" "}
          ج.م
        </Text>
      </Group>
      <Divider my="sm" />
      <Group justify="space-between">
        <Text fw={700} fz="xl">
          المبلغ الإجمالي المطلوب:
        </Text>
        <Badge size="xl" color="teal" variant="filled">
          {fees.summary.remainingTotal
            ? (termType == 'full_year'? fees.summary.remainingTotal.toLocaleString(): fees.summary.remainingFirstInstallment.toLocaleString())
            : 0}{" "}
          ج.م
        </Badge>
      </Group>
    </Stack>
  );

  // ---------------------------------
  // مكون واجهة الدفع (مشروطة)
  // ---------------------------------
  const PaymentInterface = () => {
    const isTransfer =
      paymentMethod === "bank_deposit" || paymentMethod === "instapay";

    if (paymentMethod === "visa") {
      return (
        <Alert
          title="الدفع المباشر (فيزا/ماستركارد)"
          color="blue"
          icon={<CreditCard size={20} />}
          mt="md"
        >
          <Text size="sm">
            سيتم تحويلك إلى بوابة الدفع الآمنة فور الضغط على زر "دفع الآن"
            لإتمام العملية.
          </Text>
          <Flex justify="center">
            <Button
              rightSection={<Send size={16} />}
              color="blue"
              mt="md"
              onClick={handleSubmitPayment}
            >
              دفع الآن ({currentFees.totalRequired.toLocaleString()} ج.م)
            </Button>
          </Flex>
        </Alert>
      );
    }

    if (isTransfer) {
      const details =
        paymentMethod === "bank_deposit"
          ? BANK_DETAILS.bankDeposit
          : BANK_DETAILS.instapay;

      return (
        <Stack gap="md" mt="md" dir="rtl">
          <Alert
            title={
              paymentMethod === "bank_deposit"
                ? "تفاصيل الإيداع البنكي"
                : "تفاصيل حساب إنستا باي"
            }
            color="orange"
            icon={<Landmark size={20} />}
            variant="light"
          >
            <Stack gap="xs" mt="sm">
              <Group justify="space-between">
                <Text fw={500}>اسم الحساب:</Text>
                <Text>{details.accountName || details.instapayID}</Text>
              </Group>
              {"accountNumber" in details && (
                <Group justify="space-between">
                  <Text fw={500}>رقم الحساب:</Text>
                  <Text c="red">{details.accountNumber}</Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text fw={500}>اسم البنك/الخدمة:</Text>
                <Text>{details.bankName}</Text>
              </Group>
            </Stack>
          </Alert>

          <Divider label="إرفاق إيصال الدفع" labelPosition="right" />

          {/* حقل رفع الملفات الاحترافي */}
          <Group align="flex-end" wrap="nowrap" gap="sm">
            <div style={{ flexGrow: 1 }}>
              <Text fw={500} size="sm" mb={rem(4)}>
                إيصال الدفع (صورة أو PDF)
              </Text>
              <TextInput
                placeholder={`الحد الأقصى ${MAX_FILE_SIZE_MB}MB. الصيغ: JPG, PNG, PDF`}
                value={receiptFile ? receiptFile.name : ""}
                readOnly
                error={fileError}
                rightSection={
                  receiptFile && (
                    <XCircle
                      style={{
                        width: rem(18),
                        height: rem(18),
                        cursor: "pointer",
                      }}
                      color="red"
                      onClick={() => {
                        setReceiptFile(null);
                        setFileError(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = null; // إعادة تعيين الحقل
                      }}
                    />
                  )
                }
              />
            </div>

            {/* زر فتح نافذة الـ Browse */}
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
            >
              {fileError}
            </Alert>
          )}

          <Textarea
            label="ملاحظات إضافية (اختياري)"
            placeholder="أدخل أي ملاحظات حول عملية الإيداع."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button
            rightSection={<Send size={16} />}
            color="green"
            onClick={handleSubmitPayment}
            disabled={!receiptFile || !!fileError}
          >
            إرسال طلب الدفع للمراجعة
          </Button>
        </Stack>
      );
    }
    return (
      <Alert color="gray" mt="md">
        الرجاء اختيار طريقة دفع لعرض التفاصيل.
      </Alert>
    );
  };

  // ---------------------------------
  // التصميم العام للصفحة
  // ---------------------------------
  return (
    <div dir="rtl">
      <h1 className="title py-2">إدارة ودفع المصروفات الدراسية</h1>

      {/* Modal: تأكيد إرسال الإيصال */}
      <Modal
        opened={uploadModalOpened}
        onClose={closeUploadModal}
        title={
          <Group gap="xs">
            <CircleCheck size={20} color="teal" />
            <Text fw={700} fz="lg" c="teal">
              تم إرسال الطلب بنجاح
            </Text>
          </Group>
        }
        centered
        dir="rtl"
      >
        <Stack gap="md">
          <Text>
            تم إرسال إيصال الدفع الخاص بك بنجاح. الرجاء الأنتظار حتي يتم مراجعة الإيصال
          </Text>
          <Flex justify="flex-end">
            <Button onClick={closeUploadModal}>حسناً</Button>
          </Flex>
        </Stack>
      </Modal>

      <Grid gutter="xl">
        {/* العمود الأيمن: بيانات الطالب وحالة الدفع */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <User size={22} color="#4C6EF5" />
              <Text fw={700} fz="lg" c="dimmed">
                بيانات الطالب وحالة الدفع
              </Text>
            </Group>
            <Divider mb="lg" />

            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={500} c="dimmed">
                  اسم الطالب:
                </Text>
                <Text>{studentData.name}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500} c="dimmed">
                  الرقم الأكاديمي:
                </Text>
                <Text>{studentData.id}</Text>
              </Group>
              <Divider my="sm" />
              <Group justify="space-between">
                <Text fw={700}>حالة المصروفات:</Text>
                <Badge
                  size="lg"
                  color={statusInfo.color}
                  rightSection={statusInfo.icon}
                >
                  {statusInfo.text}
                </Badge>
              </Group>
              {paymentStatus === "Reviewing" && (
                <Alert color="yellow" title="تحت المراجعة" mt="md">
                  نحن نقوم بمراجعة إيصال الدفع الخاص بك. قد تستغرق هذه العملية
                  24-48 ساعة.
                </Alert>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        {/* العمود الأيسر: خيارات الدفع وحساب المصروفات */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Group mb="md">
              <DollarSign size={22} color="#F03E3E" />
              <Text fw={700} fz="lg" c="dimmed">
                اختيار الفترة ونوع الدفع
              </Text>
            </Group>
            <Divider mb="lg" />

            <Grid gutter="md">
              {/* 1. اختيار فترة الدفع */}
              <Grid.Col span={12}>
                <Select
                  label="الفترة الدراسية المراد دفع مصروفاتها"
                  placeholder="اختر الفترة"
                  data={[
                    {
                      value: "full_year",
                      label: "مصاريف السنة الدراسية كاملة",
                    },
                    { value: "semester", label: "مصاريف فصل دراسي واحد" },
                  ]}
                  value={termType}
                  onChange={setTermType}
                  leftSection={<FileText size={16} />}
                  allowDeselect={false}
                />
              </Grid.Col>
            </Grid>

            <Divider label="تفاصيل المصروفات المطلوبة" my="xl" />

            {/* إضافة Skeleton أثناء تحميل البيانات */}
            {loading ? (
              <Skeleton height={200} />
            ) : (
              <FeeDetailsTable fees={currentFees} />
            )}

            <Divider label="طرق الدفع المتاحة" my="xl" />

            {/* 2. اختيار طريقة الدفع (Radio Group) */}
            <Radio.Group
              value={paymentMethod}
              onChange={setPaymentMethod}
              name="paymentMethod"
              label="الرجاء اختيار طريقة الدفع المناسبة:"
            >
              <Group mt="xs" gap="xl">
                <Radio
                  value="bank_deposit"
                  label={
                    <Group gap="xs">
                      <Landmark size={16} /> إيداع أو تحويل بنكي
                    </Group>
                  }
                />
                <Radio
                  value="instapay"
                  label={
                    <Group gap="xs">
                      <Wallet size={16} /> إنستا باي (InstaPay)
                    </Group>
                  }
                />
                <Radio
                  value="visa"
                  label={
                    <Group gap="xs">
                      <CreditCard size={16} /> دفع مباشر (فيزا/ماستركارد)
                    </Group>
                  }
                />
              </Group>
            </Radio.Group>

            <Divider label="واجهة الدفع" my="xl" />

            <PaymentInterface />
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default TuitionFeesPage;
