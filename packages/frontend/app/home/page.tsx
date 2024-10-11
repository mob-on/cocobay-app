"use client";

import { useHideLoading } from "@src/hooks/useHideLoading";

import PageContent from "./pageContent";

export default function Home() {
  useHideLoading();
  return <PageContent />;
}
