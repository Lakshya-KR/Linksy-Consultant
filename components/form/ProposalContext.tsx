"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_DRAFT, type ProposalDraft } from "@/lib/schemas/proposal";

const KEY = "studio.proposal.draft.v1";

type Ctx = {
  draft: Partial<ProposalDraft>;
  update: (patch: Partial<ProposalDraft>) => void;
  reset: () => void;
};

const ProposalCtx = createContext<Ctx | null>(null);

export function ProposalProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Partial<ProposalDraft>>(DEFAULT_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDraft({ ...DEFAULT_DRAFT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch {}
  }, [draft, hydrated]);

  function update(patch: Partial<ProposalDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }
  function reset() {
    setDraft(DEFAULT_DRAFT);
    try { localStorage.removeItem(KEY); } catch {}
  }

  return (
    <ProposalCtx.Provider value={{ draft, update, reset }}>
      {children}
    </ProposalCtx.Provider>
  );
}

export function useProposal() {
  const ctx = useContext(ProposalCtx);
  if (!ctx) throw new Error("useProposal must be used inside ProposalProvider");
  return ctx;
}
