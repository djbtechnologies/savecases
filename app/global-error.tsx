"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-raff-ink p-6 text-center text-raff-paper">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-raff-brass">
              SaveCases
            </p>
            <h1 className="mt-4 font-serif text-4xl">This private briefing could not load.</h1>
          </div>
        </main>
      </body>
    </html>
  );
}
