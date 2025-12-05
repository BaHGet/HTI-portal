import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HtiLogo from "./../assets/1.jpg";
import MailIcon from "./../assets/Icons/mail.svg";
import LockClosedIcon from "./../assets/Icons/padlock.svg";
import EyeIcon from "./../assets/Icons/hide.svg";
import EyeOffIcon from "./../assets/Icons/show.svg";
import { sendOtp, verifyOtp, resetPassword } from "../Api/auth/authApi";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Alert,
  Group,
  Stack,
  Image,
  Divider,
  Flex,
} from "@mantine/core";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState("email_input"); // email_input | otp_sent | password_reset | reset_success
  const [sysMsg, setSysMsg] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [correctOtp, setCorrectOtp] = useState(false);
  const [counter, setCounter] = useState(0);
  const [numOfResend, setNumOfResend] = useState(1);

  const otpInputRefs = useRef([]);

  const iconStyle = {
    color: "#9ca3af",
    filter:
      "invert(62%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(89%)",
  };

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (step === "otp_sent" && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (index, value) => {
    const newDigit = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = newDigit;
    setOtpDigits(newOtpDigits);

    if (newDigit && index < otpDigits.length - 1) {
      otpInputRefs.current[index + 1]?.focus(); // هيتحول للفيلد اللي بعده تلقائي
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpDigits.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === otpDigits.length && /^\d+$/.test(pastedData)) {
      setOtpDigits(pastedData.split(""));
      otpInputRefs.current[otpDigits.length - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSysMsg({ msg: "", type: "" });
    setLoading(true);

    try {
      if (step === "email_input") {
        const res = await sendOtp(email);
        if (res.status === 200) {
          setSysMsg({
            msg: `تم إرسال رمز التحقق إلى البريد ${email}`,
            type: "info",
          });
          setStep("otp_sent");
        } else {
          setSysMsg({
            msg: "البريد الإلكتروني غير صحيح أو حدث خطأ",
            type: "error",
          });
        }
      } else if (step === "otp_sent") {
        const enteredOtp = otpDigits.join("");
        if (enteredOtp.length !== 6) {
          setSysMsg({ msg: "رمز التحقق يجب أن يكون 6 أرقام", type: "error" });
          setLoading(false);
          return;
        }
        const res = await verifyOtp(enteredOtp);
        if (res.status === 200) {
          setSysMsg({
            msg: "تم التحقق من الرمز، يمكنك تعيين كلمة المرور الجديدة",
            type: "success",
          });
          setCorrectOtp(true);
          setStep("password_reset");
        } else {
          setSysMsg({ msg: "رمز التحقق غير صحيح", type: "error" });
          setOtpDigits(["", "", "", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        }
      } else if (step === "password_reset") {
        if (newPassword !== confirmNewPassword) {
          setSysMsg({ msg: "كلمات المرور غير متطابقة", type: "error" });
          return;
        } else if (newPassword.length < 6) {
          setSysMsg({
            msg: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
            type: "error",
          });
          return;
        }
        const res = await resetPassword(newPassword);
        if (res.status === 200) {
          setSysMsg({
            msg: "تم إعادة تعيين كلمة المرور بنجاح",
            type: "success",
          });
          setStep("reset_success");
        } else {
          setSysMsg({ msg: "حدث خطأ، حاول مرة أخرى", type: "error" });
        }
      }
    } catch (err) {
      setSysMsg({ msg: "حدث خطأ في الخادم، حاول مرة أخرى", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setNumOfResend((prev) => prev + 1);
    setCounter(numOfResend * 30);
    await sendOtp(email);
    setSysMsg({ msg: `تم إعادة إرسال الرمز إلى ${email}`, type: "success" });
    setOtpDigits(["", "", "", "", "", ""]);
  };

  return (
    <Container size={480} my={50}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        style={{ direction: "rtl", textAlign: "right" }}
      >
        <Group justify="center" mb="md">
          <Image src={HtiLogo} w={150} h={150} fit="contain" />
        </Group>

        <Title order={2} ta="center" mb={5}>
          {step === "email_input"
            ? "نسيت كلمة المرور"
            : step === "otp_sent"
            ? "أدخل رمز التحقق"
            : "إعادة تعيين كلمة المرور"}
        </Title>
        <Text size="sm" c="dimmed" ta="center" mb="lg">
          {step === "email_input"
            ? "أدخل بريدك الإلكتروني المرتبط بحسابك لإرسال رمز التحقق"
            : step === "otp_sent"
            ? `تم إرسال رمز التحقق إلى ${email}`
            : "تم التحقق من الرمز، أدخل كلمة المرور الجديدة"}
        </Text>
        <Divider mb="lg" />

        {step !== "reset_success" && (
          <form dir="ltr" onSubmit={handleSubmit}>
            <Stack spacing="sm">
              {/* Email */}
              {step === "email_input" && (
                <TextInput
                  label="البريد الإلكتروني"
                  placeholder="student@hti.edu.eg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail size={18} />}
                />
              )}

              {/* OTP */}
              {step === "otp_sent" && (
                <Flex justify="center">
                  <Group spacing="xs" position="center">
                    {otpDigits.map((digit, index) => (
                      <TextInput
                        key={index}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.currentTarget.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        ref={(el) => (otpInputRefs.current[index] = el)} // Mantine تعطي الـ input الحقيقي
                        maxLength={1}
                        style={{ width: 40, textAlign: "center" }}
                        required
                      />
                    ))}
                  </Group>
                </Flex>
              )}

              {/* New Password */}
              {correctOtp && step === "password_reset" && (
                <>
                  <PasswordInput
                    placeholder="كلمة المرور الجديدة"
                    label="كلمة المرور الجديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    icon={<Lock size={18} />}
                    visible={showPassword}
                    onVisibilityChange={setShowPassword}
                  />
                  <PasswordInput
                    placeholder="تأكيد كلمة المرور الجديدة"
                    label="تأكيد كلمة المرور الجديدة"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    icon={<Lock size={18} />}
                    visible={showPassword}
                    onVisibilityChange={setShowPassword}
                  />
                </>
              )}

              {/* Alert */}
              {sysMsg.msg && (
                <Alert
                  dir="rtl"
                  icon={<AlertCircle size={16} />}
                  color={
                    sysMsg.type === "error"
                      ? "red"
                      : sysMsg.type === "success"
                      ? "green"
                      : "blue"
                  }
                >
                  {sysMsg.msg}
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" fullWidth loading={loading}>
                {step === "email_input"
                  ? "إرسال الرمز"
                  : step === "otp_sent"
                  ? "تأكيد الرمز"
                  : "إعادة تعيين كلمة المرور"}
              </Button>

              {/* Resend OTP or Back to Login */}
              {step === "otp_sent" ? (
                <Text dir="rtl" ta="center" size="sm">
                  لم تصلك رسالة؟{" "}
                  <Link
                    onClick={handleResendOTP}
                    style={{
                      pointerEvents: counter > 0 ? "none" : "auto",
                      color: counter > 0 ? "#9ca3af" : "#1c7ed6",
                    }}
                  >
                    {counter > 0 ? `${counter}s` : "إعادة إرسال الرمز"}
                  </Link>
                </Text>
              ) : (
                <Flex dir="rtl" align={"center"} justify={"center"}>
                  تذكرت كلمة المرور؟{" "}
                  <Link to="/login">
                    <span style={{ padding: "0 0.75rem", color: "#1c7ed6" }}>
                      تسجيل الدخول
                    </span>
                  </Link>
                </Flex>
              )}
            </Stack>
          </form>
        )}

        {/* Success Screen */}
        {step === "reset_success" && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Title order={3} mt="md">
              تم إعادة تعيين كلمة المرور!
            </Title>
            <Text mt="sm">
              يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
            </Text>
            <Button mt="md" fullWidth onClick={() => navigate("/login")}>
              تسجيل الدخول
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
}
