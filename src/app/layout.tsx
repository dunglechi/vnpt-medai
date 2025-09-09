import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VNPT MedAI - Token Usage Monitor",
  description: "AI-Powered Medical Diagnosis Assistant with Token Usage & Cost Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
