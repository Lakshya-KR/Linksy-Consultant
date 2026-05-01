import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  // Pull all clients + their project counts
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  const { data: countsRaw } = await supabase
    .from("projects")
    .select("client_id");

  const counts: Record<string, number> = {};
  for (const r of countsRaw ?? []) counts[r.client_id] = (counts[r.client_id] || 0) + 1;

  const clients = (profiles ?? []) as Profile[];

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Clients
        </div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight">
          People we work with.
        </h1>
        <p className="mt-2 text-muted-foreground">{clients.length} clients</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-5 font-normal">Name</th>
                <th className="text-left py-3 px-5 font-normal">Email</th>
                <th className="text-left py-3 px-5 font-normal">Phone</th>
                <th className="text-right py-3 px-5 font-normal">Projects</th>
                <th className="text-right py-3 px-5 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5 font-medium">{c.full_name}</td>
                  <td className="py-4 px-5 text-muted-foreground">{c.email}</td>
                  <td className="py-4 px-5 text-muted-foreground font-mono text-xs">
                    {c.whatsapp_number ?? c.phone ?? "—"}
                  </td>
                  <td className="py-4 px-5 text-right font-mono">{counts[c.id] ?? 0}</td>
                  <td className="py-4 px-5 text-right text-muted-foreground">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
