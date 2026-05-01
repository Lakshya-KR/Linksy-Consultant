import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { MarketingNav } from "@/components/MarketingNav";

const PUBLIC_EMAIL =
  process.env.NEXT_PUBLIC_AGENCY_EMAIL || "linksy.for.all@gmail.com";
const PUBLIC_PHONE = process.env.ADMIN_PHONE || "918887129831";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="relative min-h-screen flex flex-col">
      <MarketingNav session={session ? { profile: session.profile } : null} />
      <main className="flex-1">{children}</main>
      <footer className="relative border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3">
          <div>
            <Brand size="md" />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              A network of skilled developers, machine-learning engineers, and AI specialists.
              We bridge clients with top technical talent — from requirement gathering to final deployment.
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="text-foreground font-medium mb-1">Services</div>
            <div>Websites &amp; web apps</div>
            <div>Machine learning models</div>
            <div>Chatbots &amp; AI agents</div>
            <div>Custom software solutions</div>
            <div className="pt-2 text-muted-foreground/70">Also: system design · scraping · site rescues</div>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="text-foreground font-medium mb-1">Get in touch</div>
            <a
              href={`mailto:${PUBLIC_EMAIL}`}
              className="block hover:text-foreground transition-colors break-all"
            >
              {PUBLIC_EMAIL}
            </a>
            <a
              href={`tel:+${PUBLIC_PHONE}`}
              className="block hover:text-foreground transition-colors font-mono"
            >
              +91 {PUBLIC_PHONE.slice(2, 7)} {PUBLIC_PHONE.slice(7)}
            </a>
            <Button asChild size="sm" className="mt-3">
              <Link href="/signup">Start your project →</Link>
            </Button>
          </div>
        </div>
        <div className="border-t border-white/5 px-6 md:px-10 py-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Linksy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
