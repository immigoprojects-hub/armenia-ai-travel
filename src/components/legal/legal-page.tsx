import type { ReactNode } from "react";

import { APP_NAME } from "@/lib/app-info";

// Plain reading layout for /privacy and /support, in the app's ivory / wine palette.
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f2ea] px-5 py-10 text-[#211d22]">
      <article className="mx-auto max-w-2xl space-y-5 text-[15px] leading-relaxed [&_a]:text-[#6e1b2d] [&_a]:underline [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:pt-2 [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        <a href="/" className="text-sm font-semibold tracking-wide no-underline">
          {APP_NAME}
        </a>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {children}
      </article>
    </main>
  );
}
