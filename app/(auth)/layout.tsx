import Link from "next/link";
import { Brand } from "@/components/Brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-spotlight">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <header className="relative z-10 px-6 py-6 md:px-10">
        <Link href="/">
          <Brand size="md" />
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
