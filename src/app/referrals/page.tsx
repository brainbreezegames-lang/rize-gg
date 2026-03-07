"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Copy, Star, Users, Gift, Check } from "lucide-react";

const REFERRAL_LINK = "www.rize.gg/register?code=demo";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Referrals" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Referrals" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Referrals</h1>

          {/* Referral link card */}
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-6 mb-6">
            <h2 className="text-base font-semibold text-text-primary mb-1">Your referral link</h2>
            <p className="text-sm text-text-secondary mb-4">
              Share your link and earn stars when friends join Rize.gg
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-10 px-3 flex items-center rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-secondary select-all">
                {REFERRAL_LINK}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 h-10 px-4 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total referrals</span>
                <Users size={18} className="text-text-tertiary" />
              </div>
              <p className="text-3xl font-bold text-text-primary">0</p>
              <p className="text-xs text-text-secondary">Friends joined</p>
            </div>

            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Stars earned</span>
                <Star size={18} className="text-text-tertiary" />
              </div>
              <p className="text-3xl font-bold text-text-primary">0</p>
              <p className="text-xs text-text-secondary">From referrals</p>
            </div>

            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Rewards unlocked</span>
                <Gift size={18} className="text-text-tertiary" />
              </div>
              <p className="text-3xl font-bold text-text-primary">0</p>
              <p className="text-xs text-text-secondary">Total rewards</p>
            </div>
          </div>

          {/* Referral history */}
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-base font-semibold text-text-primary">Referral history</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Users size={36} className="text-text-tertiary" />
              <p className="text-sm text-text-secondary">No referrals yet.</p>
              <p className="text-xs text-text-tertiary">Share your link to start earning stars!</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
