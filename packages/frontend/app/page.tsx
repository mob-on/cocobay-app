import React, { lazy } from "react";

const PageContent = lazy(() => import("./pageContent"));

export default function Home() {
  return <PageContent />;
}
