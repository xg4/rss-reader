import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RSS Reader",
  description: "RSS Reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
        {children}
      </body>
    </html>
  );
}
