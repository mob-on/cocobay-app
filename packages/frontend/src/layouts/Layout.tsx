import React from "react";
import Header from "src//components/Header";
import Menu from "src//components/Menu";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="__main">{children}</main>
      <Menu />
    </>
  );
}
