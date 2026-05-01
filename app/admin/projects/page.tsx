import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SERVICE_LABELS, type Project, type ServiceType, type Profile } from "@/lib/types";
import { timeAgo, formatCurrency } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, profile:profiles!projects_client_id_fkey(*)")
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as (Project & { profile: Profile })[];

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Projects
        </div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight">
          All projects.
        </h1>
        <p className="mt-2 text-muted-foreground">{projects.length} total</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-5 font-normal">Project</th>
                <th className="text-left py-3 px-5 font-normal">Client</th>
                <th className="text-left py-3 px-5 font-normal">Service</th>
                <th className="text-left py-3 px-5 font-normal">Status</th>
                <th className="text-right py-3 px-5 font-normal">Price</th>
                <th className="text-right py-3 px-5 font-normal">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-4 px-5 text-muted-foreground">{p.profile?.full_name}</td>
                  <td className="py-4 px-5 text-muted-foreground">{SERVICE_LABELS[p.service_type as ServiceType]}</td>
                  <td className="py-4 px-5"><StatusBadge status={p.status} /></td>
                  <td className="py-4 px-5 text-right font-mono">
                    {p.agreed_price ? formatCurrency(Number(p.agreed_price)) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="py-4 px-5 text-right text-muted-foreground">{timeAgo(p.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
