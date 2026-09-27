"use client";

import React, { useState } from "react";
import { NEWSLETTER_DATA } from "../data/landingData";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl bg-[#0b101c] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.06)] p-6 sm:p-8 lg:p-10 overflow-hidden">
        {/* Ambient background glow accents */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Column: Mail Icon & Message */}
          <div className="flex items-start gap-4 sm:gap-5 max-w-xl">
            {/* Circular Mail Icon Badge */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-cyan-400 block mb-1">
                {NEWSLETTER_DATA.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {NEWSLETTER_DATA.heading}
              </h3>
            </div>
          </div>

          {/* Right Column: Form & Trust Checkmarks */}
          <div className="w-full lg:w-auto flex flex-col gap-3">
            {submitted ? (
              <div className="flex items-center gap-2 p-3.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-sm font-semibold">
                <svg
                  className="w-5 h-5 text-cyan-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Thank you for subscribing! Check your inbox soon.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch gap-2.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={NEWSLETTER_DATA.placeholder}
                  className="px-4 py-3 rounded-lg bg-[#070b14] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all min-w-[260px] sm:min-w-[300px]"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer active:scale-95 text-center"
                >
                  {NEWSLETTER_DATA.buttonText}
                </button>
              </form>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-slate-400 font-medium pt-1">
              {NEWSLETTER_DATA.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
