import { SetOutline } from "antd-mobile-icons";
import React from "react";
import Header from "src/components/Header";
import Menu from "src/components/Menu";
import { Feature } from "src/shared/lib/FeatureFlags";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="__main">{children}</main>
      <Menu />
      {Feature.DEV_MODE && (
        <a href="/devSettings">
          <SetOutline
            fontSize={32}
            style={{ position: "fixed", right: "10px", bottom: "10px" }}
          />
        </a>
      )}
    </>
  );
}
