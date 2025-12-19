import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenData Hakaton",
  description: "Next.js project with frontend and backend using Vercel Postgres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
