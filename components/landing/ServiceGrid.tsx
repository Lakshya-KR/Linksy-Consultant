"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Cpu,
  Bot,
  Sparkles,
  LayoutGrid,
  Database,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

const core = [
  {
    icon: Globe,
    title: "Website & web app development",
    desc: "Marketing sites, dashboards, e-commerce, internal tools. Pixel-tight design, butter-smooth interactions, deployed on edge infra.",
    tag: "From a single landing page to a multi-tenant SaaS",
  },
  {
    icon: Cpu,
    title: "Machine learning models",
    desc: "Custom ML models trained on your data — classifiers, recommenders, vision, forecasting. From prototype to production endpoint.",
    tag: "Python · PyTorch · scikit-learn · MLOps",
  },
  {
    icon: Bot,
    title: "Chatbot & AI agent development",
    desc: "Custom agents that read, write, plan, and act inside your stack. RAG, tool-use, evaluations included.",
    tag: "Anthropic · OpenAI · open source",
  },
  {
    icon: Sparkles,
    title: "Custom software solutions",
    desc: "If it ships software, we probably do it. Tell us in the brief — we'll match the right specialist from the network.",
    tag: "Bring the weird ones",
  },
];

const supplementary = [
  {
    icon: LayoutGrid,
    title: "System design",
    desc: "Architecture, schema, queueing, caching, the trade-off conversations no one else will have with you.",
    tag: "Before you write code",
  },
  {
    icon: Database,
    title: "Scraping & data pipelines",
    desc: "Reliable scrapers with retries, anti-bot handling, and clean ETL into the database of your choice.",
    tag: "Cloud-scheduled · monitored",
  },
  {
    icon: Wrench,
    title: "Site rescues & fixes",
    desc: "Inherited a broken codebase? We diagnose, stabilize, and ship the patch — usually in days.",
    tag: "Existing codebase OK",
  },
];

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ServiceGrid() {
  return (
    <div className="space-y-10">
      {/* Core 4 */}
      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
        {core.map(({ icon: Icon, title, desc, tag }, i) => (
          <motion.div
            key={title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={variants}
            whileHover={{ y: -2 }}
            className="group relative bg-background p-8 md:p-10 transition-colors hover:bg-white/[0.02] cursor-pointer"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="size-4 text-muted-foreground" />
            </div>
            <Icon className="size-7 mb-8" strokeWidth={1.4} />
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {desc}
            </p>
            <div className="mt-6 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
              {tag}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Supplementary 3 */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4 ml-1">
          We also handle
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          {supplementary.map(({ icon: Icon, title, desc, tag }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={variants}
              whileHover={{ y: -2 }}
              className="group relative bg-background p-7 transition-colors hover:bg-white/[0.02]"
            >
              <Icon className="size-5 mb-5" strokeWidth={1.4} />
              <h3 className="text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              <div className="mt-4 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                {tag}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
