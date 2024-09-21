import Header from "@src/components/Header";
import Menu from "@src/components/Menu";
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="__main">{children}</main>
      <Menu />
    </>
  );
}
