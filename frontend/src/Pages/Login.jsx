import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HtiLogo from "./../assets/1.jpg";
import MailIcon from "./../assets/Icons/mail.svg";
import LockClosedIcon from "./../assets/Icons/padlock.svg";
import EyeIcon from "./../assets/Icons/hide.svg";
import EyeOffIcon from "./../assets/Icons/show.svg";
import "./../index.css";
import { login } from "../Api/auth/authApi";

import {
  Container,
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Alert,
  Stack,
  Image,
  Group,
  Divider,
  PasswordInput,
} from "@mantine/core";

import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);

      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      navigate("/");
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container h={'100%'} w={'100%'} size={420} my={80}>
      <Paper
        shadow="lg"
        radius="md"
        p="xl"
        withBorder
        style={{ direction: "rtl", textAlign: "right" }}
      >
        {/* اللوجو */}
        <Group justify="center" mb="md">
          <Image src={HtiLogo} w={150} h={150} fit="contain" />
        </Group>

        <Title order={2} ta="center" mb={5}>
          تسجيل الدخول
        </Title>

        <Text size="sm" c="dimmed" ta="center" mb="lg">
          قم بتسجيل الدخول باستخدام البريد الإلكتروني الجامعي
        </Text>

        <Divider mb="lg" />

        <form dir="ltr" onSubmit={handleSubmit}>
          <Stack>
            {/* Email */}
            <TextInput
              lang="en"
              dir="ltr"
              label="البريد الإلكتروني"
              placeholder="student@hti.edu.eg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              rightSection={<Mail size={18} />}
              required
              styles={{ input: { direction: "ltr", textAlign: "left" } }}
            />
            <TextInput
              dir="ltr"
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              leftSection={<Lock size={18} />}
              rightSection={
                <img
                  src={showPassword ? EyeOffIcon : EyeIcon}
                  alt="eye"
                  style={{ width: 20, cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
              required
            />

            {/* Error Alert */}
            {error && (
              <Alert icon={<AlertCircle size={16} />} color="red" radius="md">
                {error}
              </Alert>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              leftSection={<LogIn size={18} />}
              size="md"
            >
              تسجيل الدخول
            </Button>

            {/* Forgot Password */}
            <Text size="sm" ta="center" mt="sm">
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: "var(--mantine-color-blue-6)",
                  fontWeight: 500,
                }}
              >
                نسيت كلمة المرور؟
              </Link>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
