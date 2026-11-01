"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Newsletter from "../../components/Newsletter";
import { PitchSubmission } from "../../types";

const EDITORIAL_PILLARS = [
  {
    id: "industry",
    title: "Deep Industry & Market Analysis",
    badge: "BUSINESS & TECH",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    description:
      "Studio financials, executive moves, engine licensing shifts, acquisition fallout, and post-mortems of industry-defining decisions.",
    examples: [
      "Why Unreal Engine 5's Nanite is Shifting Open-World Production Economics",
      "The Mid-Budget Renaissance: How AA Studios Out-Iterate $200M Blockbusters",
      "The Anatomy of a Studio Closure: When Publisher Overhead Breaks Creative Vision",
    ],
  },
  {
    id: "hardware",
    title: "Hardware Teardowns & Benchmarks",
    badge: "SILICON & BENCHMARKS",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description:
      "Architectural deep dives into GPUs, handheld APU watt-to-frame ratios, custom console silicon, display latency, and thermal benchmarks.",
    examples: [
      "PS5 Pro PSSR vs DLSS 3.7: Frame Timing & Ray Reconstruction Tested",
      "Why Handheld APUs Are Hitting a Thermal Ceiling: The 25W Stagnation",
      "OLED 480Hz vs Fast IPS: The Esports Latency Paradox Explained",
    ],
  },
  {
    id: "features",
    title: "Longform Retrospectives & Cultural Essays",
    badge: "CRITIQUE & ESSAYS",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description:
      "Deeply researched investigations into forgotten franchises, spatial level design philosophy, developer retrospectives, and gaming subcultures.",
    examples: [
      "The Architecture of Fear: Why Dead Space's USG Ishimura Still Outclasses Modern Sci-Fi",
      "The Lost Art of Spatial Audio in 90s Immersive Sims",
      "10 Years After Bloodborne: Why Modern Action RPGs Still Chase Yharnam",
    ],
  },
  {
    id: "guides",
    title: "High-Tier Guides & Meta Breakdowns",
    badge: "COMPETITIVE & MECHANICS",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    description:
      "Frame-by-frame mechanic teardowns, competitive meta analysis, speedrun routing theory, and masterclasses by ranked high-tier players.",
    examples: [
      "Marvel Rivals Movement Tech: Mechanics the Pro Circuit is Exploiting",
      "Frame Advantage & Hitbox Manipulation in Modern Fighting Games",
      "Path of Exile 2 Crafting Math: Breaking Down Optimal Currency Loops",
    ],
  },
];

const FAQS = [
  {
    q: "How much does TheGamerX pay freelance contributors?",
    a: "We believe great writers deserve fair, transparent compensation. Standard features (800–1,200 words) pay $100–$150. In-depth technical breakdowns and benchmarks (1,500–2,500 words) pay $200–$350+. Extensive investigative reports with primary source interviews can earn higher negotiated rates.",
  },
  {
    q: "How fast will I hear back about my pitch?",
    a: "Our editorial desk reviews pitches on Tuesdays and Fridays. You will receive an acceptance, request for revision, or polite pass within 48 hours. If approved, we will pair you with a senior editor who will issue a commissioning brief.",
  },
  {
    q: "Do I have to be a published journalist or work in the US/UK?",
    a: "Not at all. We value insight, passion, and technical accuracy above traditional credentials. We accept and commission writers worldwide. Payments are sent via PayPal, Wise, or direct electronic bank transfer within 14 days of publication.",
  },
  {
    q: "Can I use AI tools (ChatGPT, Claude) to write my draft?",
    a: "No. TheGamerX enforces a strict zero-AI tolerance policy for submitted articles. Every submission is analyzed with origin telemetry and reviewed by human copy editors. We want your authentic voice, personal gameplay experience, and real technical expertise.",
  },
  {
    q: "Who retains the copyright of my article?",
    a: "TheGamerX purchases first worldwide digital publishing rights and exclusivity for 90 days. After 90 days, you are free to reprint the piece in a portfolio, personal blog, or anthology with a canonical reference link to TheGamerX.",
  },
];

