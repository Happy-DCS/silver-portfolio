import type { Metadata } from "next";
import { Instrument_Serif, Nanum_Myeongjo } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Silver Eun Cho — Portfolio",
  description: "시각·제품 디자이너 조은(Silver Eun Cho)의 포트폴리오. 널린 풀이지만, 행복한 풀.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${instrumentSerif.variable} ${nanumMyeongjo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
