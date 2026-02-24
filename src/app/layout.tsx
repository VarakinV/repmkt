import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Real Estate Photography Growth Lab - Get Realtor Clients on Autopilot",
  description: "Join 500+ photographers using automated systems to get realtor clients without cold calling or expensive ads.",
  icons: {
    icon: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/repmkt-icon.png",
    shortcut: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/repmkt-icon.png",
    apple: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/repmkt-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
