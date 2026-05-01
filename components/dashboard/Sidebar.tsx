"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/Brand";
import {
  LayoutDashboard,
  MessagesSquare,
  History,
  Settings,
  LogOut,
  Inbox,
  FolderKanban,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const CLIENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/contact", label: "Contact admin", icon: MessagesSquare },
  { href: "/dashboard/history", label: "History", icon: History },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Inbox", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/clients", label: "Clients", icon: Users },
];

export function Sidebar({
  variant,
  user,
}: {
  variant: "client" | "admin";
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = variant === "admin" ? ADMIN_NAV : CLIENT_NAV;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden fixed top-4 left-4 z-50 size-10 rounded-full glass flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-screen w-64 shrink-0",
          "border-r border-white/10 bg-background/80 backdrop-blur-xl",
          "flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/">
            <Brand size="md" />
          </Link>
          {variant === "admin" && (
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Admin
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard" || href === "/admin"
                ? pathname === href
                : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  active
                    ? "bg-white/[0.06] text-foreground border border-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <div className="px-3 py-2 text-xs">
            <div className="text-foreground font-medium truncate">{user.name}</div>
            <div className="text-muted-foreground truncate">{user.email}</div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
