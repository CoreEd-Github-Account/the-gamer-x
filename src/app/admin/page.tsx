"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import { Story, TrendingGame, IndustryArticle, HardwareItem, PitchSubmission } from "@/types";

export default function AdminPage() {
  // Authentication state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Active console section: "stories" | "games" | "analysis" | "hardware" | "pitches"
  const [activeSection, setActiveSection] = useState<"stories" | "games" | "analysis" | "hardware" | "pitches">("stories");

  // Adjustable & Collapsible Sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Resize drag handling (clamped between 200px and 480px)
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.min(Math.max(e.clientX, 200), 480);
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, resize, stopResizing]);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Notification feedback
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // -----------------------------------------------------------------
  // 1. Stories & Articles (List & Modal) state
  // -----------------------------------------------------------------
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [isSavingStories, setIsSavingStories] = useState(false);

  // Stories Modal & Filtering state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [modalStory, setModalStory] = useState<Story | null>(null);
  const [modalStoryIdx, setModalStoryIdx] = useState<number | null>(null); // null = new story
  const [modalMarkdownTab, setModalMarkdownTab] = useState<"write" | "preview">("write");
  const [storySearchQuery, setStorySearchQuery] = useState("");
  const [storyFilter, setStoryFilter] = useState<"all" | "hero" | "lead">("all");

  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const modalHeroFileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------------------------------------
  // 2. Trending Games (List & Modal) state
  // -----------------------------------------------------------------
  const [games, setGames] = useState<TrendingGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [isSavingGames, setIsSavingGames] = useState(false);

  // Games Modal & Filtering state
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [modalGame, setModalGame] = useState<TrendingGame | null>(null);
  const [modalGameIdx, setModalGameIdx] = useState<number | null>(null); // null = new game
  const [modalGameMarkdownTab, setModalGameMarkdownTab] = useState<"write" | "preview">("write");
  const [gameSearchQuery, setGameSearchQuery] = useState("");
  const [gameFilter, setGameFilter] = useState<"all" | "featured" | "standard">("all");

  const modalGameFileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------------------------------------
  // 3. Deep Industry Analysis (List & Modal) state
  // -----------------------------------------------------------------
  const [articles, setArticles] = useState<IndustryArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isSavingArticles, setIsSavingArticles] = useState(false);

  // Analysis Modal & Filtering state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [modalArticle, setModalArticle] = useState<IndustryArticle | null>(null);
  const [modalArticleIdx, setModalArticleIdx] = useState<number | null>(null); // null = new article
  const [modalArticleMarkdownTab, setModalArticleMarkdownTab] = useState<"write" | "preview">("write");
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [articleFilter, setArticleFilter] = useState<string>("all");

  const modalArticleFileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------------------------------------
  // 4. Hardware & Tech State
  // -----------------------------------------------------------------
  const [hardware, setHardware] = useState<HardwareItem[]>([]);
  const [isLoadingHardware, setIsLoadingHardware] = useState(false);
  const [isSavingHardware, setIsSavingHardware] = useState(false);

  // Hardware Modal & Filtering state
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [modalHardware, setModalHardware] = useState<HardwareItem | null>(null);
  const [modalHardwareIdx, setModalHardwareIdx] = useState<number | null>(null); // null = new item
  const [modalHardwareMarkdownTab, setModalHardwareMarkdownTab] = useState<"write" | "preview">("write");
  const [hardwareSearchQuery, setHardwareSearchQuery] = useState("");
  const [hardwareFilter, setHardwareFilter] = useState<string>("all");

  const modalHardwareFileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------------------------------------
  // 5. Writer Pitches & Submissions State
  // -----------------------------------------------------------------
  const [pitches, setPitches] = useState<PitchSubmission[]>([]);
  const [isLoadingPitches, setIsLoadingPitches] = useState(false);
  const [isSavingPitches, setIsSavingPitches] = useState(false);
  const [pitchFilter, setPitchFilter] = useState<string>("all");
  const [pitchSearchQuery, setPitchSearchQuery] = useState("");
  const [selectedPitch, setSelectedPitch] = useState<PitchSubmission | null>(null);

  // Shared file upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(data.user?.username || "Admin");
          loadStories();
          loadGames();
          loadArticles();
          loadHardware();
          loadPitches();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch stories
  async function loadStories() {
    setIsLoadingStories(true);
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      if (data.success && Array.isArray(data.stories)) {
        setStories(data.stories);
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to load stories from server." });
    } finally {
      setIsLoadingStories(false);
    }
  }

  // Fetch trending games
  async function loadGames() {
    setIsLoadingGames(true);
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (data.success && Array.isArray(data.games)) {
        setGames(data.games);
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to load trending games from server." });
    } finally {
      setIsLoadingGames(false);
    }
  }

  // Fetch industry analysis articles
  async function loadArticles() {
    setIsLoadingArticles(true);
    try {
      const res = await fetch("/api/analysis");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to load industry analysis from server." });
    } finally {
      setIsLoadingArticles(false);
    }
  }

  // Fetch hardware items
  async function loadHardware() {
    setIsLoadingHardware(true);
    try {
      const res = await fetch("/api/hardware");
      const data = await res.json();
      if (data.success && Array.isArray(data.hardware)) {
        setHardware(data.hardware);
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to load hardware items from server." });
    } finally {
      setIsLoadingHardware(false);
    }
  }

  // Fetch writer pitches
  async function loadPitches() {
    setIsLoadingPitches(true);
    try {
      const res = await fetch("/api/write-for-us");
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        setPitches(data.submissions);
      }
    } catch {
      // silently fallback
    } finally {
      setIsLoadingPitches(false);
    }
  }

  async function handleUpdatePitchStatus(id: string, newStatus: PitchSubmission["status"]) {
    const updated = pitches.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    setPitches(updated);
    setIsSavingPitches(true);
    try {
      const res = await fetch("/api/write-for-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions: updated }),
      });
      if (res.ok) {
        setSaveMessage({
          type: "success",
          text: `Pitch status updated to "${newStatus.replace("_", " ")}".`,
        });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to update pitch status." });
    } finally {
      setIsSavingPitches(false);
    }
  }

  async function handleDeletePitch(id: string) {
    if (!window.confirm("Are you sure you want to delete this pitch submission?")) return;
    const updated = pitches.filter((p) => p.id !== id);
    setPitches(updated);
    setIsSavingPitches(true);
    try {
      const res = await fetch("/api/write-for-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions: updated }),
      });
      if (res.ok) {
        setSaveMessage({ type: "success", text: "Pitch removed successfully." });
        if (selectedPitch?.id === id) {
          setSelectedPitch(null);
        }
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to delete pitch." });
    } finally {
      setIsSavingPitches(false);
    }
  }

  // Handle Login submission
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setCurrentUser(data.user?.username || loginUsername);
        loadStories();
        loadGames();
        loadArticles();
        loadHardware();
        loadPitches();
      } else {
        setLoginError(data.message || "Invalid username or password");
      }
    } catch {
      setLoginError("Connection failed. Please check server status.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  // Handle Logout
  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setLoginPassword("");
    }
  }

  // -----------------------------------------------------------------
  // 1. Stories reordering & save
  // -----------------------------------------------------------------
  function handleMoveStory(fromIdx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (targetIdx < 0 || targetIdx >= stories.length) return;

    const copy = [...stories];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    setStories(copy);
  }

  async function handleSaveStories() {
    setIsSavingStories(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/stories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "All stories and hero placements saved successfully." });
        if (data.stories) {
          setStories(data.stories);
        }
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save stories." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error saving stories. Please verify server connection." });
    } finally {
      setIsSavingStories(false);
    }
  }

  // -----------------------------------------------------------------
  // Stories Modal & List Management methods
  // -----------------------------------------------------------------
  function openAddStoryModal() {
    const newSlug = `story-${Date.now()}`;
    const newStory: Story = {
      id: newSlug,
      slug: newSlug,
      title: "",
      category: "News",
      date: "May 2026",
      readTime: "3 min read",
      imageUrl: "/images/stories/witcher-4.jpg",
      description: "",
      isMain: stories.length === 0,
      isHero: false,
      href: `/stories/${newSlug}`,
      heroNumber: String(stories.filter((s) => s.isHero).length + 1).padStart(2, "0"),
      heroBadge: "Featured story",
      heroCtaText: "Read full story",
      heroImageUrl: "/images/stories/witcher-4.jpg",
      heroDescription: "",
      content: `## Story Overview\n\nWrite your complete article in markdown here.\n\n### Key Highlights\n\n- Major gameplay and feature reveals.\n- Technical details, platform availability, and release schedules.\n\n> "Exclusive quote or insight from the development leads."\n\nStay tuned to **TheGamerX** for continuing coverage!`,
    };
    setModalStory(newStory);
    setModalStoryIdx(null);
    setModalMarkdownTab("write");
    setIsStoryModalOpen(true);
  }

  function openEditStoryModal(idx: number) {
    const target = stories[idx];
    if (!target) return;
    setModalStory({ ...target });
    setModalStoryIdx(idx);
    setModalMarkdownTab("write");
    setIsStoryModalOpen(true);
  }

  function closeStoryModal() {
    setIsStoryModalOpen(false);
    setModalStory(null);
    setModalStoryIdx(null);
  }

  function updateModalStory<K extends keyof Story>(field: K, value: Story[K]) {
    setModalStory((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function handleModalSlugChange(rawSlug: string) {
    const sanitized = rawSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setModalStory((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        slug: sanitized,
        href: `/stories/${sanitized}`,
      };
    });
  }

  function toggleModalHero() {
    setModalStory((prev) => {
      if (!prev) return prev;
      const nextIsHero = !prev.isHero;
      const heroStoriesCount = stories.filter((s, i) => i !== modalStoryIdx && s.isHero).length;
      return {
        ...prev,
        isHero: nextIsHero,
        heroNumber: nextIsHero
          ? prev.heroNumber || String(heroStoriesCount + 1).padStart(2, "0")
          : prev.heroNumber,
        heroBadge: nextIsHero ? (prev.heroBadge || "Featured story") : prev.heroBadge,
        heroCtaText: nextIsHero ? (prev.heroCtaText || "Read full story") : prev.heroCtaText,
        heroImageUrl: nextIsHero ? (prev.heroImageUrl || prev.imageUrl || "/images/hero/gta6-trailer.jpg") : prev.heroImageUrl,
        heroDescription: nextIsHero ? (prev.heroDescription || prev.description || "") : prev.heroDescription,
      };
    });
  }

  function insertModalMarkdown(prefix: string, suffix: string = "") {
    const textarea = document.getElementById("modal-story-markdown-editor") as HTMLTextAreaElement | null;
    if (!textarea || !modalStory) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || "text";
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateModalStory("content", newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  }

  async function handleModalImageUpload(e: React.ChangeEvent<HTMLInputElement>, targetField: "imageUrl" | "heroImageUrl") {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateModalStory(targetField, data.url);
      } else {
        setUploadError(data.message || "Failed to upload image");
      }
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (modalFileInputRef.current) modalFileInputRef.current.value = "";
      if (modalHeroFileInputRef.current) modalHeroFileInputRef.current.value = "";
    }
  }

  async function handleSaveModalStory() {
    if (!modalStory) return;
    if (!modalStory.title.trim()) {
      alert("Please provide a story headline / title.");
      return;
    }

    const cleanSlug = modalStory.slug?.trim() || `story-${Date.now()}`;
    const finalizedStory: Story = {
      ...modalStory,
      title: modalStory.title.trim(),
      slug: cleanSlug,
      href: `/stories/${cleanSlug}`,
      id: modalStory.id || cleanSlug,
    };

    let updatedStories: Story[];
    if (modalStoryIdx === null) {
      updatedStories = [finalizedStory, ...stories];
    } else {
      updatedStories = stories.map((s, idx) => (idx === modalStoryIdx ? finalizedStory : s));
    }

    setStories(updatedStories);
    setIsSavingStories(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/stories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories: updatedStories }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `"${finalizedStory.title}" saved successfully.` });
        if (data.stories) {
          setStories(data.stories);
        }
        closeStoryModal();
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save story." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error connecting to server. Please try again." });
    } finally {
      setIsSavingStories(false);
    }
  }

  async function handleDeleteStoryWithConfirm(idx: number) {
    const target = stories[idx];
    if (!target) return;
    if (stories.length <= 1) {
      alert("At least one story is required in the catalog.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete "${target.title}"?`);
    if (!confirmed) return;

    const updated = stories.filter((_, i) => i !== idx);
    if (!updated.some((s) => s.isMain)) {
      updated[0].isMain = true;
    }
    setStories(updated);

    try {
      const res = await fetch("/api/stories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories: updated }),
      });
      if (res.ok) {
        setSaveMessage({ type: "success", text: `"${target.title}" removed from catalog.` });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to persist story deletion." });
    }

    if (isStoryModalOpen && modalStoryIdx === idx) {
      closeStoryModal();
    }
  }

  async function handleToggleHeroDirect(idx: number) {
    const next = [...stories];
    const target = next[idx];
    if (!target) return;

    const nextIsHero = !target.isHero;
    const heroCountOther = next.filter((s, i) => i !== idx && s.isHero).length;

    next[idx] = {
      ...target,
      isHero: nextIsHero,
      heroNumber: nextIsHero
        ? target.heroNumber || String(heroCountOther + 1).padStart(2, "0")
        : target.heroNumber,
      heroBadge: nextIsHero ? (target.heroBadge || "Featured story") : target.heroBadge,
      heroCtaText: nextIsHero ? (target.heroCtaText || "Read full story") : target.heroCtaText,
      heroImageUrl: nextIsHero ? (target.heroImageUrl || target.imageUrl || "/images/hero/gta6-trailer.jpg") : target.heroImageUrl,
      heroDescription: nextIsHero ? (target.heroDescription || target.description || "") : target.heroDescription,
    };

    setStories(next);

    try {
      const res = await fetch("/api/stories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories: next }),
      });
      if (res.ok) {
        setSaveMessage({
          type: "success",
          text: nextIsHero
            ? `"${target.title}" added to Hero Carousel.`
            : `"${target.title}" removed from Hero Carousel.`,
        });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to update hero placement." });
    }
  }

  // -----------------------------------------------------------------
  // 2. Trending Games (List & Modal) methods
  // -----------------------------------------------------------------
  function openAddGameModal() {
    const newSlug = `game-${Date.now()}`;
    const newGame: TrendingGame = {
      id: newSlug,
      slug: newSlug,
      title: "",
      category: "Action / Adventure",
      imageUrl: "/images/games/gta-vi.jpg",
      isFeatured: false,
      description: "",
      href: `/games/${newSlug}`,
      content: `## Game Overview & Intelligence\n\nWelcome to the official game hub on TheGamerX.\n\n### Highlights & Features\n\n- Next-generation visuals and immersive open-world mechanics.\n- Verified benchmarks, technical analysis, and developer updates.\n\n> "A bold new chapter pushing hardware performance to new boundaries."\n\nStay tuned to **TheGamerX** for daily updates, guides, and patch breakdowns.`,
    };
    setModalGame(newGame);
    setModalGameIdx(null);
    setModalGameMarkdownTab("write");
    setIsGameModalOpen(true);
  }

  function openEditGameModal(idx: number) {
    const target = games[idx];
    if (!target) return;
    setModalGame({ ...target });
    setModalGameIdx(idx);
    setModalGameMarkdownTab("write");
    setIsGameModalOpen(true);
  }

  function closeGameModal() {
    setIsGameModalOpen(false);
    setModalGame(null);
    setModalGameIdx(null);
  }

  function updateModalGame<K extends keyof TrendingGame>(field: K, value: TrendingGame[K]) {
    setModalGame((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      if (field === "title" && modalGameIdx === null) {
        const autoSlug = String(value)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        if (autoSlug) {
          updated.slug = autoSlug;
          updated.href = `/games/${autoSlug}`;
        }
      }
      return updated;
    });
  }

  function handleModalGameSlugChange(rawSlug: string) {
    const sanitized = rawSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setModalGame((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        slug: sanitized,
        href: `/games/${sanitized}`,
      };
    });
  }

  function toggleModalGameFeatured() {
    setModalGame((prev) => (prev ? { ...prev, isFeatured: !prev.isFeatured } : prev));
  }

  function handleToggleFeaturedDirect(idx: number) {
    const updated = games.map((g, i) => (i === idx ? { ...g, isFeatured: !g.isFeatured } : g));
    setGames(updated);
  }

  function handleMoveGame(fromIdx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (targetIdx < 0 || targetIdx >= games.length) return;

    const copy = [...games];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    setGames(copy);
  }

  function handleDeleteGameWithConfirm(idx: number) {
    const target = games[idx];
    if (!target) return;
    if (games.length <= 1) {
      alert("At least one game is required in the carousel.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete "${target.title || "this game"}"?`);
    if (!confirmed) return;

    const updated = games.filter((_, i) => i !== idx);
    setGames(updated);
    if (isGameModalOpen && modalGameIdx === idx) {
      closeGameModal();
    }
  }

  function insertModalGameMarkdown(prefix: string, suffix: string = "") {
    const textarea = document.getElementById("modal-game-markdown-editor") as HTMLTextAreaElement | null;
    if (!textarea || !modalGame) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || "text";
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateModalGame("content", newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  }

  async function handleModalGameImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateModalGame("imageUrl", data.url);
      } else {
        setUploadError(data.message || "Failed to upload image");
      }
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (modalGameFileInputRef.current) modalGameFileInputRef.current.value = "";
    }
  }

  async function handleSaveGames() {
    setIsSavingGames(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "Trending games order saved successfully." });
        if (data.games) {
          setGames(data.games);
        }
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save trending games." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error saving trending games. Please verify server connection." });
    } finally {
      setIsSavingGames(false);
    }
  }

  async function handleSaveModalGame() {
    if (!modalGame) return;
    if (!modalGame.title.trim()) {
      alert("Please provide a game title.");
      return;
    }

    const cleanSlug = modalGame.slug?.trim() || `game-${Date.now()}`;
    const finalizedGame: TrendingGame = {
      ...modalGame,
      title: modalGame.title.trim(),
      slug: cleanSlug,
      href: `/games/${cleanSlug}`,
      id: modalGame.id || cleanSlug,
    };

    let updatedGames: TrendingGame[];
    if (modalGameIdx === null) {
      updatedGames = [finalizedGame, ...games];
    } else {
      updatedGames = games.map((g, idx) => (idx === modalGameIdx ? finalizedGame : g));
    }

    setGames(updatedGames);
    setIsSavingGames(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games: updatedGames }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `"${finalizedGame.title}" saved successfully.` });
        if (data.games) {
          setGames(data.games);
        }
        closeGameModal();
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save game." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error connecting to server. Please try again." });
    } finally {
      setIsSavingGames(false);
    }
  }

  // -----------------------------------------------------------------
  // 3. Deep Industry Analysis (List & Modal) methods
  // -----------------------------------------------------------------
  function openAddArticleModal() {
    const newIdx = articles.length + 1;
    const newSlug = `analysis-${Date.now()}`;
    const newArticle: IndustryArticle = {
      id: newSlug,
      slug: newSlug,
      number: String(newIdx).padStart(2, "0"),
      category: "Market Report",
      title: "",
      description: "",
      date: "May 2026",
      readTime: "5 min read",
      imageUrl: "/images/industry/ubisoft.jpg",
      href: `/analysis/${newSlug}`,
      content: `## Executive Overview\n\nWelcome to this comprehensive market report from TheGamerX Intelligence.\n\n### Strategic Takeaways\n\n- Primary market indicators, publisher performance, and consumer sentiment.\n- Platform technology benchmarks and long-term economic shifts.\n\n> "Strategic insight into where interactive entertainment technology heads next."\n\nStay tuned to **TheGamerX** for daily market intelligence and developer interviews.`,
    };
    setModalArticle(newArticle);
    setModalArticleIdx(null);
    setModalArticleMarkdownTab("write");
    setIsArticleModalOpen(true);
  }

  function openEditArticleModal(idx: number) {
    const target = articles[idx];
    if (!target) return;
    setModalArticle({ ...target });
    setModalArticleIdx(idx);
    setModalArticleMarkdownTab("write");
    setIsArticleModalOpen(true);
  }

  function closeArticleModal() {
    setIsArticleModalOpen(false);
    setModalArticle(null);
    setModalArticleIdx(null);
  }

  function updateModalArticle<K extends keyof IndustryArticle>(field: K, value: IndustryArticle[K]) {
    setModalArticle((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      if (field === "title" && modalArticleIdx === null) {
        const autoSlug = String(value)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        if (autoSlug) {
          updated.slug = autoSlug;
          updated.href = `/analysis/${autoSlug}`;
        }
      }
      return updated;
    });
  }

  function handleModalArticleSlugChange(rawSlug: string) {
    const sanitized = rawSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setModalArticle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        slug: sanitized,
        href: `/analysis/${sanitized}`,
      };
    });
  }

  function handleMoveArticle(fromIdx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (targetIdx < 0 || targetIdx >= articles.length) return;

    const copy = [...articles];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    const renumbered = copy.map((a, idx) => ({
      ...a,
      number: String(idx + 1).padStart(2, "0"),
    }));

    setArticles(renumbered);
  }

  function handleDeleteArticleWithConfirm(idx: number) {
    const target = articles[idx];
    if (!target) return;
    if (articles.length <= 1) {
      alert("At least one analysis report is required in the section.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete "${target.title || "this report"}"?`);
    if (!confirmed) return;

    const updated = articles.filter((_, i) => i !== idx);
    const renumbered = updated.map((a, i) => ({
      ...a,
      number: String(i + 1).padStart(2, "0"),
    }));
    setArticles(renumbered);
    if (isArticleModalOpen && modalArticleIdx === idx) {
      closeArticleModal();
    }
  }

  function insertModalArticleMarkdown(prefix: string, suffix: string = "") {
    const textarea = document.getElementById("modal-article-markdown-editor") as HTMLTextAreaElement | null;
    if (!textarea || !modalArticle) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || "text";
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateModalArticle("content", newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  }

  async function handleModalArticleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateModalArticle("imageUrl", data.url);
      } else {
        setUploadError(data.message || "Failed to upload image");
      }
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (modalArticleFileInputRef.current) modalArticleFileInputRef.current.value = "";
    }
  }

  async function handleSaveArticles() {
    setIsSavingArticles(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/analysis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "Industry analysis reports order saved successfully." });
        if (data.articles) {
          setArticles(data.articles);
        }
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save industry analysis." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error saving industry analysis. Please verify server connection." });
    } finally {
      setIsSavingArticles(false);
    }
  }

  async function handleSaveModalArticle() {
    if (!modalArticle) return;
    if (!modalArticle.title.trim()) {
      alert("Please provide a report title / headline.");
      return;
    }

    const cleanSlug = modalArticle.slug?.trim() || `analysis-${Date.now()}`;
    const finalizedArticle: IndustryArticle = {
      ...modalArticle,
      title: modalArticle.title.trim(),
      slug: cleanSlug,
      href: `/analysis/${cleanSlug}`,
      id: modalArticle.id || cleanSlug,
    };

    let updatedArticles: IndustryArticle[];
    if (modalArticleIdx === null) {
      updatedArticles = [finalizedArticle, ...articles];
    } else {
      updatedArticles = articles.map((a, idx) => (idx === modalArticleIdx ? finalizedArticle : a));
    }

    const renumbered = updatedArticles.map((a, idx) => ({
      ...a,
      number: String(idx + 1).padStart(2, "0"),
    }));

    setArticles(renumbered);
    setIsSavingArticles(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/analysis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: renumbered }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `"${finalizedArticle.title}" saved successfully.` });
        if (data.articles) {
          setArticles(data.articles);
        }
        closeArticleModal();
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save industry report." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error connecting to server. Please try again." });
    } finally {
      setIsSavingArticles(false);
    }
  }

  // -----------------------------------------------------------------
  // 4. Hardware & Tech Handlers
  // -----------------------------------------------------------------
  function openAddHardwareModal() {
    const newSlug = `hw-${Date.now()}`;
    const newItem: HardwareItem = {
      id: newSlug,
      slug: newSlug,
      title: "",
      category: "GPUs & CPUs",
      specsBadge: "RTX 5090 • 32GB GDDR7",
      rating: "9.5 / 10 Editor's Choice",
      date: "November 2026",
      readTime: "5 min read",
      imageUrl: "/images/reviews/rtx-5090.jpg",
      description: "",
      content: "### Hardware Overview & Benchmark Analysis\n\nWrite your breakdown, architectural analysis, and benchmark charts here.\n\n#### Key Specifications\n- **Architecture:** Blackwell / RDNA\n- **Memory:** High-speed GDDR7\n- **Target Display:** 4K 144Hz / OLED\n",
      isFeatured: false,
      href: `/hardware/${newSlug}`,
    };
    setModalHardware(newItem);
    setModalHardwareIdx(null);
    setModalHardwareMarkdownTab("write");
    setIsHardwareModalOpen(true);
  }

  function openEditHardwareModal(idx: number) {
    const target = hardware[idx];
    if (!target) return;
    setModalHardware({ ...target });
    setModalHardwareIdx(idx);
    setModalHardwareMarkdownTab("write");
    setIsHardwareModalOpen(true);
  }

  function closeHardwareModal() {
    setIsHardwareModalOpen(false);
    setModalHardware(null);
    setModalHardwareIdx(null);
  }

  function updateModalHardware<K extends keyof HardwareItem>(field: K, value: HardwareItem[K]) {
    setModalHardware((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      if (field === "title" && modalHardwareIdx === null) {
        const autoSlug = String(value)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        if (autoSlug) {
          updated.slug = autoSlug;
          updated.href = `/hardware/${autoSlug}`;
        }
      }
      return updated;
    });
  }

  function handleModalHardwareSlugChange(rawSlug: string) {
    const sanitized = rawSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setModalHardware((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        slug: sanitized,
        href: `/hardware/${sanitized}`,
      };
    });
  }

  function handleMoveHardware(fromIdx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (targetIdx < 0 || targetIdx >= hardware.length) return;

    const copy = [...hardware];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    setHardware(copy);
  }

  function handleDeleteHardwareWithConfirm(idx: number) {
    const target = hardware[idx];
    if (!target) return;
    if (hardware.length <= 1) {
      alert("At least one hardware item is required in the section.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete "${target.title || "this hardware item"}"?`);
    if (!confirmed) return;

    const updated = hardware.filter((_, i) => i !== idx);
    setHardware(updated);
    if (isHardwareModalOpen && modalHardwareIdx === idx) {
      closeHardwareModal();
    }
  }

  function insertModalHardwareMarkdown(prefix: string, suffix: string = "") {
    const textarea = document.getElementById("modal-hardware-markdown-editor") as HTMLTextAreaElement | null;
    if (!textarea || !modalHardware) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || "text";
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateModalHardware("content", newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  }

  async function handleModalHardwareImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateModalHardware("imageUrl", data.url);
      } else {
        setUploadError(data.message || "Failed to upload image");
      }
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (modalHardwareFileInputRef.current) modalHardwareFileInputRef.current.value = "";
    }
  }

  async function handleSaveHardware() {
    setIsSavingHardware(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/hardware", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hardware }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "Hardware items order saved successfully." });
        if (data.hardware) {
          setHardware(data.hardware);
        }
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save hardware items." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error saving hardware items. Please verify server connection." });
    } finally {
      setIsSavingHardware(false);
    }
  }

  async function handleSaveModalHardware() {
    if (!modalHardware) return;
    if (!modalHardware.title.trim()) {
      alert("Please provide a hardware item title.");
      return;
    }

    const cleanSlug = modalHardware.slug?.trim() || `hardware-${Date.now()}`;
    const finalizedItem: HardwareItem = {
      ...modalHardware,
      title: modalHardware.title.trim(),
      slug: cleanSlug,
      href: `/hardware/${cleanSlug}`,
      id: modalHardware.id || cleanSlug,
    };

    let updatedHardware: HardwareItem[];
    if (modalHardwareIdx === null) {
      updatedHardware = [finalizedItem, ...hardware];
    } else {
      updatedHardware = hardware.map((item, idx) => (idx === modalHardwareIdx ? finalizedItem : item));
    }

    setHardware(updatedHardware);
    setIsSavingHardware(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/hardware", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hardware: updatedHardware }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `"${finalizedItem.title}" saved successfully.` });
        if (data.hardware) {
          setHardware(data.hardware);
        }
        closeHardwareModal();
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to save hardware item." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Error connecting to server. Please try again." });
    } finally {
      setIsSavingHardware(false);
    }
  }

  // 1. Loading screen
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080b11]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading console...</span>
        </div>
      </div>
    );
  }

  // 2. Clean, Quiet Login Screen with Exact Logo
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#080b11]">
        <div className="w-full max-w-sm">
          {/* Exact Brand Logo matching Header.tsx */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden border border-blue-500/30 shadow-md shadow-blue-500/20 bg-[#080b11]">
              <Image
                src="/logo.png"
                alt="TheGamerX logo"
                width={40}
                height={40}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center">
              <Image
                src="/images/thegamerx-wordmark.png"
                alt="TheGamerX"
                width={150}
                height={22}
                priority
                className="h-6 w-auto object-contain drop-shadow-[0_0_8px_rgba(1,71,252,0.35)]"
              />
            </div>
          </div>

          <div className="bg-[#0e131f] border border-white/10 rounded-xl p-6 shadow-2xl">
            <div className="mb-5">
              <h1 className="text-sm font-semibold text-white">Content Studio Sign In</h1>
              <p className="text-xs text-slate-400 mt-0.5">Enter your editorial credentials to manage content.</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/40 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium font-semibold text-xs tracking-wide transition disabled:opacity-50 cursor-pointer shadow-md shadow-blue-950/40"
              >
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
              &larr; Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stories references
  const heroCount = stories.filter((s) => s.isHero).length;

  // Filtered stories for clean list view
  const filteredStories = stories.filter((story) => {
    const query = storySearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      story.title.toLowerCase().includes(query) ||
      (story.slug && story.slug.toLowerCase().includes(query)) ||
      story.category.toLowerCase().includes(query) ||
      (story.description && story.description.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (storyFilter === "hero") return story.isHero;
    if (storyFilter === "lead") return story.isMain;
    return true;
  });

  // Modal rendered markdown preview
  const renderedModalMarkdown = modalStory?.content
    ? (marked.parse(modalStory.content, { gfm: true, breaks: true }) as string)
    : "<p class='text-slate-500 text-sm'>No content written yet.</p>";

  // Games references & filtered list
  const featuredGamesCount = games.filter((g) => g.isFeatured).length;
  const filteredGames = games.filter((game) => {
    if (gameFilter === "featured" && !game.isFeatured) return false;
    if (gameFilter === "standard" && game.isFeatured) return false;
    if (gameSearchQuery.trim()) {
      const q = gameSearchQuery.toLowerCase();
      const matchTitle = (game.title || "").toLowerCase().includes(q);
      const matchCat = (game.category || "").toLowerCase().includes(q);
      const matchSlug = (game.slug || "").toLowerCase().includes(q);
      const matchDesc = (game.description || "").toLowerCase().includes(q);
      return matchTitle || matchCat || matchSlug || matchDesc;
    }
    return true;
  });
  const renderedModalGameMarkdown = modalGame?.content
    ? (marked.parse(modalGame.content, { gfm: true, breaks: true }) as string)
    : "<p class='text-slate-500 text-sm'>No content written yet.</p>";

  // Industry Analysis references & filtered list
  const filteredArticles = articles.filter((article) => {
    if (articleFilter !== "all" && article.category?.toLowerCase() !== articleFilter.toLowerCase()) {
      return false;
    }
    if (articleSearchQuery.trim()) {
      const q = articleSearchQuery.toLowerCase();
      const matchTitle = (article.title || "").toLowerCase().includes(q);
      const matchCat = (article.category || "").toLowerCase().includes(q);
      const matchSlug = (article.slug || "").toLowerCase().includes(q);
      const matchDesc = (article.description || "").toLowerCase().includes(q);
      return matchTitle || matchCat || matchSlug || matchDesc;
    }
    return true;
  });
  const renderedModalArticleMarkdown = modalArticle?.content
    ? (marked.parse(modalArticle.content, { gfm: true, breaks: true }) as string)
    : "<p class='text-slate-500 text-sm'>No content written yet.</p>";

  // Hardware references & filtered list
  const filteredHardware = hardware.filter((item) => {
    if (hardwareFilter === "featured" && !item.isFeatured) return false;
    if (hardwareFilter !== "all" && hardwareFilter !== "featured" && item.category?.toLowerCase() !== hardwareFilter.toLowerCase()) {
      return false;
    }
    if (hardwareSearchQuery.trim()) {
      const q = hardwareSearchQuery.toLowerCase();
      const matchTitle = (item.title || "").toLowerCase().includes(q);
      const matchCat = (item.category || "").toLowerCase().includes(q);
      const matchSlug = (item.slug || "").toLowerCase().includes(q);
      const matchDesc = (item.description || "").toLowerCase().includes(q);
      const matchSpecs = (item.specsBadge || "").toLowerCase().includes(q);
      return matchTitle || matchCat || matchSlug || matchDesc || matchSpecs;
    }
    return true;
  });
  const renderedModalHardwareMarkdown = modalHardware?.content
    ? (marked.parse(modalHardware.content, { gfm: true, breaks: true }) as string)
    : "<p class='text-slate-500 text-sm'>No content written yet.</p>";

  // Pitches references & filtered list
  const pendingPitchesCount = pitches.filter((p) => p.status === "pending").length;
  const filteredPitches = pitches.filter((p) => {
    if (pitchFilter !== "all" && p.status !== pitchFilter) return false;
    if (pitchSearchQuery.trim()) {
      const q = pitchSearchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.pitch.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-[#080b11] text-slate-200 relative selection:bg-blue-600 selection:text-white">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden cursor-pointer"
        />
      )}

      {/* ADJUSTABLE & COLLAPSIBLE SIDEBAR */}
      <aside
        style={{ width: isSidebarCollapsed ? 76 : sidebarWidth }}
        className={`fixed inset-y-0 left-0 z-50 lg:static flex flex-col bg-[#0a0e17] border-r border-white/10 flex-shrink-0 relative ${
          isResizing ? "transition-none select-none" : "transition-[width] duration-200"
        } ${
          isMobileSidebarOpen ? "translate-x-0 !w-72" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header (Logo + Collapse/Expand Toggle) */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-3 overflow-hidden ${
              isSidebarCollapsed ? "justify-center w-full" : ""
            }`}
            title="TheGamerX Studio"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden border border-blue-500/30 shadow-md shadow-blue-500/20 bg-[#080b11] flex-shrink-0">
              <Image
                src="/logo.png"
                alt="TheGamerX logo"
                width={36}
                height={36}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src="/images/thegamerx-wordmark.png"
                  alt="TheGamerX"
                  width={130}
                  height={20}
                  priority
                  className="h-4.5 w-auto object-contain drop-shadow-[0_0_8px_rgba(1,71,252,0.35)]"
                />
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-slate-800 text-blue-400 border border-white/10">
                  Studio
                </span>
              </div>
            )}
          </Link>

          {/* Collapse button for desktop */}
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              title="Collapse sidebar"
              className="hidden lg:flex w-7 h-7 rounded-md items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isSidebarCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-white/5">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              title="Expand sidebar"
              className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Items in Sidebar */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          <div>
            {!isSidebarCollapsed && (
              <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Content Management
              </span>
            )}
            <nav className="space-y-1.5">
              {/* 1. Stories & Articles */}
              <button
                onClick={() => {
                  setActiveSection("stories");
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? `Stories & Articles (${stories.length})` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                  activeSection === "stories"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">Stories & Articles</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#141b2a] text-blue-300 border border-blue-500/20">
                      {stories.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 2. Trending Games */}
              <button
                onClick={() => {
                  setActiveSection("games");
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? `Trending Games (${games.length})` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                  activeSection === "games"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">Trending Games</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#141b2a] text-blue-300 border border-blue-500/20">
                      {games.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 3. Deep Industry Analysis */}
              <button
                onClick={() => {
                  setActiveSection("analysis");
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? `Deep Industry Analysis (${articles.length})` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                  activeSection === "analysis"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">Deep Industry Analysis</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#141b2a] text-blue-300 border border-blue-500/20">
                      {articles.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 4. Hardware & Gear */}
              <button
                onClick={() => {
                  setActiveSection("hardware");
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? `Hardware & Gear (${hardware.length})` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                  activeSection === "hardware"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">Hardware & Gear</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#141b2a] text-blue-300 border border-blue-500/20">
                      {hardware.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 5. Writer Pitches */}
              <button
                onClick={() => {
                  setActiveSection("pitches");
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? `Writer Pitches (${pitches.length})` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                  activeSection === "pitches"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">Writer Pitches</span>
                    <div className="flex items-center gap-1.5 ml-2">
                      {pendingPitchesCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title={`${pendingPitchesCount} pending`} />
                      )}
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#141b2a] text-blue-300 border border-blue-500/20">
                        {pitches.length}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            </nav>
          </div>

          {/* Quick Shortcuts */}
          <div>
            {!isSidebarCollapsed && (
              <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Quick Links
              </span>
            )}
            <nav className="space-y-1">
              <Link
                href="/"
                target="_blank"
                title={isSidebarCollapsed ? "View live site" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition ${
                  isSidebarCollapsed ? "justify-center px-0" : ""
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {!isSidebarCollapsed && <span className="truncate">View live site</span>}
              </Link>

              <Link
                href="/write-for-us"
                target="_blank"
                title={isSidebarCollapsed ? "Write For Us page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition ${
                  isSidebarCollapsed ? "justify-center px-0" : ""
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {!isSidebarCollapsed && <span className="truncate">Write For Us page</span>}
              </Link>

              <Link
                href="/forum"
                target="_blank"
                title={isSidebarCollapsed ? "View community forum" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition ${
                  isSidebarCollapsed ? "justify-center px-0" : ""
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                {!isSidebarCollapsed && <span className="truncate">View community forum</span>}
              </Link>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with User Profile and Sign out */}
        <div className="p-3 border-t border-white/10 bg-[#080b11]/80 flex-shrink-0">
          <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {currentUser ? currentUser.charAt(0).toUpperCase() : "A"}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{currentUser || "Admin"}</p>
                  <p className="text-[10px] text-slate-500">Administrator</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
          {isSidebarCollapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-full mt-2 p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition flex items-center justify-center cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>

        {/* Drag Resize Handle (Desktop Only) */}
        {!isSidebarCollapsed && (
          <div
            onMouseDown={startResizing}
            onDoubleClick={() => setSidebarWidth(260)}
            title="Drag to resize sidebar width, double-click to reset"
            className="hidden lg:block absolute top-0 right-0 w-1.5 h-full hover:w-2 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 cursor-col-resize transition-all z-20 group"
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-0.5 h-10 bg-white/20 group-hover:bg-blue-400 rounded-full" />
          </div>
        )}
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Sleek Top Navbar */}
        <header className="h-16 border-b border-white/10 bg-[#080b11]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Dashboard</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-semibold tracking-wide">
                {activeSection === "stories" && "Stories & Articles"}
                {activeSection === "games" && "Trending Games"}
                {activeSection === "analysis" && "Deep Industry Analysis"}
                {activeSection === "hardware" && "Hardware & Gear"}
                {activeSection === "pitches" && "Writer Pitches & Submissions"}
              </span>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-slate-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/5"
            >
              <span>View live site</span>
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            <span className="hidden sm:inline-block text-slate-700">|</span>

            <button
              onClick={handleLogout}
              className="hidden sm:inline-block text-slate-400 hover:text-rose-400 transition cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* Global Feedback Alert */}
        {saveMessage && (
          <div
            className={`mb-6 p-3 rounded-lg text-xs font-medium border flex items-center justify-between ${
              saveMessage.type === "success"
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/30 border-rose-500/30 text-rose-300"
            }`}
          >
            <span>{saveMessage.text}</span>
            <button
              onClick={() => setSaveMessage(null)}
              className="text-slate-400 hover:text-white cursor-pointer ml-3 text-xs"
            >
              &times;
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION 1: STORIES & ARTICLES MANAGER (LIST & MODAL) */}
        {/* =================================================================== */}
        {activeSection === "stories" && (
          <div>
            {/* Header with Title, Stats, and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Stories & Articles</h2>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                    {stories.length} stories
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/30">
                    {heroCount} in Hero Carousel
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage all stories and full Markdown blog posts. Click &ldquo;Edit&rdquo; on any story to customize details or feature it in the Hero Carousel.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={openAddStoryModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition shadow-md shadow-blue-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add story</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveStories}
                  disabled={isSavingStories}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-white/10 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingStories ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save order</span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setStoryFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    storyFilter === "all"
                      ? "bg-slate-800 text-white border border-white/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  All ({stories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStoryFilter("hero")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    storyFilter === "hero"
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Hero Carousel ({heroCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStoryFilter("lead")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    storyFilter === "lead"
                      ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  Lead stories
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={storySearchQuery}
                  onChange={(e) => setStorySearchQuery(e.target.value)}
                  placeholder="Search stories by title or slug..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0c101b] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Stories List View */}
            {isLoadingStories ? (
              <div className="py-24 text-center text-xs text-slate-500">Loading stories...</div>
            ) : filteredStories.length === 0 ? (
              <div className="mt-6 p-12 text-center rounded-xl bg-[#0c101b] border border-white/10">
                <p className="text-sm text-slate-300 font-medium">No stories found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {storySearchQuery
                    ? `No story matches "${storySearchQuery}". Try another search.`
                    : "No stories in this filter category."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {storySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStorySearchQuery("")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={openAddStoryModal}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 cursor-pointer"
                  >
                    + Add new story
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#0c101b] border border-white/10 overflow-hidden shadow-lg">
                <div className="divide-y divide-white/5">
                  {filteredStories.map((story) => {
                    const originalIdx = stories.findIndex((s) => s.id === story.id);
                    return (
                      <div
                        key={story.id || originalIdx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#121929]/70 transition-colors"
                      >
                        {/* Left: Thumbnail & Details */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          {/* Thumbnail */}
                          <div
                            onClick={() => openEditStoryModal(originalIdx)}
                            className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0 cursor-pointer group"
                            title="Click to edit story"
                          >
                            {story.imageUrl ? (
                              <Image
                                src={story.imageUrl}
                                alt={story.title}
                                fill
                                sizes="80px"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Text info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                                {story.category || "News"}
                              </span>

                              {story.isHero && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/30">
                                  <span>&#9733;</span>
                                  <span>Hero #{story.heroNumber || "01"}</span>
                                </span>
                              )}

                              {story.isMain && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500/30">
                                  Lead story
                                </span>
                              )}

                              <span className="text-[11px] text-slate-500">
                                {story.date || "May 2026"} &bull; {story.readTime || "3 min read"}
                              </span>
                            </div>

                            <h3
                              onClick={() => openEditStoryModal(originalIdx)}
                              className="text-sm font-semibold text-white hover:text-blue-400 transition cursor-pointer truncate"
                              title={story.title}
                            >
                              {story.title || "Untitled Story"}
                            </h3>

                            {story.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                                {story.description}
                              </p>
                            )}

                            <div className="mt-1 flex items-center gap-2">
                              <Link
                                href={`/stories/${story.slug}`}
                                target="_blank"
                                className="text-[11px] font-mono text-slate-500 hover:text-blue-400 transition flex items-center gap-1"
                              >
                                <span>/stories/{story.slug}</span>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          {/* Quick Toggle Hero Carousel */}
                          <button
                            type="button"
                            onClick={() => handleToggleHeroDirect(originalIdx)}
                            title={story.isHero ? "Remove from Hero Carousel" : "Add to Hero Carousel"}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border flex items-center gap-1 ${
                              story.isHero
                                ? "bg-blue-950/60 text-blue-300 border-blue-500/40 hover:bg-blue-900/40"
                                : "bg-slate-900 text-slate-400 hover:text-white border-white/10"
                            }`}
                          >
                            <span>&#9733;</span>
                            <span className="hidden md:inline">
                              {story.isHero ? "Hero active" : "Make Hero"}
                            </span>
                          </button>

                          {/* Reorder buttons */}
                          <button
                            type="button"
                            onClick={() => handleMoveStory(originalIdx, "up")}
                            disabled={originalIdx === 0}
                            title="Move story up"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStory(originalIdx, "down")}
                            disabled={originalIdx === stories.length - 1}
                            title="Move story down"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &darr;
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteStoryWithConfirm(originalIdx)}
                            title="Delete story"
                            className="w-7 h-7 rounded bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          {/* Edit Button (Prominent, Opens Modal) */}
                          <button
                            type="button"
                            onClick={() => openEditStoryModal(originalIdx)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-950/40"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* EDIT & ADD STORY MODAL */}
            {/* =================================================================== */}
            {isStoryModalOpen && modalStory && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => {
                  if (e.target === e.currentTarget) closeStoryModal();
                }}
              >
                <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c101b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Sticky Header */}
                  <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                        GX
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                            {modalStoryIdx === null ? "Add new story & blog" : "Edit story details"}
                          </h3>
                          {modalStory.isHero && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/30">
                              Hero carousel active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {modalStory.title ? modalStory.title : "Fill in details below to publish or update."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeStoryModal}
                      aria-label="Close modal"
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-300">
                    {/* Story Essentials */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <span>1. Story Essentials</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Story headline / title <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={modalStory.title}
                          onChange={(e) => updateModalStory("title", e.target.value)}
                          placeholder="e.g. The Witcher 4: New Gameplay Details Revealed"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Category
                          </label>
                          <input
                            type="text"
                            value={modalStory.category}
                            onChange={(e) => updateModalStory("category", e.target.value)}
                            placeholder="News, Hardware, Reviews"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Publication date
                          </label>
                          <input
                            type="text"
                            value={modalStory.date}
                            onChange={(e) => updateModalStory("date", e.target.value)}
                            placeholder="e.g. May 7, 2026"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Estimated read time
                          </label>
                          <input
                            type="text"
                            value={modalStory.readTime}
                            onChange={(e) => updateModalStory("readTime", e.target.value)}
                            placeholder="e.g. 4 min read"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          URL slug path
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-2 rounded-lg bg-[#080b11] border border-white/10 text-slate-500 font-mono text-xs">
                            /stories/
                          </span>
                          <input
                            type="text"
                            value={modalStory.slug || ""}
                            onChange={(e) => handleModalSlugChange(e.target.value)}
                            placeholder="witcher-4-gameplay"
                            className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Dynamic blog page route: <code className="text-blue-400 font-mono">/stories/{modalStory.slug || "your-slug"}</code>
                        </p>
                      </div>

                      {/* Excerpt / Summary */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Story excerpt / summary
                        </label>
                        <textarea
                          rows={2}
                          value={modalStory.description || ""}
                          onChange={(e) => updateModalStory("description", e.target.value)}
                          placeholder="Brief summary displayed on cards, social previews, and under the headline."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Featured Image & Media */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        2. Featured Cover Image
                      </h4>

                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-1 w-full space-y-2">
                          <label className="block text-xs font-medium text-slate-400">
                            Image URL or Upload File
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={modalStory.imageUrl}
                              onChange={(e) => updateModalStory("imageUrl", e.target.value)}
                              placeholder="/images/stories/... or https://..."
                              className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                            />
                            <input
                              ref={modalFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleModalImageUpload(e, "imageUrl")}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => modalFileInputRef.current?.click()}
                              disabled={isUploading}
                              className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 text-xs font-medium border border-white/10 transition cursor-pointer flex-shrink-0"
                            >
                              {isUploading ? "Uploading..." : "Upload image"}
                            </button>
                          </div>
                          {uploadError && (
                            <p className="text-[11px] text-rose-400">{uploadError}</p>
                          )}
                        </div>

                        {/* Live Thumbnail Preview */}
                        {modalStory.imageUrl && (
                          <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                            <Image
                              src={modalStory.imageUrl}
                              alt="Cover preview"
                              fill
                              sizes="128px"
                              className="object-cover object-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hero Carousel Placement Card */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0e131f] border border-blue-500/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                              3. Hero Carousel Placement
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              modalStory.isHero
                                ? "bg-blue-950 text-blue-300 border border-blue-500/30"
                                : "bg-slate-800 text-slate-400 border border-white/5"
                            }`}>
                              {modalStory.isHero ? "Featured in Carousel" : "Latest stories only"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Feature this story inside the top homepage carousel slider.
                          </p>
                        </div>

                        {/* Toggle Button */}
                        <button
                          type="button"
                          onClick={toggleModalHero}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                            modalStory.isHero
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          <span>&#9733;</span>
                          <span>{modalStory.isHero ? "Hero carousel enabled" : "Make it Hero Carousel"}</span>
                        </button>
                      </div>

                      {/* Expanded Hero Details */}
                      {modalStory.isHero && (
                        <div className="pt-2 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Carousel slide number
                              </label>
                              <input
                                type="text"
                                value={modalStory.heroNumber || "01"}
                                onChange={(e) => updateModalStory("heroNumber", e.target.value)}
                                placeholder="01"
                                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Hero badge label
                              </label>
                              <input
                                type="text"
                                value={modalStory.heroBadge || "Featured story"}
                                onChange={(e) => updateModalStory("heroBadge", e.target.value)}
                                placeholder="Featured story"
                                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Hero CTA button text
                              </label>
                              <input
                                type="text"
                                value={modalStory.heroCtaText || "Read full story"}
                                onChange={(e) => updateModalStory("heroCtaText", e.target.value)}
                                placeholder="Read full story"
                                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Hero carousel custom image (optional override)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={modalStory.heroImageUrl || modalStory.imageUrl}
                                onChange={(e) => updateModalStory("heroImageUrl", e.target.value)}
                                placeholder="Defaults to featured cover image above"
                                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                              />
                              <input
                                ref={modalHeroFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleModalImageUpload(e, "heroImageUrl")}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => modalHeroFileInputRef.current?.click()}
                                disabled={isUploading}
                                className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-medium border border-white/10 transition cursor-pointer flex-shrink-0"
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Blog Content in Markdown */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            4. Full Article Blog Content (Markdown)
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Renders on the dedicated blog page: <code className="text-blue-400 font-mono">/stories/{modalStory.slug}</code>
                          </p>
                        </div>

                        {/* Write vs Preview Tabs */}
                        <div className="flex items-center gap-1 bg-[#080b11] p-1 rounded-lg border border-white/10 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setModalMarkdownTab("write")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalMarkdownTab === "write"
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalMarkdownTab("preview")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalMarkdownTab === "preview"
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Live preview
                          </button>
                        </div>
                      </div>

                      {modalMarkdownTab === "write" ? (
                        <div className="space-y-2">
                          {/* Markdown Toolbar */}
                          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-[#080b11] border border-white/5 text-xs text-slate-400">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1 select-none">
                              Format:
                            </span>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("## ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Heading 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("### ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Heading 3"
                            >
                              H3
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("**", "**")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-bold cursor-pointer"
                              title="Bold"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("*", "*")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition italic cursor-pointer"
                              title="Italic"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("> ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Blockquote"
                            >
                              &ldquo; Quote
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("- ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Bullet List"
                            >
                              &bull; List
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("[", "](https://)")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Link"
                            >
                              Link
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalMarkdown("```\n", "\n```")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-mono cursor-pointer"
                              title="Code Block"
                            >
                              &lt;/&gt;
                            </button>
                          </div>

                          <textarea
                            id="modal-story-markdown-editor"
                            rows={14}
                            value={modalStory.content || ""}
                            onChange={(e) => updateModalStory("content", e.target.value)}
                            placeholder="Write your article in markdown here..."
                            className="w-full px-3.5 py-3 rounded-lg bg-[#080b11] border border-white/10 text-white font-mono text-xs leading-relaxed placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      ) : (
                        <div
                          className="p-5 rounded-lg bg-[#080b11] border border-white/5 min-h-[300px] max-h-[460px] overflow-y-auto text-xs leading-relaxed text-slate-300 prose prose-invert prose-blue max-w-none story-content"
                          dangerouslySetInnerHTML={{ __html: renderedModalMarkdown }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Modal Sticky Footer */}
                  <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky bottom-0 z-20">
                    <div className="flex items-center gap-3">
                      {modalStory.slug && (
                        <Link
                          href={`/stories/${modalStory.slug}`}
                          target="_blank"
                          className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center gap-1"
                        >
                          <span>Preview live page</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      )}

                      {modalStoryIdx !== null && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStoryWithConfirm(modalStoryIdx)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                        >
                          Delete story
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={closeStoryModal}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveModalStory}
                        disabled={isSavingStories}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-950/40 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isSavingStories ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save story</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION 2: TRENDING GAMES MANAGER (LIST & MODAL) */}
        {/* =================================================================== */}
        {activeSection === "games" && (
          <div>
            {/* Header with Title, Stats, and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Trending Games</h2>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                    {games.length} games
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/30">
                    {featuredGamesCount} Featured
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage the homepage Trending Games carousel, poster artwork, and dedicated game hubs.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={openAddGameModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition shadow-md shadow-blue-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add game</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveGames}
                  disabled={isSavingGames}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-white/10 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingGames ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save order</span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setGameFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    gameFilter === "all"
                      ? "bg-slate-800 text-white border border-white/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  All ({games.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGameFilter("featured")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    gameFilter === "featured"
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Featured ({featuredGamesCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGameFilter("standard")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    gameFilter === "standard"
                      ? "bg-slate-800 text-white border border-white/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  Standard ({games.length - featuredGamesCount})
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={gameSearchQuery}
                  onChange={(e) => setGameSearchQuery(e.target.value)}
                  placeholder="Search games by title, genre, or slug..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0c101b] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Games List View */}
            {isLoadingGames ? (
              <div className="py-24 text-center text-xs text-slate-500">Loading trending games...</div>
            ) : filteredGames.length === 0 ? (
              <div className="mt-6 p-12 text-center rounded-xl bg-[#0c101b] border border-white/10">
                <p className="text-sm text-slate-300 font-medium">No trending games found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {gameSearchQuery
                    ? `No game matches "${gameSearchQuery}". Try another search.`
                    : "No games in this filter category."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {gameSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setGameSearchQuery("")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={openAddGameModal}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 cursor-pointer"
                  >
                    + Add new game
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#0c101b] border border-white/10 overflow-hidden shadow-lg">
                <div className="divide-y divide-white/5">
                  {filteredGames.map((game) => {
                    const originalIdx = games.findIndex((g) => g.id === game.id);
                    return (
                      <div
                        key={game.id || originalIdx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#121929]/70 transition-colors"
                      >
                        {/* Left: Poster thumbnail & Details */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          {/* Vertical Poster Thumbnail */}
                          <div
                            onClick={() => openEditGameModal(originalIdx)}
                            className="relative w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0 cursor-pointer group"
                            title="Click to edit game"
                          >
                            {game.imageUrl ? (
                              <Image
                                src={game.imageUrl}
                                alt={game.title}
                                fill
                                sizes="80px"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
                                GX
                              </div>
                            )}
                            {game.isFeatured && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#080b11]/90 flex items-center justify-center text-blue-400 text-[8px]">
                                &#9733;
                              </div>
                            )}
                          </div>

                          {/* Text info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] text-slate-500">
                                #{String(originalIdx + 1).padStart(2, "0")}
                              </span>

                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                                {game.category || "Action / Adventure"}
                              </span>

                              {game.isFeatured && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/30">
                                  <span>&#9733;</span>
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>

                            <h3
                              onClick={() => openEditGameModal(originalIdx)}
                              className="text-sm font-semibold text-white hover:text-blue-400 transition cursor-pointer truncate"
                              title={game.title}
                            >
                              {game.title || "Untitled Game"}
                            </h3>

                            {game.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                                {game.description}
                              </p>
                            )}

                            <div className="mt-1 flex items-center gap-2">
                              <Link
                                href={`/games/${game.slug}`}
                                target="_blank"
                                className="text-[11px] font-mono text-slate-500 hover:text-blue-400 transition flex items-center gap-1"
                              >
                                <span>/games/{game.slug}</span>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          {/* Quick Toggle Featured */}
                          <button
                            type="button"
                            onClick={() => handleToggleFeaturedDirect(originalIdx)}
                            title={game.isFeatured ? "Remove featured status" : "Make featured"}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border flex items-center gap-1 ${
                              game.isFeatured
                                ? "bg-blue-950/60 text-blue-300 border-blue-500/40 hover:bg-blue-900/40"
                                : "bg-slate-900 text-slate-400 hover:text-white border-white/10"
                            }`}
                          >
                            <span>&#9733;</span>
                            <span className="hidden md:inline">
                              {game.isFeatured ? "Featured active" : "Make Featured"}
                            </span>
                          </button>

                          {/* Reorder buttons */}
                          <button
                            type="button"
                            onClick={() => handleMoveGame(originalIdx, "up")}
                            disabled={originalIdx === 0}
                            title="Move game earlier"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveGame(originalIdx, "down")}
                            disabled={originalIdx === games.length - 1}
                            title="Move game later"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &darr;
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGameWithConfirm(originalIdx)}
                            title="Delete game"
                            className="w-7 h-7 rounded bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          {/* Edit Button (Prominent, Opens Modal) */}
                          <button
                            type="button"
                            onClick={() => openEditGameModal(originalIdx)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-950/40"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EDIT & ADD GAME MODAL */}
            {isGameModalOpen && modalGame && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => {
                  if (e.target === e.currentTarget) closeGameModal();
                }}
              >
                <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c101b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Sticky Header */}
                  <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                        GX
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                            {modalGameIdx === null ? "Add new trending game" : "Edit game details"}
                          </h3>
                          {modalGame.isFeatured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/30">
                              Featured in carousel
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {modalGame.title || "Untitled"} &bull; /games/{modalGame.slug}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeGameModal}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-lg leading-none"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
                    {/* General Fields */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          General Game Information
                        </h4>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={modalGame.isFeatured}
                            onChange={toggleModalGameFeatured}
                            className="rounded border-white/20 bg-[#080b11] text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-slate-300">Featured in Carousel</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Game Title</label>
                          <input
                            type="text"
                            value={modalGame.title}
                            onChange={(e) => updateModalGame("title", e.target.value)}
                            placeholder="e.g. GTA VI"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category / Genre</label>
                          <input
                            type="text"
                            value={modalGame.category || ""}
                            onChange={(e) => updateModalGame("category", e.target.value)}
                            placeholder="e.g. Action / Open World"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Slug</label>
                        <div className="flex items-center rounded-lg bg-[#080b11] border border-white/10 overflow-hidden focus-within:border-blue-400 transition">
                          <span className="px-3 text-xs text-slate-500 font-mono select-none">/games/</span>
                          <input
                            type="text"
                            value={modalGame.slug || ""}
                            onChange={(e) => handleModalGameSlugChange(e.target.value)}
                            placeholder="gta-vi"
                            className="w-full py-2.5 pr-3 bg-transparent text-white font-mono text-xs placeholder-slate-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Overview / Tagline</label>
                        <textarea
                          rows={2}
                          value={modalGame.description || ""}
                          onChange={(e) => updateModalGame("description", e.target.value)}
                          placeholder="Brief overview of this title on the homepage carousel..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                    </div>

                    {/* Poster Artwork */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Vertical Poster Artwork (3:4 ratio)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <div className="sm:col-span-3">
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                            {modalGame.imageUrl ? (
                              <Image
                                src={modalGame.imageUrl}
                                alt="Poster Preview"
                                fill
                                sizes="160px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 font-mono">
                                No Poster
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-9 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Poster Image URL</label>
                            <input
                              type="text"
                              value={modalGame.imageUrl || ""}
                              onChange={(e) => updateModalGame("imageUrl", e.target.value)}
                              placeholder="/images/games/gta-vi.jpg"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                            />
                          </div>

                          <div>
                            <input
                              ref={modalGameFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleModalGameImageUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => modalGameFileInputRef.current?.click()}
                              disabled={isUploading}
                              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition cursor-pointer flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{isUploading ? "Uploading..." : "Upload poster image"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Game Hub Content (Markdown) */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Dedicated Game Hub Content
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Rendered when visitors click this game to read reviews, features, and intelligence.
                          </p>
                        </div>

                        <div className="flex items-center gap-1 p-1 bg-[#080b11] rounded-lg border border-white/5">
                          <button
                            type="button"
                            onClick={() => setModalGameMarkdownTab("write")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalGameMarkdownTab === "write"
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalGameMarkdownTab("preview")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalGameMarkdownTab === "preview"
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Preview
                          </button>
                        </div>
                      </div>

                      {modalGameMarkdownTab === "write" ? (
                        <div className="space-y-2">
                          {/* Markdown formatting toolbar */}
                          <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-lg bg-[#080b11] border border-white/5 text-xs text-slate-400">
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("## ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-bold"
                              title="Heading 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("### ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Heading 3"
                            >
                              H3
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("**", "**")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-bold cursor-pointer"
                              title="Bold"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("*", "*")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition italic cursor-pointer"
                              title="Italic"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("> ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Blockquote"
                            >
                              &ldquo; Quote
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("- ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Bullet List"
                            >
                              &bull; List
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("[", "](https://)")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Link"
                            >
                              Link
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalGameMarkdown("```\n", "\n```")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-mono cursor-pointer"
                              title="Code Block"
                            >
                              &lt;/&gt;
                            </button>
                          </div>

                          <textarea
                            id="modal-game-markdown-editor"
                            rows={14}
                            value={modalGame.content || ""}
                            onChange={(e) => updateModalGame("content", e.target.value)}
                            placeholder="Write your game intelligence and reviews in markdown here..."
                            className="w-full px-3.5 py-3 rounded-lg bg-[#080b11] border border-white/10 text-white font-mono text-xs leading-relaxed placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      ) : (
                        <div
                          className="p-5 rounded-lg bg-[#080b11] border border-white/5 min-h-[300px] max-h-[460px] overflow-y-auto text-xs leading-relaxed text-slate-300 prose prose-invert prose-blue max-w-none story-content"
                          dangerouslySetInnerHTML={{ __html: renderedModalGameMarkdown }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Modal Sticky Footer */}
                  <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                      {modalGame.slug && (
                        <Link
                          href={`/games/${modalGame.slug}`}
                          target="_blank"
                          className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center gap-1"
                        >
                          <span>Preview live page</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      )}

                      {modalGameIdx !== null && (
                        <button
                          type="button"
                          onClick={() => handleDeleteGameWithConfirm(modalGameIdx)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                        >
                          Delete game
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={closeGameModal}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveModalGame}
                        disabled={isSavingGames}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-950/40 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isSavingGames ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save game</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION 3: DEEP INDUSTRY ANALYSIS MANAGER (LIST & MODAL) */}
        {/* =================================================================== */}
        {activeSection === "analysis" && (
          <div>
            {/* Header with Title, Stats, and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Deep Industry Analysis</h2>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                    {articles.length} Reports
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage the Deep Industry Analysis feed on the homepage, upload widescreen banners, and write in-depth market reports.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={openAddArticleModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition shadow-md shadow-blue-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add report</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveArticles}
                  disabled={isSavingArticles}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-white/10 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingArticles ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save order</span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setArticleFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    articleFilter === "all"
                      ? "bg-slate-800 text-white border border-white/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  All ({articles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setArticleFilter("Market Report")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    articleFilter === "Market Report"
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  Market Reports
                </button>
                <button
                  type="button"
                  onClick={() => setArticleFilter("Business Insight")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    articleFilter === "Business Insight"
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  Business Insights
                </button>
                <button
                  type="button"
                  onClick={() => setArticleFilter("Developer Interview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    articleFilter === "Developer Interview"
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  Interviews
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  placeholder="Search reports by headline or topic..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0c101b] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Articles List View */}
            {isLoadingArticles ? (
              <div className="py-24 text-center text-xs text-slate-500">Loading industry analysis reports...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="mt-6 p-12 text-center rounded-xl bg-[#0c101b] border border-white/10">
                <p className="text-sm text-slate-300 font-medium">No analysis reports found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {articleSearchQuery
                    ? `No report matches "${articleSearchQuery}". Try another search.`
                    : "No reports in this filter category."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {articleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setArticleSearchQuery("")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={openAddArticleModal}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 cursor-pointer"
                  >
                    + Add new report
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#0c101b] border border-white/10 overflow-hidden shadow-lg">
                <div className="divide-y divide-white/5">
                  {filteredArticles.map((article) => {
                    const originalIdx = articles.findIndex((a) => a.id === article.id);
                    return (
                      <div
                        key={article.id || originalIdx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#121929]/70 transition-colors"
                      >
                        {/* Left: Banner Thumbnail & Details */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          {/* Widescreen Banner Thumbnail */}
                          <div
                            onClick={() => openEditArticleModal(originalIdx)}
                            className="relative w-20 h-13 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0 cursor-pointer group"
                            title="Click to edit report"
                          >
                            {article.imageUrl ? (
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                sizes="100px"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
                                GX
                              </div>
                            )}
                            <div className="absolute top-1 left-1.5 font-mono text-[10px] font-black text-blue-400 bg-black/70 px-1 rounded">
                              {article.number || String(originalIdx + 1).padStart(2, "0")}
                            </div>
                          </div>

                          {/* Text info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] font-bold text-blue-400">
                                #{article.number || String(originalIdx + 1).padStart(2, "0")}
                              </span>

                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                                {article.category || "Market Report"}
                              </span>

                              <span className="text-[11px] text-slate-500">
                                {article.date || "May 2026"} &bull; {article.readTime || "5 min read"}
                              </span>
                            </div>

                            <h3
                              onClick={() => openEditArticleModal(originalIdx)}
                              className="text-sm font-semibold text-white hover:text-blue-400 transition cursor-pointer truncate"
                              title={article.title}
                            >
                              {article.title || "Untitled Report"}
                            </h3>

                            {article.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                                {article.description}
                              </p>
                            )}

                            <div className="mt-1 flex items-center gap-2">
                              <Link
                                href={`/analysis/${article.slug}`}
                                target="_blank"
                                className="text-[11px] font-mono text-slate-500 hover:text-blue-400 transition flex items-center gap-1"
                              >
                                <span>/analysis/{article.slug}</span>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          {/* Reorder buttons */}
                          <button
                            type="button"
                            onClick={() => handleMoveArticle(originalIdx, "up")}
                            disabled={originalIdx === 0}
                            title="Move report up"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveArticle(originalIdx, "down")}
                            disabled={originalIdx === articles.length - 1}
                            title="Move report down"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &darr;
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteArticleWithConfirm(originalIdx)}
                            title="Delete report"
                            className="w-7 h-7 rounded bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          {/* Edit Button (Prominent, Opens Modal) */}
                          <button
                            type="button"
                            onClick={() => openEditArticleModal(originalIdx)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-950/40"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EDIT & ADD ARTICLE MODAL */}
            {isArticleModalOpen && modalArticle && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => {
                  if (e.target === e.currentTarget) closeArticleModal();
                }}
              >
                <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c101b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Sticky Header */}
                  <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                        #{modalArticle.number || "01"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                          {modalArticleIdx === null ? "Add new industry report" : "Edit industry analysis report"}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {modalArticle.title || "Untitled"} &bull; /analysis/{modalArticle.slug}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeArticleModal}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-lg leading-none"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
                    {/* General Fields */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Report Overview
                      </h4>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Headline / Title</label>
                        <input
                          type="text"
                          value={modalArticle.title}
                          onChange={(e) => updateModalArticle("title", e.target.value)}
                          placeholder="e.g. Why Ubisoft Keeps Losing Players"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                          <input
                            type="text"
                            value={modalArticle.category || ""}
                            onChange={(e) => updateModalArticle("category", e.target.value)}
                            placeholder="e.g. Market Report"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
                          <input
                            type="text"
                            value={modalArticle.date || ""}
                            onChange={(e) => updateModalArticle("date", e.target.value)}
                            placeholder="e.g. May 2026"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Read Time</label>
                          <input
                            type="text"
                            value={modalArticle.readTime || ""}
                            onChange={(e) => updateModalArticle("readTime", e.target.value)}
                            placeholder="e.g. 5 min read"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Slug</label>
                        <div className="flex items-center rounded-lg bg-[#080b11] border border-white/10 overflow-hidden focus-within:border-blue-400 transition">
                          <span className="px-3 text-xs text-slate-500 font-mono select-none">/analysis/</span>
                          <input
                            type="text"
                            value={modalArticle.slug || ""}
                            onChange={(e) => handleModalArticleSlugChange(e.target.value)}
                            placeholder="why-ubisoft-keeps-losing-players"
                            className="w-full py-2.5 pr-3 bg-transparent text-white font-mono text-xs placeholder-slate-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Executive Synopsis</label>
                        <textarea
                          rows={2}
                          value={modalArticle.description || ""}
                          onChange={(e) => updateModalArticle("description", e.target.value)}
                          placeholder="Brief executive synopsis of the market trends or engineering breakthrough..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                    </div>

                    {/* Widescreen Banner Artwork */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Widescreen Banner Artwork
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <div className="sm:col-span-4">
                          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                            {modalArticle.imageUrl ? (
                              <Image
                                src={modalArticle.imageUrl}
                                alt="Banner Preview"
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 font-mono">
                                No Banner
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-8 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Banner Image URL</label>
                            <input
                              type="text"
                              value={modalArticle.imageUrl || ""}
                              onChange={(e) => updateModalArticle("imageUrl", e.target.value)}
                              placeholder="/images/industry/ubisoft.jpg"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                            />
                          </div>

                          <div>
                            <input
                              ref={modalArticleFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleModalArticleImageUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => modalArticleFileInputRef.current?.click()}
                              disabled={isUploading}
                              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition cursor-pointer flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{isUploading ? "Uploading..." : "Upload banner image"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Markdown Report Content */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            In-Depth Report Content (Markdown)
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            The full industry intelligence analysis rendered on the report page.
                          </p>
                        </div>

                        <div className="flex items-center gap-1 p-1 bg-[#080b11] rounded-lg border border-white/5">
                          <button
                            type="button"
                            onClick={() => setModalArticleMarkdownTab("write")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalArticleMarkdownTab === "write"
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalArticleMarkdownTab("preview")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalArticleMarkdownTab === "preview"
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Preview
                          </button>
                        </div>
                      </div>

                      {modalArticleMarkdownTab === "write" ? (
                        <div className="space-y-2">
                          {/* Markdown formatting toolbar */}
                          <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-lg bg-[#080b11] border border-white/5 text-xs text-slate-400">
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("## ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-bold"
                              title="Heading 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("### ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Heading 3"
                            >
                              H3
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("**", "**")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-bold cursor-pointer"
                              title="Bold"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("*", "*")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition italic cursor-pointer"
                              title="Italic"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("> ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Blockquote"
                            >
                              &ldquo; Quote
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("- ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Bullet List"
                            >
                              &bull; List
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("[", "](https://)")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Link"
                            >
                              Link
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalArticleMarkdown("```\n", "\n```")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-mono cursor-pointer"
                              title="Code Block"
                            >
                              &lt;/&gt;
                            </button>
                          </div>

                          <textarea
                            id="modal-article-markdown-editor"
                            rows={14}
                            value={modalArticle.content || ""}
                            onChange={(e) => updateModalArticle("content", e.target.value)}
                            placeholder="Write your comprehensive market analysis in markdown here..."
                            className="w-full px-3.5 py-3 rounded-lg bg-[#080b11] border border-white/10 text-white font-mono text-xs leading-relaxed placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      ) : (
                        <div
                          className="p-5 rounded-lg bg-[#080b11] border border-white/5 min-h-[300px] max-h-[460px] overflow-y-auto text-xs leading-relaxed text-slate-300 prose prose-invert prose-blue max-w-none story-content"
                          dangerouslySetInnerHTML={{ __html: renderedModalArticleMarkdown }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Modal Sticky Footer */}
                  <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                      {modalArticle.slug && (
                        <Link
                          href={`/analysis/${modalArticle.slug}`}
                          target="_blank"
                          className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center gap-1"
                        >
                          <span>Preview live page</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      )}

                      {modalArticleIdx !== null && (
                        <button
                          type="button"
                          onClick={() => handleDeleteArticleWithConfirm(modalArticleIdx)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                        >
                          Delete report
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={closeArticleModal}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveModalArticle}
                        disabled={isSavingArticles}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-950/40 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isSavingArticles ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save report</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* SECTION 4: HARDWARE & GEAR                                    */}
        {/* ============================================================= */}
        {activeSection === "hardware" && (
          <div className="space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">Hardware & Gear</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {hardware.length} items
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {hardware.filter((h) => h.isFeatured).length} featured
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage gaming hardware breakdowns, benchmarks, specs, and detailed architecture reviews.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openAddHardwareModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add hardware item</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveHardware}
                  disabled={isSavingHardware}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-white/10 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingHardware ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving order...</span>
                    </>
                  ) : (
                    <span>Save order</span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter pills & Search input */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: `All (${hardware.length})` },
                  { id: "featured", label: `Featured (${hardware.filter((h) => h.isFeatured).length})` },
                  { id: "GPUs & CPUs", label: "GPUs & CPUs" },
                  { id: "Consoles", label: "Consoles" },
                  { id: "Handhelds", label: "Handhelds" },
                  { id: "Peripherals & Monitors", label: "Peripherals & Monitors" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setHardwareFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      hardwareFilter === tab.id
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : "bg-[#0c101b] text-slate-400 hover:text-white hover:bg-slate-800/60 border border-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={hardwareSearchQuery}
                  onChange={(e) => setHardwareSearchQuery(e.target.value)}
                  placeholder="Search hardware by title or specs..."
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-[#0c101b] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Hardware List View */}
            {isLoadingHardware ? (
              <div className="py-24 text-center text-xs text-slate-500">Loading hardware catalog...</div>
            ) : filteredHardware.length === 0 ? (
              <div className="mt-6 p-12 text-center rounded-xl bg-[#0c101b] border border-white/10">
                <p className="text-sm text-slate-300 font-medium">No hardware items found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {hardwareSearchQuery
                    ? `No hardware matches "${hardwareSearchQuery}". Try another search.`
                    : "No hardware in this filter category."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {hardwareSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHardwareSearchQuery("")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={openAddHardwareModal}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 cursor-pointer"
                  >
                    + Add hardware item
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#0c101b] border border-white/10 overflow-hidden shadow-lg">
                <div className="divide-y divide-white/5">
                  {filteredHardware.map((item) => {
                    const originalIdx = hardware.findIndex((h) => h.id === item.id);
                    return (
                      <div
                        key={item.id || originalIdx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#121929]/70 transition-colors"
                      >
                        {/* Left: Thumbnail & Details */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          <div
                            onClick={() => openEditHardwareModal(originalIdx)}
                            className="relative w-20 h-13 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0 cursor-pointer group"
                            title="Click to edit hardware"
                          >
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                sizes="100px"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
                                HW
                              </div>
                            )}
                            <div className="absolute top-1 left-1.5 font-mono text-[10px] font-black text-blue-400 bg-black/70 px-1 rounded">
                              #{String(originalIdx + 1).padStart(2, "0")}
                            </div>
                          </div>

                          {/* Text info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] font-bold text-blue-400">
                                #{String(originalIdx + 1).padStart(2, "0")}
                              </span>

                              {item.isFeatured && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  Featured
                                </span>
                              )}

                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                                {item.category || "Hardware"}
                              </span>

                              {item.specsBadge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                  {item.specsBadge}
                                </span>
                              )}

                              {item.rating && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                                  ★ {item.rating}
                                </span>
                              )}

                              <span className="text-[11px] text-slate-500">
                                {item.date || "May 2026"} &bull; {item.readTime || "5 min read"}
                              </span>
                            </div>

                            <h3
                              onClick={() => openEditHardwareModal(originalIdx)}
                              className="text-sm font-semibold text-white hover:text-blue-400 transition cursor-pointer truncate"
                              title={item.title}
                            >
                              {item.title || "Untitled Hardware"}
                            </h3>

                            {item.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                                {item.description}
                              </p>
                            )}

                            <div className="mt-1 flex items-center gap-2">
                              <Link
                                href={`/hardware/${item.slug}`}
                                target="_blank"
                                className="text-[11px] font-mono text-slate-500 hover:text-blue-400 transition flex items-center gap-1"
                              >
                                <span>/hardware/{item.slug}</span>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveHardware(originalIdx, "up")}
                            disabled={originalIdx === 0}
                            title="Move item up"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveHardware(originalIdx, "down")}
                            disabled={originalIdx === hardware.length - 1}
                            title="Move item down"
                            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            &darr;
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteHardwareWithConfirm(originalIdx)}
                            title="Delete hardware item"
                            className="w-7 h-7 rounded bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditHardwareModal(originalIdx)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-950/40"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EDIT & ADD HARDWARE MODAL */}
            {isHardwareModalOpen && modalHardware && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => {
                  if (e.target === e.currentTarget) closeHardwareModal();
                }}
              >
                <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c101b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Sticky Header */}
                  <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                        #{modalHardwareIdx !== null ? String(modalHardwareIdx + 1).padStart(2, "0") : "+"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                          {modalHardwareIdx === null ? "Add new hardware breakdown" : "Edit hardware item"}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {modalHardware.title || "Untitled"} &bull; /hardware/{modalHardware.slug}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeHardwareModal}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-lg leading-none"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* Primary Info Box */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Hardware Specifications & Placement
                      </h4>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Hardware Title</label>
                        <input
                          type="text"
                          value={modalHardware.title || ""}
                          onChange={(e) => updateModalHardware("title", e.target.value)}
                          placeholder="e.g. GeForce RTX 5090 Blackwell Architectural Breakdown"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                          <select
                            value={modalHardware.category || "GPUs & CPUs"}
                            onChange={(e) => updateModalHardware("category", e.target.value as HardwareItem["category"])}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-400 transition"
                          >
                            <option value="GPUs & CPUs">GPUs & CPUs</option>
                            <option value="Consoles">Consoles</option>
                            <option value="Handhelds">Handhelds</option>
                            <option value="Peripherals & Monitors">Peripherals & Monitors</option>
                            <option value="Build Guides">Build Guides</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Key Specs Badge</label>
                          <input
                            type="text"
                            value={modalHardware.specsBadge || ""}
                            onChange={(e) => updateModalHardware("specsBadge", e.target.value)}
                            placeholder="e.g. RTX 5090 • 32GB GDDR7 • 600W TGP"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Rating / Score</label>
                          <input
                            type="text"
                            value={modalHardware.rating || ""}
                            onChange={(e) => updateModalHardware("rating", e.target.value)}
                            placeholder="e.g. 9.8 / 10"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Publish Date</label>
                          <input
                            type="text"
                            value={modalHardware.date || ""}
                            onChange={(e) => updateModalHardware("date", e.target.value)}
                            placeholder="e.g. May 7, 2026"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Read Time</label>
                          <input
                            type="text"
                            value={modalHardware.readTime || ""}
                            onChange={(e) => updateModalHardware("readTime", e.target.value)}
                            placeholder="e.g. 6 min read"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Slug</label>
                        <div className="flex items-center rounded-lg bg-[#080b11] border border-white/10 overflow-hidden focus-within:border-blue-400 transition">
                          <span className="px-3 text-xs text-slate-500 font-mono select-none">/hardware/</span>
                          <input
                            type="text"
                            value={modalHardware.slug || ""}
                            onChange={(e) => handleModalHardwareSlugChange(e.target.value)}
                            placeholder="geforce-rtx-5090-blackwell-breakdown"
                            className="w-full py-2.5 pr-3 bg-transparent text-white font-mono text-xs placeholder-slate-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(modalHardware.isFeatured)}
                            onChange={(e) => updateModalHardware("isFeatured", e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-900 border-white/20 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-xs text-slate-300 font-medium">
                            Feature this item as the primary showcase on the landing page
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Hardware Summary</label>
                        <textarea
                          rows={2}
                          value={modalHardware.description || ""}
                          onChange={(e) => updateModalHardware("description", e.target.value)}
                          placeholder="Brief technical summary and benchmark verdict..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                    </div>

                    {/* Hardware Photography / Artwork */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Hardware Photography / Banner Artwork
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <div className="sm:col-span-4">
                          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                            {modalHardware.imageUrl ? (
                              <Image
                                src={modalHardware.imageUrl}
                                alt="Hardware Preview"
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 font-mono">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-8 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Hardware Image URL</label>
                            <input
                              type="text"
                              value={modalHardware.imageUrl || ""}
                              onChange={(e) => updateModalHardware("imageUrl", e.target.value)}
                              placeholder="/images/hardware/rtx-5090.jpg"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                            />
                          </div>

                          <div>
                            <input
                              ref={modalHardwareFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleModalHardwareImageUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => modalHardwareFileInputRef.current?.click()}
                              disabled={isUploading}
                              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition cursor-pointer flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{isUploading ? "Uploading..." : "Upload hardware image"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Markdown In-Depth Technical Content */}
                    <div className="p-5 rounded-xl bg-[#0e131f] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            In-Depth Technical Breakdown (Markdown)
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            The full benchmarks, architectural deep dive, and hardware verdict rendered on the page.
                          </p>
                        </div>

                        <div className="flex items-center gap-1 p-1 bg-[#080b11] rounded-lg border border-white/5">
                          <button
                            type="button"
                            onClick={() => setModalHardwareMarkdownTab("write")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalHardwareMarkdownTab === "write"
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalHardwareMarkdownTab("preview")}
                            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                              modalHardwareMarkdownTab === "preview"
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Preview
                          </button>
                        </div>
                      </div>

                      {modalHardwareMarkdownTab === "write" ? (
                        <div className="space-y-2">
                          {/* Markdown formatting toolbar */}
                          <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-lg bg-[#080b11] border border-white/5 text-xs text-slate-400">
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("## ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-bold"
                              title="Heading 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("### ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Heading 3"
                            >
                              H3
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("**", "**")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-bold cursor-pointer"
                              title="Bold"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("*", "*")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition italic cursor-pointer"
                              title="Italic"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("> ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Blockquote"
                            >
                              &ldquo; Quote
                            </button>
                            <span className="text-slate-700">|</span>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("- ")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Bullet List"
                            >
                              &bull; List
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("[", "](https://)")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
                              title="Link"
                            >
                              Link
                            </button>
                            <button
                              type="button"
                              onClick={() => insertModalHardwareMarkdown("```\n", "\n```")}
                              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition font-mono cursor-pointer"
                              title="Code Block"
                            >
                              &lt;/&gt;
                            </button>
                          </div>

                          <textarea
                            id="modal-hardware-markdown-editor"
                            rows={14}
                            value={modalHardware.content || ""}
                            onChange={(e) => updateModalHardware("content", e.target.value)}
                            placeholder="Write comprehensive hardware specs, test suite results, and benchmark verdict in markdown..."
                            className="w-full px-3.5 py-3 rounded-lg bg-[#080b11] border border-white/10 text-white font-mono text-xs leading-relaxed placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                          />
                        </div>
                      ) : (
                        <div
                          className="p-5 rounded-lg bg-[#080b11] border border-white/5 min-h-[300px] max-h-[460px] overflow-y-auto text-xs leading-relaxed text-slate-300 prose prose-invert prose-blue max-w-none story-content"
                          dangerouslySetInnerHTML={{ __html: renderedModalHardwareMarkdown }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Modal Sticky Footer */}
                  <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-[#0e1322]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                      {modalHardware.slug && (
                        <Link
                          href={`/hardware/${modalHardware.slug}`}
                          target="_blank"
                          className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center gap-1"
                        >
                          <span>Preview live page</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      )}

                      {modalHardwareIdx !== null && (
                        <button
                          type="button"
                          onClick={() => handleDeleteHardwareWithConfirm(modalHardwareIdx)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                        >
                          Delete item
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={closeHardwareModal}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveModalHardware}
                        disabled={isSavingHardware}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-950/40 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isSavingHardware ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save hardware item</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* SECTION 5: WRITER PITCHES & SUBMISSIONS                        */}
        {/* ============================================================= */}
        {activeSection === "pitches" && (
          <div className="space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">Writer Pitches</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {pitches.length} total
                  </span>
                  {pendingPitchesCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {pendingPitchesCount} pending review
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage incoming freelance story proposals, investigations, and guide pitches from the Write For Us portal.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/write-for-us"
                  target="_blank"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-white/10 cursor-pointer flex items-center gap-1.5"
                >
                  <span>View submission portal</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>

                <button
                  type="button"
                  onClick={loadPitches}
                  disabled={isLoadingPitches}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-950/40 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isLoadingPitches ? "Refreshing..." : "Refresh list"}</span>
                </button>
              </div>
            </div>

            {/* Filter pills & Search input */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: `All (${pitches.length})` },
                  { id: "pending", label: `Pending (${pitches.filter((p) => p.status === "pending").length})` },
                  { id: "under_review", label: `Under Review (${pitches.filter((p) => p.status === "under_review").length})` },
                  { id: "accepted", label: `Accepted (${pitches.filter((p) => p.status === "accepted").length})` },
                  { id: "declined", label: `Declined (${pitches.filter((p) => p.status === "declined").length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPitchFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      pitchFilter === tab.id
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : "bg-[#0c101b] text-slate-400 hover:text-white hover:bg-slate-800/60 border border-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={pitchSearchQuery}
                  onChange={(e) => setPitchSearchQuery(e.target.value)}
                  placeholder="Search pitches by writer, title, topic..."
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-[#0c101b] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Pitches List View */}
            {isLoadingPitches ? (
              <div className="py-24 text-center text-xs text-slate-500">Loading pitch submissions...</div>
            ) : filteredPitches.length === 0 ? (
              <div className="mt-6 p-12 text-center rounded-xl bg-[#0c101b] border border-white/10">
                <p className="text-sm text-slate-300 font-medium">No pitch submissions found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {pitchSearchQuery
                    ? `No pitch matches "${pitchSearchQuery}". Try another search term.`
                    : "No pitches in this filter status."}
                </p>
                {pitchSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setPitchSearchQuery("")}
                    className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredPitches.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-[#0c101b] border border-white/10 hover:border-white/20 transition space-y-4"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          #{item.id}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                          {item.category}
                        </span>

                        {item.estimatedWords && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/5">
                            {item.estimatedWords}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500">
                          Received {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                          value={item.status}
                          disabled={isSavingPitches}
                          onChange={(e) => handleUpdatePitchStatus(item.id, e.target.value as PitchSubmission["status"])}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition cursor-pointer ${
                            item.status === "pending"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : item.status === "under_review"
                              ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                              : item.status === "accepted"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 border-white/10"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeletePitch(item.id)}
                          title="Delete pitch submission"
                          className="w-7 h-7 rounded bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 text-xs flex items-center justify-center transition cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Title & Author */}
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>
                          Byline: <strong className="text-slate-200">{item.name}</strong>
                        </span>
                        <span>&bull;</span>
                        <a
                          href={`mailto:${item.email}?subject=TheGamerX Pitch: ${encodeURIComponent(item.title)}`}
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{item.email}</span>
                        </a>

                        {item.portfolioUrl && (
                          <>
                            <span>&bull;</span>
                            <a
                              href={item.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-300 hover:text-white hover:underline flex items-center gap-1"
                            >
                              <span>Portfolio / Social</span>
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Pitch Outline Content */}
                    <div className="p-4 rounded-lg bg-[#080b11] border border-white/5 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {item.pitch}
                    </div>

                    {item.samples && (
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Writing Samples:</span>{" "}
                        <span className="font-mono text-[11px] text-blue-300 break-all">{item.samples}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
