import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DarsFlow | One Lesson Note, Three Clear Drafts",
  description:
    "Turn one teacher observation into a reviewed parent update, teacher handover, and management summary.",
  applicationName: "DarsFlow",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "DarsFlow", statusBarStyle: "default" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
