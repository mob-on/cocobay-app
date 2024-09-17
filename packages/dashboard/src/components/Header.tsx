"use client";

import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { ItemType } from "antd/es/menu/interface";

const { Header: AntHeader } = Layout;

const headerMenuItems: (ItemType & { href: string })[] = [
  { title: "Home", key: "1", label: "Home", href: "/home" },
  { title: "Statistics", key: "2", label: "Statistics", href: "/statistics/" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab =
    headerMenuItems
      .find(
        (item) =>
          item.href === pathname || (item.href === "/home" && pathname === "/"),
      )
      ?.key?.toString() ?? "";
  return (
    <AntHeader style={{ display: "flex", alignItems: "center" }}>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[currentTab]}
        items={headerMenuItems}
        style={{ flex: 1, minWidth: 0 }}
        onChange={console.log}
        onSelect={(newItem) => {
          router.push(
            headerMenuItems.find((item) => item.key === newItem.key)!.href,
          );
        }}
      />
    </AntHeader>
  );
}
