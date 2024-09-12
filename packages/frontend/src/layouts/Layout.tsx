import React from "react";
import Header from "frontend/src/components/Header";
import Menu from "frontend/src/components/Menu";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="__main">{children}</main>
      <Menu />
    </>
  );
}
