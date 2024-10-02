"use client";

import { useLoadingScreen } from "@src/shared/context/LoadingContext";
import { useEffect } from "react";

import PageContent from "./pageContent";

export default function Home() {
  const { hideLoading } = useLoadingScreen();

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  return <PageContent />;
}
