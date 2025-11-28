import { createTheme } from "@mantine/core";

export const theme = createTheme({
  // تحديد خط Cairo كخط أساسي للجسم (Body)
  fontFamily: "Cairo, sans-serif",

  // اختياري: إذا كنت تريد خطوط العناوين (Headers) مختلفة، يمكنك تعديلها هنا
  headings: {
    fontFamily: "Cairo, sans-serif",
  },

  // لضمان التوافق مع اللغة العربية (RTL) بشكل افتراضي
  dir: "rtl",

  // باقي إعدادات الثيم (الألوان، التباعد، إلخ)
});


export default theme;