import Link from "next/link";
import { ProposalProvider } from "@/components/form/ProposalContext";
import { ProgressRail } from "@/components/form/ProgressRail";
import BackgroundScene from "@/components/three/BackgroundSceneClient";
import { Brand } from "@/components/Brand";

export default function ProposeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProposalProvider>
      <div className="relative min-h-screen overflow-hidden isolate">
        {/* 3D background — positive z so it paints above body bg */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <BackgroundScene />
        </div>
        {/* Soft radial vignette — only darkens the corners, leaves the center bright */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="fixed inset-0 z-0 bg-grid opacity-[0.04] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

        {/* Header */}
        <header className="relative z-20 px-6 md:px-10 py-6 flex items-center justify-between">
          <Link href="/">
            <Brand size="md" />
          </Link>
          <Link
            href="/dashboard"
            className="text-xs uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now →
          </Link>
        </header>

        {/* Progress rail */}
        <div className="relative z-20 px-6 md:px-10 mb-8">
          <ProgressRail />
        </div>

        {/* Form content */}
        <main className="relative z-20 px-6 md:px-10 pb-20">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>
    </ProposalProvider>
  );
}
