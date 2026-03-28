"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBusinessQuizPage = pathname === "/business-quiz";
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const isAdminPage = pathname.startsWith("/admin");

  if (isBusinessQuizPage) {
    return <>{children}</>;
  }

  if (isAuthPage || isAdminPage) {
    return (
      <>
        <LogoHeader />
        {children}
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}