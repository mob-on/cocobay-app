"use client";

import { useLoadingScreen } from "@contexts/Loading";
import { useEffect } from "react";

import PageContent from "./pageContent";

export default function Home() {
  const { hideLoading } = useLoadingScreen();

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  return <PageContent />;
}
