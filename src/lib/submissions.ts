import fs from "fs";
import path from "path";
import { PitchSubmission } from "../types";

const SUBMISSIONS_FILE = path.join(process.cwd(), "src", "data", "submissions.json");

export async function getSubmissions(): Promise<PitchSubmission[]> {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading submissions.json:", error);
  }
  return [];
}

export async function saveSubmissions(submissions: PitchSubmission[]): Promise<boolean> {
  try {
    const dir = path.dirname(SUBMISSIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving submissions.json:", error);
    return false;
  }
}

export async function addSubmission(
  pitch: Omit<PitchSubmission, "id" | "status" | "createdAt">
): Promise<PitchSubmission | null> {
  try {
    const submissions = await getSubmissions();
    const newSubmission: PitchSubmission = {
      ...pitch,
      id: `gx-pitch-${Date.now().toString().slice(-5)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newSubmission, ...submissions];
    const success = await saveSubmissions(updated);
    if (success) {
      return newSubmission;
    }
  } catch (error) {
    console.error("Error adding pitch submission:", error);
  }
  return null;
}

