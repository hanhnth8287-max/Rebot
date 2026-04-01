import "./globals.css";

export const metadata = {
  title: "RE Sales Bot — Tư Vấn BĐS AI",
  description: "AI Chatbot tư vấn bất động sản Việt Nam đỉnh cao",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
