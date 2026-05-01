"use client";

import dynamic from "next/dynamic";

const BackgroundScene = dynamic(() => import("./BackgroundScene"), {
  ssr: false,
  loading: () => null,
});

export default function BackgroundSceneClient() {
  return <BackgroundScene />;
}
