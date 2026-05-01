"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-spotlight" />,
});

export default function HeroSceneClient() {
  return <HeroScene />;
}
