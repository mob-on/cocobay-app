import dynamic from "next/dynamic";
import React from "react";

const PageContent = dynamic(() => import("./pageContent"));

export default function Home() {
  return <PageContent />;
}
