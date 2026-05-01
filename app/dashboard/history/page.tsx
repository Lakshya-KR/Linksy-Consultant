import { getSession, createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/card";
import { SERVICE_LABELS, type ServiceType, type Project } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function HistoryPage() {
  const session = await getSession();
  const supabase = await createClient();

  const [{ data: projects }, { data: payments }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", session!.user.id)
      .in("status", ["completed", "cancelled"])
      .order("updated_at", { ascending: false }),
    supabase
      .from("payments")
      .select("amount")
      .eq("client_id", session!.user.id),
  ]);

  const total = (payments ?? []).reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          History
        </div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight">
          The work so far.
        </h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Total spent
          </div>
          <div className="font-display text-3xl tracking-tight">
            {formatCurrency(total)}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Projects shipped
          </div>
          <div className="font-display text-3xl tracking-tight">
            {(projects ?? []).filter((p) => p.status === "completed").length}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Total projects
          </div>
          <div className="font-display text-3xl tracking-tight">
            {(projects ?? []).length}
          </div>
        </Card>
      </div>

      {/* Table */}
      {(projects ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-muted-foreground">
          No completed or cancelled projects yet.
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-5 font-normal">Project</th>
                  <th className="text-left py-3 px-5 font-normal">Service</th>
                  <th className="text-left py-3 px-5 font-normal">Status</th>
                  <th className="text-right py-3 px-5 font-normal">Price</th>
                  <th className="text-right py-3 px-5 font-normal">Closed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(projects as Project[]).map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-medium">{p.title}</td>
                    <td className="py-4 px-5 text-muted-foreground">
                      {SERVICE_LABELS[p.service_type as ServiceType]}
                    </td>
                    <td className="py-4 px-5"><StatusBadge status={p.status} /></td>
                    <td className="py-4 px-5 text-right font-mono">
                      {p.agreed_price ? formatCurrency(Number(p.agreed_price)) : "—"}
                    </td>
                    <td className="py-4 px-5 text-right text-muted-foreground">
                      {formatDate(p.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
