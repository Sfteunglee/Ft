import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/Navigation";

export const metadata: Metadata = {
    title: "光州 ON | AI Travel Curator",
    description: "AI 에이전트가 제안하는 가장 로컬하고 트렌디한 광주 여행",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                <main className="min-h-screen relative">
                    {children}
                    <Navigation />
                </main>
            </body>
        </html>
    );
}
