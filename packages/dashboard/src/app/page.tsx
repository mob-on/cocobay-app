"use client";

import { LineChart } from "@/components/charts/LineChart";
import styles from "./page.module.css";

const chartdata = [
  {
    date: "Jan 23",
    Users: 2890,
    ["Premium Users"]: 145,
  },
  {
    date: "Feb 23",
    Users: 2756,
    ["Premium Users"]: 140,
  },
  {
    date: "Mar 23",
    Users: 3322,
    ["Premium Users"]: 150,
  },
  {
    date: "Apr 23",
    Users: 3470,
    ["Premium Users"]: 220,
  },
  {
    date: "May 23",
    Users: 3475,
    ["Premium Users"]: 190,
  },
  {
    date: "Jun 23",
    Users: 3129,
    ["Premium Users"]: 180,
  },
  {
    date: "Jul 23",
    Users: 3490,
    ["Premium Users"]: 193,
  },
  {
    date: "Aug 23",
    Users: 2903,
    ["Premium Users"]: 179,
  },
  {
    date: "Sep 23",
    Users: 2643,
    ["Premium Users"]: 163,
  },
  {
    date: "Oct 23",
    Users: 2837,
    ["Premium Users"]: 168,
  },
  {
    date: "Nov 23",
    Users: 3499,
    ["Premium Users"]: 790,
  },
  {
    date: "Dec 23",
    Users: 3239,
    ["Premium Users"]: 390,
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className="text-3xl font-bold">Cocobay Dashboard</h1>
      <div className="w-full max-h-72 p-12">
        <LineChart
          className="h-80"
          data={chartdata}
          index="date"
          categories={["Users", "Premium Users"]}
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
          xAxisLabel="Month"
          yAxisLabel="Users"
        />
      </div>
    </div>
  );
}
