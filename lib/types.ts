export type UserRole = "client" | "admin";

export type ProjectStatus =
  | "pending"
  | "negotiating"
  | "accepted"
  | "in_progress"
  | "review"
  | "completed"
  | "cancelled";

export type ServiceType =
  | "website"
  | "ml_model"
  | "ai_agent"
  | "system_design"
  | "scraping"
  | "website_fix"
  | "custom";

export type ContactMethod = "whatsapp" | "call" | "meeting" | "email";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  whatsapp_number: string | null;
  created_at: string;
}

export interface ScopeDetails {
  features?: string[];
  notes?: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  service_type: ServiceType;
  scope_details: ScopeDetails | null;
  timeline_weeks: number | null;
  start_date: string | null;
  budget_min: number | null;
  budget_max: number | null;
  agreed_price: number | null;
  status: ProjectStatus;
  preferred_contact: ContactMethod | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: "todo" | "doing" | "done";
  position: number;
  created_at: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  client_id: string;
  amount: number;
  note: string | null;
  paid_at: string;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  website: "Website / Web App",
  ml_model: "Machine Learning Model",
  ai_agent: "Chatbot / AI Agent",
  system_design: "System Design",
  scraping: "Data / Scraping",
  website_fix: "Website Fix",
  custom: "Custom Software",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "Pending review",
  negotiating: "In negotiation",
  accepted: "Accepted",
  in_progress: "In progress",
  review: "In review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_VARIANT: Record<
  ProjectStatus,
  "default" | "warning" | "info" | "success" | "muted"
> = {
  pending: "warning",
  negotiating: "info",
  accepted: "info",
  in_progress: "info",
  review: "warning",
  completed: "success",
  cancelled: "muted",
};
