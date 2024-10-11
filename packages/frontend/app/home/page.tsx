"use client";

import { useLoadingScreen } from "@contexts/Loading";
import { useServices } from "@contexts/Services/Services.hooks";
import { useEffect } from "react";

import PageContent from "./pageContent";

export default function Home() {
  const { hideLoading } = useLoadingScreen();
  const service = useServices();
  console.log(service);
  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  return <PageContent />;
}
