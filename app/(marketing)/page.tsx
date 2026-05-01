import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Phone,
  Calendar,
  Mail,
  Check,
  Network,
} from "lucide-react";
import ServiceGrid from "@/components/landing/ServiceGrid";
import ProcessSteps from "@/components/landing/ProcessSteps";
import HeroScene from "@/components/three/HeroSceneClient";
import { Brand } from "@/components/Brand";

const PUBLIC_EMAIL =
  process.env.NEXT_PUBLIC_AGENCY_EMAIL || "linksy.for.all@gmail.com";
const PUBLIC_PHONE = process.env.ADMIN_PHONE || "918887129831";
const FORMATTED_PHONE = `+91 ${PUBLIC_PHONE.slice(2, 7)} ${PUBLIC_PHONE.slice(7)}`;

export default function Home() {
  return (
    <>
      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-[0.07] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 backdrop-blur-md">
              <Sparkles className="size-3" />
              Now accepting projects · 2026
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-[-0.04em] leading-[0.95] font-display">
              Websites, AI,
              <br />
              <span className="italic text-gradient">custom software.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              <Brand size="sm" suffix={false} className="text-foreground" /> is a network of skilled developers,
              ML engineers, and AI specialists. We bridge clients with top
              technical talent — managing your project from brief to deployment.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="xl" className="group">
                <Link href="/signup">
                  Start your project
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="#services">
                  See what we build
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-foreground" /> Reply in under 24h
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-foreground" /> Live project tracker
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-foreground" /> Direct WhatsApp line
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-xs text-muted-foreground/60 uppercase tracking-widest font-mono flex flex-col items-center gap-2 animate-pulse">
          Scroll
          <div className="w-px h-12 bg-gradient-to-b from-foreground/40 to-transparent" />
        </div>
      </section>

      {/* ============================================================
          MARQUEE / TRUST
         ============================================================ */}
      <section
        className="relative py-12 border-y border-white/5 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee whitespace-nowrap text-3xl md:text-5xl font-display tracking-tight">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex shrink-0" aria-hidden={j === 1 ? true : undefined}>
              {[
                "Websites",
                "Machine Learning",
                "AI Agents",
                "Custom Software",
                "System Design",
                "Scraping",
                "Site Rescue",
                "Real-time Dashboards",
              ].map((t) => (
                <span key={`${j}-${t}`} className="flex items-center gap-10 px-6">
                  <span className="text-shine italic">{t}</span>
                  <span className="text-foreground/30 not-italic text-2xl md:text-3xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          ABOUT — network / commission model
         ============================================================ */}
      <section id="about" className="relative py-24 md:py-32 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Badge variant="outline" className="mb-4">
                <span className="font-mono text-[10px]">01 / ABOUT</span>
              </Badge>
              <h2 className="text-4xl md:text-6xl tracking-tight leading-tight font-display">
                A network,
                <br />
                <span className="italic text-muted-foreground">not an agency.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-8">
              <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">
                <Brand size="sm" suffix={false} className="text-foreground" /> is a technology solutions
                provider. We deliver end-to-end digital services through a curated
                network of verified developers, ML engineers, and AI specialists —
                each project handled by the most suitable specialist.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Our role is to bridge the gap between you and top-tier technical
                talent: from requirement gathering to final deployment, we
                manage the entire process so you don&apos;t have to.
              </p>

              {/* Working model */}
              <div className="grid sm:grid-cols-2 gap-3 pt-4">
                {[
                  { n: "01", t: "Understand", d: "We sit with your brief — clarify scope, timeline, and budget." },
                  { n: "02", t: "Assign", d: "We match the project to a verified specialist from our network." },
                  { n: "03", t: "Oversee", d: "We manage execution and stay between you and the builder." },
                  { n: "04", t: "Deliver", d: "We ensure quality and timely completion. You ship." },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.n}</span>
                      <span className="font-medium">{s.t}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                <Network className="size-4" strokeWidth={1.5} />
                Commission-based · You only pay the builder. We keep the network running.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES
         ============================================================ */}
      <section id="services" className="relative py-24 md:py-32 bg-spotlight">
        <div className="absolute inset-0 bg-dot opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl mb-16">
            <Badge variant="outline" className="mb-4">
              <span className="font-mono text-[10px]">02 / SERVICES</span>
            </Badge>
            <h2 className="text-4xl md:text-6xl tracking-tight leading-tight font-display">
              What we do,
              <br />
              <span className="italic text-muted-foreground">end-to-end.</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg">
              Four core offerings, plus everything in between. From a single
              landing page to a multi-tenant platform — we treat every project like our own.
            </p>
          </div>

          <ServiceGrid />
        </div>
      </section>

      {/* ============================================================
          PROCESS
         ============================================================ */}
      <section id="process" className="relative py-24 md:py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl mb-16">
            <Badge variant="outline" className="mb-4">
              <span className="font-mono text-[10px]">03 / PROCESS</span>
            </Badge>
            <h2 className="text-4xl md:text-6xl tracking-tight leading-tight font-display">
              From brief to ship,
              <br />
              <span className="italic text-muted-foreground">in four steps.</span>
            </h2>
          </div>

          <ProcessSteps />
        </div>
      </section>

      {/* ============================================================
          CONTACT / CREDIBILITY
         ============================================================ */}
      <section id="contact" className="relative py-24 md:py-32 border-t border-white/5 bg-spotlight">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl mb-16">
            <Badge variant="outline" className="mb-4">
              <span className="font-mono text-[10px]">04 / CONTACT</span>
            </Badge>
            <h2 className="text-4xl md:text-6xl tracking-tight leading-tight font-display">
              Talk to a human,
              <br />
              <span className="italic text-muted-foreground">not a contact form.</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg">
              You&apos;ll always get an answer from someone who can actually build the thing.
            </p>
          </div>

          {/* Direct contact strip */}
          <div className="mb-10 grid sm:grid-cols-2 gap-3">
            <a
              href={`mailto:${PUBLIC_EMAIL}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="size-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</div>
                  <div className="text-sm font-medium truncate">{PUBLIC_EMAIL}</div>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground shrink-0" />
            </a>
            <a
              href={`tel:+${PUBLIC_PHONE}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="size-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Phone</div>
                  <div className="text-sm font-medium font-mono">{FORMATTED_PHONE}</div>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground shrink-0" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp",
                desc: "Fastest. Drop a voice note or a paragraph — we read both.",
                tag: "< 1h reply",
              },
              {
                icon: Phone,
                title: "A real call",
                desc: "Pick up the phone for the kind of decisions that need a tone of voice.",
                tag: "By appointment",
              },
              {
                icon: Calendar,
                title: "Meeting",
                desc: "30 minutes to understand the brief, the budget, and the deadline.",
                tag: "Google Meet · Zoom",
              },
            ].map(({ icon: Icon, title, desc, tag }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all"
              >
                <div className="absolute top-6 right-6 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {tag}
                </div>
                <Icon className="size-6 mb-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-8 flex items-center gap-1 text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  Available after first brief
                  <ArrowUpRight className="size-3" />
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-20 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />
            <div className="relative">
              <h3 className="text-3xl md:text-5xl font-display tracking-tight">
                Got something to build?
              </h3>
              <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                Spend three minutes filling out a brief. Get a real human reply.
              </p>
              <Button asChild size="xl" className="mt-8">
                <Link href="/signup">
                  Start your project
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
