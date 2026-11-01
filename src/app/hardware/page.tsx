import React from "react";
import type { Metadata } from "next";
import { getHardwareItems } from "@/lib/hardware";
import HardwareArchiveClient from "./HardwareArchiveClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gaming Hardware & Tech Benchmarks | TheGamerX",
  description:
    "Comprehensive gaming hardware teardowns, GPU architecture benchmarks, console APUs, handhelds, and display reviews on TheGamerX.",
};

export default async function HardwareArchivePage() {
  const hardware = await getHardwareItems();
  return <HardwareArchiveClient initialHardware={hardware} />;
}

