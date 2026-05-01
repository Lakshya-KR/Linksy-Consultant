import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Calendar, Mail, ArrowUpRight } from "lucide-react";

const ADMIN_PHONE = process.env.ADMIN_PHONE ?? "918887129831";
const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_AGENCY_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "linksy.for.all@gmail.com";
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

const FORMATTED_PHONE = `+91 ${ADMIN_PHONE.slice(2, 7)} ${ADMIN_PHONE.slice(7)}`;

export default function ContactPage() {
  const waLink = ADMIN_PHONE
    ? `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent("Hi Linksy — I'd like to chat about my project.")}`
    : "#";
  const callLink = ADMIN_PHONE ? `tel:+${ADMIN_PHONE}` : "#";
  const mailLink = ADMIN_EMAIL ? `mailto:${ADMIN_EMAIL}` : "#";

  const channels = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      desc: "Fastest. Type or voice-note us — replies usually within an hour during business hours.",
      cta: "Open WhatsApp",
      meta: FORMATTED_PHONE,
      href: waLink,
      external: true,
    },
    {
      icon: Phone,
      title: "Phone call",
      desc: "Pick up the phone for the kind of decisions that need a tone of voice.",
      cta: "Call now",
      meta: FORMATTED_PHONE,
      href: callLink,
      external: true,
    },
    {
      icon: Calendar,
      title: "Schedule a meeting",
      desc: "Book a 30-minute call on the calendar — Google Meet link included.",
      cta: CALENDLY_URL ? "Open Calendly" : "Email to schedule",
      meta: CALENDLY_URL ? "Calendly" : ADMIN_EMAIL,
      href: CALENDLY_URL || mailLink,
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      desc: "For things that need to live in your inbox: invoices, contracts, long context.",
      cta: "Send email",
      meta: ADMIN_EMAIL,
      href: mailLink,
      external: true,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Contact
        </div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight">
          Reach <span className="text-shine italic">Linksy</span>.
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Pick a channel. Real humans respond — usually within the hour during business hours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {channels.map(({ icon: Icon, title, desc, cta, meta, href, external }) => (
          <Card key={title} className="p-7 group hover:bg-white/[0.04] hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <Icon className="size-4" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate max-w-[55%] text-right">
                {meta}
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            <div className="mt-6">
              <Button asChild size="sm" variant="outline">
                <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                  {cta} <ArrowUpRight className="size-3" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
