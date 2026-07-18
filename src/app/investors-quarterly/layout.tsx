import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../investors-roi/investors-roi.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "SLB Executive Dashboard | Softwood Lumber Board",
  description:
    "Executive quarterly view of Softwood Lumber Board program impact.",
};

export default function InvestorsQuarterlyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`investors-roi min-h-screen ${openSans.variable}`}>
      {children}
    </div>
  );
}
