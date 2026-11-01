import fs from "fs/promises";
import path from "path";
import { HardwareItem } from "../types";
import { HARDWARE_ITEMS } from "../data/hardwareData";

const HARDWARE_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "hardware.json"
);

export async function getHardwareItems(): Promise<HardwareItem[]> {
  try {
    const raw = await fs.readFile(HARDWARE_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item) => ({
        ...item,
        href: `/hardware/${item.slug}`,
      }));
    }
  } catch {
    // If file doesn't exist, seed with initial HARDWARE_ITEMS
  }

  try {
    await fs.mkdir(path.dirname(HARDWARE_FILE_PATH), { recursive: true });
    await fs.writeFile(
      HARDWARE_FILE_PATH,
      JSON.stringify(HARDWARE_ITEMS, null, 2),
      "utf-8"
    );
  } catch {
    // Ignore in-memory fallback
  }

  return HARDWARE_ITEMS.map((item) => ({
    ...item,
    href: `/hardware/${item.slug}`,
  }));
}

export async function getHardwareBySlug(
  slug: string
): Promise<HardwareItem | null> {
  const items = await getHardwareItems();
  const match = items.find((item) => item.slug === slug || item.id === slug);
  return match || null;
}

export async function saveHardwareItems(
  items: HardwareItem[]
): Promise<HardwareItem[]> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Hardware items must be a non-empty array");
  }

  const cleaned = items.map((item, idx) => ({
    ...item,
    id: item.id || `hw-${Date.now()}-${idx}`,
    slug: item.slug || `hardware-${idx + 1}`,
    href: `/hardware/${item.slug || `hardware-${idx + 1}`}`,
  }));

  await fs.mkdir(path.dirname(HARDWARE_FILE_PATH), { recursive: true });
  await fs.writeFile(
    HARDWARE_FILE_PATH,
    JSON.stringify(cleaned, null, 2),
    "utf-8"
  );

  return cleaned;
}

