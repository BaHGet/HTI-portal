import pdfMake from "pdfmake/build/pdfmake";

// يجب أن يكون Vazirmatn.ttf محولاً إلى Base64 ومُخزناً هنا
// سنفترض أننا سنقوم بتضمينه داخل الكود الرئيسي للتبسيط.

// هذا هو الخط الذي ستستخدمه pdfmake
pdfMake.fonts = {
  Vazirmatn: {
    normal: "Vazirmatn.ttf",
    bold: "Vazirmatn-Bold.ttf",
    italics: "Vazirmatn.ttf", // لا يوجد ايتاليك في Vazirmatn، نستخدم العادي
    bolditalics: "Vazirmatn-Bold.ttf", // نستخدم Bold
  },
  // الخط الافتراضي لدعم الأرقام اللاتينية
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};