export default function WriteForUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolioUrl: "",
    category: "Features & Essays" as PitchSubmission["category"],
    title: "",
    pitch: "",
    samples: "",
    estimatedWords: "1,200 - 1,800 words",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionResult, setSubmissionResult] = useState<PitchSubmission | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name or byline.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid contact email address.");
      return;
    }
    if (!formData.title.trim()) {
      setErrorMessage("Please provide a proposed working title.");
      return;
    }
    if (!formData.pitch.trim() || formData.pitch.trim().length < 40) {
      setErrorMessage("Please outline your story pitch (minimum 40 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/write-for-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult(data.submission);
        window.scrollTo({ top: 400, behavior: "smooth" });
      } else {
        setErrorMessage(data.message || "Failed to submit pitch. Please try again.");
      }
    } catch {
      setErrorMessage("Network error connecting to editorial server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setFormData({
      name: "",
      email: "",
      portfolioUrl: "",
      category: "Features & Essays",
      title: "",
      pitch: "",
      samples: "",
      estimatedWords: "1,200 - 1,800 words",
    });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#080b11] py-16 sm:py-24">
          {/* Ambient Glow Effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d121f] border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Editorial Network • Freelance Submissions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight sm:leading-none">
              Write For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">TheGamerX</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We pay competitive freelance rates for industry investigations, game engine breakdowns, hardware benchmarks, and nuanced gaming critique. Pitch your ideas to over <strong className="text-white">500,000+ monthly readers</strong>.
            </p>

            {/* 4 Value Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-[#0c101b]/80 border border-white/10 text-left hover:border-blue-500/40 transition">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Pay Rates</div>
                <div className="text-lg font-black text-white">$100 – $350+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Per accepted article</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c101b]/80 border border-white/10 text-left hover:border-blue-500/40 transition">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Fast Review</div>
                <div className="text-lg font-black text-white">48 Hours</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Turnaround on pitches</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c101b]/80 border border-white/10 text-left hover:border-blue-500/40 transition">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Audience</div>
                <div className="text-lg font-black text-white">500K+ Reach</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Global gaming traffic</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c101b]/80 border border-white/10 text-left hover:border-blue-500/40 transition">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Recognition</div>
                <div className="text-lg font-black text-white">Full Byline</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Author profile & portfolio</div>
              </div>
            </div>

            {/* Quick jump to form */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="#pitch-form"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/40 cursor-pointer flex items-center gap-2"
              >
                <span>Submit A Pitch Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a
                href="#editorial-pillars"
                className="px-5 py-3 rounded-xl bg-[#0c101b] hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs tracking-wider transition"
              >
                Editorial Guidelines
              </a>
            </div>
          </div>
        </section>

        {/* EDITORIAL PILLARS */}
        <section id="editorial-pillars" className="py-16 sm:py-20 border-b border-white/10 bg-[#080b11]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">What We Publish</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
                Our Four Core Editorial Pillars
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                We do not want re-written press releases or generic Top 10 listicles. We want distinctive angles, strong arguments, and real expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EDITORIAL_PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className="p-6 rounded-2xl bg-[#0c101b] border border-white/10 hover:border-blue-500/40 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Sample Pitches We Would Greenlight:
                    </span>
                    <ul className="space-y-1.5">
                      {pillar.examples.map((ex, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-blue-500 font-bold">&rsaquo;</span>
                          <span className="italic">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Standards & What We Reject Box */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-rose-950/20 via-[#0c101b] to-rose-950/20 border border-rose-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-lg flex-shrink-0">
                  !
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    What We Strictly Do NOT Accept
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    To maintain high journalistic trust, please note: We <strong className="text-rose-400">do not accept</strong> AI-generated text, articles sponsored by commercial affiliate networks posing as editorial reviews, plagiarism of existing reporting without attribution, or rumor aggregations with zero firsthand sourcing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW TIMELINE */}
        <section className="py-16 sm:py-20 border-b border-white/10 bg-[#090d15]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Transparent Process</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
                How It Works: Pitch To Payout
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Submit Your Pitch",
                  desc: "Fill in the pitch outline below with your angle, estimated word count, and writing samples.",
                },
                {
                  step: "02",
                  title: "Editorial Greenlight",
                  desc: "Our senior editor responds within 48 hours to refine the angle, set the deadline, and confirm the pay rate.",
                },
                {
                  step: "03",
                  title: "Drafting & Polish",
                  desc: "Submit your draft in Markdown or Google Docs. We work with you on formatting, custom hero art, and copy edits.",
                },
                {
                  step: "04",
                  title: "Publish & Pay",
                  desc: "Your piece is published to 500K+ readers with your author byline. Payment is issued via PayPal, Wise, or Wire within 14 days.",
                },
              ].map((s) => (
                <div key={s.step} className="p-5 rounded-2xl bg-[#0c101b] border border-white/10 relative">
                  <div className="font-mono text-2xl font-black text-blue-500/40 mb-2">
                    {s.step}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PITCH SUBMISSION FORM */}
        <section id="pitch-form" className="py-16 sm:py-24 border-b border-white/10 bg-[#080b11]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                Direct Desk Submission
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Pitch The Editors
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Have a compelling gaming story, hardware investigation, or industry essay? Send us your brief below.
              </p>
            </div>

            {/* Success state */}
            {submissionResult ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-[#0c101b] border border-blue-500/40 shadow-2xl text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs">
                  Pitch ID: #{submissionResult.id}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Pitch Received Successfully!
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{submissionResult.name}</strong>. Your pitch for &ldquo;<span className="text-blue-400">{submissionResult.title}</span>&rdquo; has been routed to our editorial desk.
                </p>

                <div className="p-4 rounded-xl bg-[#080b11] border border-white/10 text-xs text-slate-400 max-w-md mx-auto text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Email:</span>
                    <span className="text-white font-medium">{submissionResult.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pillar:</span>
                    <span className="text-white font-medium">{submissionResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Turnaround Expectation:</span>
                    <span className="text-emerald-400 font-medium">Within 48 hours</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider transition cursor-pointer"
                  >
                    Submit another pitch
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-10 rounded-2xl bg-[#0c101b] border border-white/10 shadow-xl space-y-5"
              >
                {errorMessage && (
                  <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <span className="font-bold">Error:</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name / Byline <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Sterling"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex.sterling@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>
                </div>

                {/* Category & Word Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Topic Pillar <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as PitchSubmission["category"],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-400 transition cursor-pointer"
                    >
                      <option value="Industry Analysis">Deep Industry & Market Analysis</option>
                      <option value="Hardware & Tech">Hardware & Benchmarks Breakdown</option>
                      <option value="Features & Essays">Retrospectives & Cultural Essays</option>
                      <option value="Guides & Meta">Competitive Guides & Meta Teardowns</option>
                      <option value="Investigative">Investigative Journalism</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Length / Word Count
                    </label>
                    <select
                      value={formData.estimatedWords}
                      onChange={(e) => setFormData({ ...formData, estimatedWords: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-400 transition cursor-pointer"
                    >
                      <option value="800 - 1,200 words">Standard Article (800 – 1,200 words) &bull; $100-$150</option>
                      <option value="1,200 - 1,800 words">Longform Feature (1,200 – 1,800 words) &bull; $175-$250</option>
                      <option value="2,000+ words">Deep Dive Investigation (2,000+ words) &bull; $300-$350+</option>
                    </select>
                  </div>
                </div>

                {/* Proposed Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Proposed Headline / Working Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Why Handheld APUs Are Hitting a Thermal Ceiling: The 25W Stagnation"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Pitch Synopsis */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Story Synopsis & Outline <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formData.pitch.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    value={formData.pitch}
                    onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                    placeholder="Briefly answer: 1) What is the main thesis or angle? 2) Why is this story relevant right now? 3) What sources, benchmarks, or interviews will you rely on? 4) What is your intended conclusion?"
                    className="w-full px-3.5 py-3 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs leading-relaxed placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Portfolio / Writing Samples (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Portfolio or Social URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://yourportfolio.com or @twitter"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Writing Sample Links (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.samples}
                      onChange={(e) => setFormData({ ...formData, samples: e.target.value })}
                      placeholder="Links to published articles or docs"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b11] border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/40 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending to editorial desk...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Pitch For Editorial Review</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center mt-3">
                    By submitting, you confirm you are the original author and have reviewed our editorial standards.
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 sm:py-20 border-b border-white/10 bg-[#080b11]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Writer FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#0c101b] border border-white/10 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-bold text-white hover:text-blue-400 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-blue-400 font-mono text-base ml-4 flex-shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FORUM COMMUNITY CALLOUT */}
        <section className="py-12 bg-gradient-to-r from-blue-950/30 via-[#0c101b] to-indigo-950/30 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Have a quick discussion or hot take instead?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Not ready for a full commissioned article? Join thousands of gamers on our community forum to discuss theories, hardware setups, and game updates.
            </p>
            <div className="pt-2">
              <Link
                href="/forum"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wide transition border border-white/10"
              >
                <span>Visit TheGamerX Forum &rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

