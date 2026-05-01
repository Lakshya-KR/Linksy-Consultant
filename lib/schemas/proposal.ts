import { z } from "zod";

export const serviceTypeEnum = z.enum([
  "website",
  "ml_model",
  "ai_agent",
  "system_design",
  "scraping",
  "website_fix",
  "custom",
]);

export const contactMethodEnum = z.enum(["whatsapp", "call", "meeting", "email"]);

export const scopeSchema = z.object({
  service_type: serviceTypeEnum,
  title: z.string().min(3, "Give it a short, recognisable name").max(100),
  description: z
    .string()
    .min(20, "A few sentences help us reply faster")
    .max(2000),
  features: z.array(z.string().min(1).max(60)).max(15).default([]),
});

export const timelineSchema = z.object({
  timeline_weeks: z.number().int().min(1).max(52),
  start_date: z.string().min(1, "Pick a target start date"),
});

export const budgetSchema = z.object({
  budget_min: z.number().int().min(0),
  budget_max: z.number().int().min(0),
  preferred_contact: contactMethodEnum,
  contact_value: z.string().min(3, "Where should we reach you?"),
});

export const proposalSchema = scopeSchema
  .merge(timelineSchema)
  .merge(budgetSchema)
  .refine((d) => d.budget_max >= d.budget_min, {
    message: "Max budget must be greater than min",
    path: ["budget_max"],
  });

export type ProposalDraft = z.infer<typeof proposalSchema>;

export const DEFAULT_DRAFT: Partial<ProposalDraft> = {
  service_type: undefined,
  title: "",
  description: "",
  features: [],
  timeline_weeks: 8,
  start_date: "",
  budget_min: 30000,
  budget_max: 80000,
  preferred_contact: "whatsapp",
  contact_value: "",
};
