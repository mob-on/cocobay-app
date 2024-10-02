"use client";

import { useResources } from "@src/shared/context/ResourcesContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

/**
 * This page is used to redirect the user to the home page, once all resources are loaded.
 * This way we can show the loading screen as soon as possible, and then redirect to the home page,
 * Where the effect will use an effect to hide the loading screen.
 */
export default function Home() {
  const { allLoaded } = useResources();
  const router = useRouter();
  router.prefetch("/home");

  useEffect(() => {
    if (allLoaded) {
      router.replace("/home");
    }
  }, [allLoaded, router]);

  return <></>;
}
