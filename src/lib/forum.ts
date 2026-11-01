import fs from "fs/promises";
import path from "path";
import { FORUM_CATEGORIES, FORUM_THREADS } from "../data/forumData";
import { ForumCategory, ForumThread, ForumReply } from "../types";

const FORUM_THREADS_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "forum-threads.json"
);

export async function getForumCategories(): Promise<ForumCategory[]> {
  return FORUM_CATEGORIES;
}

export async function getForumThreads(): Promise<ForumThread[]> {
  try {
    const raw = await fs.readFile(FORUM_THREADS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Initialize file with default seed threads
  }

  try {
    await fs.mkdir(path.dirname(FORUM_THREADS_FILE_PATH), { recursive: true });
    await fs.writeFile(
      FORUM_THREADS_FILE_PATH,
      JSON.stringify(FORUM_THREADS, null, 2),
      "utf-8"
    );
  } catch {
    // Ignore in-memory fallback
  }

  return FORUM_THREADS;
}

export async function saveForumThreads(threads: ForumThread[]): Promise<void> {
  await fs.mkdir(path.dirname(FORUM_THREADS_FILE_PATH), { recursive: true });
  await fs.writeFile(
    FORUM_THREADS_FILE_PATH,
    JSON.stringify(threads, null, 2),
    "utf-8"
  );
}

export async function getForumThreadBySlug(
  slug: string
): Promise<ForumThread | null> {
  const threads = await getForumThreads();
  const thread = threads.find((t) => t.slug === slug || t.id === slug);
  return thread || null;
}

export async function createForumThread(newThread: ForumThread): Promise<ForumThread> {
  const threads = await getForumThreads();
  const updated = [newThread, ...threads];
  await saveForumThreads(updated);
  return newThread;
}

export async function addReplyToThread(
  slug: string,
  reply: ForumReply
): Promise<{ thread: ForumThread; reply: ForumReply }> {
  const threads = await getForumThreads();
  const idx = threads.findIndex((t) => t.slug === slug || t.id === slug);

  if (idx === -1) {
    throw new Error(`Thread not found: ${slug}`);
  }

  const thread = threads[idx];
  const replies = thread.replies ? [...thread.replies, reply] : [reply];

  const updatedThread: ForumThread = {
    ...thread,
    replies,
    repliesCount: replies.length,
    lastActivity: "Just now",
  };

  threads[idx] = updatedThread;
  await saveForumThreads(threads);

  return { thread: updatedThread, reply };
}

export async function toggleThreadReaction(
  slug: string,
  type: "hype" | "playedIt" | "rip" | "insightful",
  increment: boolean
): Promise<ForumThread> {
  const threads = await getForumThreads();
  const idx = threads.findIndex((t) => t.slug === slug || t.id === slug);

  if (idx === -1) {
    throw new Error(`Thread not found: ${slug}`);
  }

  const thread = threads[idx];
  const reactions = thread.reactions || { hype: 0, playedIt: 0, rip: 0, insightful: 0 };
  const currentVal = reactions[type] || 0;
  const newVal = increment ? currentVal + 1 : Math.max(0, currentVal - 1);

  const updatedThread: ForumThread = {
    ...thread,
    reactions: {
      ...reactions,
      [type]: newVal,
    },
  };

  threads[idx] = updatedThread;
  await saveForumThreads(threads);
  return updatedThread;
}

export async function toggleThreadUpvote(
  slug: string,
  increment: boolean
): Promise<ForumThread> {
  const threads = await getForumThreads();
  const idx = threads.findIndex((t) => t.slug === slug || t.id === slug);

  if (idx === -1) {
    throw new Error(`Thread not found: ${slug}`);
  }

  const thread = threads[idx];
  const updatedThread: ForumThread = {
    ...thread,
    upvotes: increment ? thread.upvotes + 1 : Math.max(0, thread.upvotes - 1),
  };

  threads[idx] = updatedThread;
  await saveForumThreads(threads);
  return updatedThread;
}
