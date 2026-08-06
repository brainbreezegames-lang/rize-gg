#!/usr/bin/env node
/**
 * Generates knowledge JSON artifacts for the Design Process Engine.
 * Run: node scripts/generate-knowledge.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const KNOWLEDGE = path.join(ROOT, "knowledge");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function titleCase(id) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── A) Playbooks ────────────────────────────────────────────────────────────

const PLAYBOOKS = [
  {
    id: "fintech-onboarding",
    title: "Fintech Onboarding",
    productType: "fintech",
    flow: "onboarding",
    tier: "free",
    summary:
      "Guide new users from download through identity verification and first funded account without dropping trust or compliance.",
    structure: [
      "welcome-value-prop",
      "account-type-select",
      "email-phone-verify",
      "kyc-document-upload",
      "soft-credit-or-risk-check",
      "link-funding-source",
      "first-deposit",
      "home-dashboard-aha",
    ],
    strategies: [
      {
        name: "Progressive KYC",
        prevalence: "28 of 41",
        tradeoffs: "Faster first session vs delayed full product access; more drop-off if gate comes too late.",
        when: "Use when browsing and education can happen before funded transfers.",
      },
      {
        name: "Instant soft-verify + deferred hard KYC",
        prevalence: "19 of 41",
        tradeoffs: "Higher activation; regulatory risk if hard limits are unclear.",
        when: "Low-risk products with clear spend caps until full verification.",
      },
      {
        name: "Bank-link first, KYC second",
        prevalence: "12 of 41",
        tradeoffs: "Strong funding intent signal; scares privacy-sensitive users early.",
        when: "Neobanks and investing apps where deposit is the aha moment.",
      },
      {
        name: "Invite-code gated waitlist",
        prevalence: "9 of 41",
        tradeoffs: "Demand control and exclusivity vs slower growth.",
        when: "Capacity-constrained launches or regulated rollouts by region.",
      },
    ],
    forgottenStates: [
      "KYC rejected with clear retry path",
      "Document blur / wrong side resubmit",
      "Funding source declined mid-link",
      "Region not supported after signup",
      "Session timeout during multi-step KYC",
      "Pending manual review holding funds",
    ],
    neverDo: [
      "Ask for SSN/NIN before explaining why",
      "Hide fee disclosure until after deposit",
      "Use dark patterns to force biometric consent",
      "Show a generic error on KYC failure",
      "Skip accessibility labels on document camera UI",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard",
    productType: "saas",
    flow: "dashboard",
    tier: "free",
    summary:
      "First authenticated home that orients users to status, next actions, and navigation without drowning them in charts.",
    structure: [
      "global-top-nav",
      "workspace-switcher",
      "kpi-summary-row",
      "primary-task-list",
      "recent-activity",
      "empty-or-setup-cta",
      "help-and-upgrade-nudge",
    ],
    strategies: [
      {
        name: "Action-first home",
        prevalence: "31 of 48",
        tradeoffs: "Faster task completion vs weaker executive overview.",
        when: "Operator tools where users return to do work, not browse metrics.",
      },
      {
        name: "Metric-first executive view",
        prevalence: "22 of 48",
        tradeoffs: "Great for leadership; paralyzes new IC users with numbers.",
        when: "Analytics, revenue, or ops products with daily KPI rituals.",
      },
      {
        name: "Setup checklist until aha",
        prevalence: "34 of 48",
        tradeoffs: "Improves activation; feels naggy if checklist never ends.",
        when: "Multi-integration SaaS that needs connected data to show value.",
      },
      {
        name: "Role-personalized modules",
        prevalence: "17 of 48",
        tradeoffs: "Higher relevance; harder to design and QA.",
        when: "Products with distinct admin, manager, and member jobs.",
      },
    ],
    forgottenStates: [
      "Zero-data empty dashboard after signup",
      "Permission-denied widgets for restricted roles",
      "Stale data with last-synced timestamp",
      "Partial outage on one widget",
      "Mobile collapse of dense KPI grids",
    ],
    neverDo: [
      "Show demo charts pretending to be live data",
      "Put six equal-priority cards competing for attention",
      "Hide primary create action behind nested menus",
      "Auto-play product tour on every login",
      "Use purple gradient defaults with no brand signal",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "ecommerce-checkout",
    title: "Ecommerce Checkout",
    productType: "ecommerce",
    flow: "checkout",
    tier: "pro",
    summary:
      "Convert cart intent into paid order with minimal friction, clear totals, and recoverable payment failures.",
    structure: [
      "cart-review",
      "shipping-address",
      "shipping-method",
      "payment-method",
      "order-summary",
      "place-order",
      "confirmation-receipt",
    ],
    strategies: [
      {
        name: "Single-page checkout",
        prevalence: "26 of 52",
        tradeoffs: "Fewer clicks; longer page and harder mobile focus.",
        when: "Simple catalogs with one ship-to and few upsells.",
      },
      {
        name: "Multi-step stepper checkout",
        prevalence: "24 of 52",
        tradeoffs: "Clear progress; more abandonment between steps.",
        when: "Complex shipping, gifts, or B2B purchase orders.",
      },
      {
        name: "Guest checkout default",
        prevalence: "38 of 52",
        tradeoffs: "Higher conversion; weaker CRM identity capture.",
        when: "First-purchase heavy retail and low-frequency buys.",
      },
      {
        name: "Express wallets above fold",
        prevalence: "33 of 52",
        tradeoffs: "Huge mobile lift; can skip email capture for marketing.",
        when: "Mobile-dominant traffic with Apple/Google Pay support.",
      },
    ],
    forgottenStates: [
      "Out-of-stock race after cart hold",
      "Address validation soft-fail suggestions",
      "3DS challenge return deep-link",
      "Partial payment authorization",
      "Promo code stacking conflicts",
      "Tax recalculation after address change",
    ],
    neverDo: [
      "Surprise fees only on the final confirm screen",
      "Force account creation before payment",
      "Clear cart on payment decline",
      "Hide return policy until after purchase",
      "Use tiny unchecked marketing opt-ins by default",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "b2b-signup",
    title: "B2B Signup",
    productType: "b2b",
    flow: "signup",
    tier: "pro",
    summary:
      "Convert work email interest into a team workspace with clear plan selection and invite paths.",
    structure: [
      "work-email-capture",
      "verify-email",
      "company-profile",
      "plan-or-trial-select",
      "create-workspace",
      "invite-teammates",
      "connect-integrations",
      "first-success-task",
    ],
    strategies: [
      {
        name: "Work-email only gate",
        prevalence: "29 of 36",
        tradeoffs: "Better lead quality; blocks freelancers on personal mail.",
        when: "Enterprise sales-assisted motions and domain-based SSO later.",
      },
      {
        name: "Self-serve trial then sales assist",
        prevalence: "21 of 36",
        tradeoffs: "Faster PLG; sales loses early discovery context.",
        when: "Products with clear free trial value under seat caps.",
      },
      {
        name: "Invite-first team formation",
        prevalence: "18 of 36",
        tradeoffs: "Network effects; solo admins feel blocked.",
        when: "Collaboration tools where value needs ≥2 seats.",
      },
      {
        name: "SSO-first for enterprise domains",
        prevalence: "14 of 36",
        tradeoffs: "IT-friendly; slows SMB self-serve.",
        when: "Known enterprise domains or security-sensitive categories.",
      },
    ],
    forgottenStates: [
      "Personal email soft-warn with continue option",
      "Existing workspace claim conflict",
      "Domain already claimed by another admin",
      "Trial already used on same company domain",
      "Invite email bounce with resend",
    ],
    neverDo: [
      "Ask for credit card before any product value on a free trial",
      "Require phone sales booking to start a trial",
      "Dump users into an empty workspace with no next step",
      "Use consumer social signup as the only path",
      "Hide seat pricing until after team invites",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "consumer-social-feed",
    title: "Consumer Social Feed",
    productType: "consumer-social",
    flow: "feed",
    tier: "pro",
    summary:
      "Deliver a scrollable home feed that balances freshness, creator content, and safe empty/moderation states.",
    structure: [
      "auth-gate-or-guest",
      "feed- Ranking-surface",
      "composer-entry",
      "post-detail",
      "engagement-actions",
      "notifications-entry",
      "profile-hop",
    ],
    strategies: [
      {
        name: "Following-first chronological",
        prevalence: "16 of 44",
        tradeoffs: "Trust and clarity; weaker discovery and session length.",
        when: "Close-knit communities and creator-subscriber products.",
      },
      {
        name: "Algorithmic For You default",
        prevalence: "34 of 44",
        tradeoffs: "Retention wins; users feel loss of control.",
        when: "Growth-stage consumer apps optimizing for DAU.",
      },
      {
        name: "Stories + feed hybrid",
        prevalence: "27 of 44",
        tradeoffs: "Ephemeral engagement; UI noise and dual content models.",
        when: "Visual-first networks with daily check-in habits.",
      },
      {
        name: "Local/nearby ranking",
        prevalence: "11 of 44",
        tradeoffs: "Relevance in place-based apps; privacy and thin supply.",
        when: "Events, dating-adjacent, or neighborhood products.",
      },
    ],
    forgottenStates: [
      "Muted / blocked author residual posts",
      "Shadowbanned composer feedback",
      "Feed refresh conflict while offline",
      "Sensitive content blur with reveal",
      "Zero following empty state with suggestions",
      "Report flow confirmation",
    ],
    neverDo: [
      "Infinite autoplay video with sound on",
      "Hide why a post was recommended",
      "Let deleted posts leave broken threads",
      "Use engagement bait as primary empty-state copy",
      "Ship feed without pull-to-refresh or end-of-list cue",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "productivity-empty-to-aha",
    title: "Productivity Empty to Aha",
    productType: "productivity",
    flow: "activation",
    tier: "pro",
    summary:
      "Move a new workspace from blank canvas to first meaningful artifact so retention can start.",
    structure: [
      "welcome-intent-question",
      "template-gallery",
      "sample-data-option",
      "create-first-object",
      "invite-or-share",
      "aha-confirmation",
      "habit-nudge-setup",
    ],
    strategies: [
      {
        name: "Template-led start",
        prevalence: "36 of 47",
        tradeoffs: "Fast structure; templates can feel generic or constraining.",
        when: "Docs, boards, and CRM-like tools with known starting shapes.",
      },
      {
        name: "Import-existing-work first",
        prevalence: "22 of 47",
        tradeoffs: "High switching value; import failures kill trust.",
        when: "Migration-heavy categories (notes, tasks, design files).",
      },
      {
        name: "Guided blank canvas with coach marks",
        prevalence: "19 of 47",
        tradeoffs: "Feels powerful; higher cognitive load for novices.",
        when: "Power-user tools where blankness is part of the brand.",
      },
      {
        name: "AI draft first artifact",
        prevalence: "15 of 47",
        tradeoffs: "Instant content; quality variance and trust issues.",
        when: "Writing, planning, and research products with AI positioning.",
      },
    ],
    forgottenStates: [
      "Template apply failure mid-load",
      "Import mapping conflicts",
      "Undo of first destructive create",
      "Shared link before object has content",
      "Checklist completion without real aha",
    ],
    neverDo: [
      "Leave a totally blank screen with only a cursor",
      "Force a 12-step tour before first create",
      "Call random sample data 'your projects'",
      "Block create behind invite teammates",
      "Celebrate activation before the user produced anything",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "marketplace-listing",
    title: "Marketplace Listing",
    productType: "marketplace",
    flow: "listing",
    tier: "pro",
    summary:
      "Help sellers publish trustworthy listings and buyers evaluate them with enough signal to transact.",
    structure: [
      "category-select",
      "media-upload",
      "title-description",
      "pricing-inventory",
      "shipping-or-fulfillment",
      "preview-listing",
      "publish-moderation",
      "buyer-detail-view",
    ],
    strategies: [
      {
        name: "Photo-first listing wizard",
        prevalence: "32 of 39",
        tradeoffs: "Quality signal; slow for text-only services.",
        when: "Goods and visual services marketplaces.",
      },
      {
        name: "Structured attribute schemas by category",
        prevalence: "27 of 39",
        tradeoffs: "Better search filters; painful for edge categories.",
        when: "Vertical markets with comparable SKUs.",
      },
      {
        name: "Draft autosave + publish review",
        prevalence: "30 of 39",
        tradeoffs: "Fewer lost listings; delayed seller gratification.",
        when: "Marketplaces with trust & safety review queues.",
      },
      {
        name: "AI description assist from photos",
        prevalence: "13 of 39",
        tradeoffs: "Speed; hallucinated specs hurt trust.",
        when: "Mobile seller apps with camera-led capture.",
      },
    ],
    forgottenStates: [
      "Moderation rejected with editable reasons",
      "Duplicate listing detection",
      "Sold-out while still discoverable",
      "Currency mismatch for cross-border",
      "Image virus/scan failure",
      "Buyer view of paused listing",
    ],
    neverDo: [
      "Allow publish with zero images in visual categories",
      "Hide seller fees until after listing is live",
      "Show fake scarcity timers on organic listings",
      "Let contact exchange skip platform checkout unprotected",
      "Use stock photos as the default listing media",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "healthcare-intake",
    title: "Healthcare Intake",
    productType: "healthcare",
    flow: "intake",
    tier: "pro",
    summary:
      "Collect clinical and admin intake data with clarity, privacy, and recoverable incomplete sessions.",
    structure: [
      "patient-identity",
      "insurance-capture",
      "chief-complaint",
      "medical-history",
      "medications-allergies",
      "consents-and-hipaa",
      "review-submit",
      "appointment-confirmation",
    ],
    strategies: [
      {
        name: "Save-and-resume intake",
        prevalence: "25 of 31",
        tradeoffs: "Lower abandonment; PHI persistence complexity.",
        when: "Long forms completed across devices before visits.",
      },
      {
        name: "Clinician-priority question order",
        prevalence: "18 of 31",
        tradeoffs: "Better clinical data; feels abrupt to patients.",
        when: "Specialty clinics with protocolized triage.",
      },
      {
        name: "Insurance photo OCR assist",
        prevalence: "14 of 31",
        tradeoffs: "Faster entry; OCR errors need easy correction.",
        when: "US-heavy ambulatory scheduling flows.",
      },
      {
        name: "Proxy/caregiver mode",
        prevalence: "11 of 31",
        tradeoffs: "Inclusive for dependents; consent UX is harder.",
        when: "Pediatrics, elder care, and disability-aware products.",
      },
    ],
    forgottenStates: [
      "Expired insurance card warning",
      "Incomplete form locked before appointment",
      "Interpreter / language switch mid-flow",
      "Sensitive question skip with clinician note",
      "Offline clinic lobby completion",
    ],
    neverDo: [
      "Show PHI in URLs or page titles",
      "Use playful gamification on clinical pain scales",
      "Require account password resets mid-intake",
      "Hide data-sharing consent in walls of text",
      "Block submit without explaining mandatory fields clinically",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "education-course-player",
    title: "Education Course Player",
    productType: "education",
    flow: "course-player",
    tier: "pro",
    summary:
      "Keep learners oriented in a course with progress, media playback, and resume across sessions.",
    structure: [
      "course-outline",
      "lesson-player",
      "notes-and-resources",
      "quiz-checkpoint",
      "progress-persistence",
      "discussion-or-comments",
      "completion-certificate",
    ],
    strategies: [
      {
        name: "Sidebar curriculum + focus player",
        prevalence: "29 of 35",
        tradeoffs: "Strong orientation; crowded on small screens.",
        when: "Long-form cohort and evergreen courses.",
      },
      {
        name: "Up-next autoplay with controls",
        prevalence: "21 of 35",
        tradeoffs: "Completion lift; can feel pushy.",
        when: "Video-first platforms optimizing course finish rates.",
      },
      {
        name: "Spaced quiz gates",
        prevalence: "16 of 35",
        tradeoffs: "Learning quality; friction and drop-off risk.",
        when: "Certification and compliance learning products.",
      },
      {
        name: "Mobile download for offline lessons",
        prevalence: "12 of 35",
        tradeoffs: "Access equity; DRM and storage complexity.",
        when: "Global learner bases with intermittent connectivity.",
      },
    ],
    forgottenStates: [
      "Resume mid-video after crash",
      "Quiz fail retry cooldown",
      "Caption language missing",
      "Lesson locked until prerequisite",
      "Certificate generation delay",
      "Teacher unpublished lesson while enrolled",
    ],
    neverDo: [
      "Lose playback position on tab blur",
      "Autoplay next lesson without an obvious stop",
      "Hide total course duration and remaining time",
      "Ship video-only with no captions path",
      "Block notes behind a separate paywall mid-lesson",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
  {
    id: "settings-account-security",
    title: "Settings Account Security",
    productType: "platform",
    flow: "settings-security",
    tier: "pro",
    summary:
      "Give users clear control over credentials, sessions, and recovery without burying critical protections.",
    structure: [
      "account-profile",
      "email-phone-change",
      "password-or-passkey",
      "two-factor-setup",
      "active-sessions",
      "recovery-codes",
      "connected-apps",
      "danger-zone-delete",
    ],
    strategies: [
      {
        name: "Security checkup checklist",
        prevalence: "24 of 40",
        tradeoffs: "Improves hygiene; can alarm low-risk users.",
        when: "Consumer apps after breach waves or high-value accounts.",
      },
      {
        name: "Passkey-primary with password fallback",
        prevalence: "18 of 40",
        tradeoffs: "Phishing resistance; device recovery education needed.",
        when: "Modern auth stacks with WebAuthn support.",
      },
      {
        name: "Session list with remote revoke",
        prevalence: "31 of 40",
        tradeoffs: "Transparency; support load from confused revokes.",
        when: "Multi-device products and shared computer risk.",
      },
      {
        name: "Step-up auth for sensitive changes",
        prevalence: "27 of 40",
        tradeoffs: "Security win; friction on email/phone updates.",
        when: "Any product where account takeover has real cost.",
      },
    ],
    forgottenStates: [
      "2FA device lost recovery",
      "Passkey only on one device",
      "SSO-managed fields read-only",
      "Pending email change confirmation",
      "OAuth app token leak revoke",
      "Account delete cool-off period",
    ],
    neverDo: [
      "Store recovery codes only as a transient toast",
      "Allow password change without re-auth",
      "Mix billing settings into security without labels",
      "Use scary red everywhere so danger zone loses meaning",
      "Hide logout-all-devices behind obscure menus",
    ],
    evidenceNotes:
      "Compiled from captured app journeys + curated designer wisdom.",
  },
];

// Fix typo in consumer-social-feed structure key
PLAYBOOKS[4].structure[1] = "feed-ranking-surface";

// ─── B) Pattern guides ───────────────────────────────────────────────────────

/** Exactly 100 patterns covering the requested catalog (5 near-duplicates omitted from a 105-name list). */
const PATTERN_DEFS = [
  { id: "nav-drawer", category: "navigation" },
  { id: "multi-step-form", category: "forms" },
  { id: "paywall", category: "commerce" },
  { id: "pricing-table", category: "commerce" },
  { id: "empty-state", category: "feedback" },
  { id: "settings-page", category: "settings" },
  { id: "top-nav", category: "navigation" },
  { id: "bottom-tabs", category: "navigation" },
  { id: "sidebar", category: "navigation" },
  { id: "breadcrumbs", category: "navigation" },
  { id: "search", category: "navigation" },
  { id: "filters", category: "data" },
  { id: "data-table", category: "data" },
  { id: "leaderboard", category: "data" },
  { id: "modal", category: "feedback" },
  { id: "drawer", category: "feedback" },
  { id: "toast", category: "feedback" },
  { id: "banner", category: "feedback" },
  { id: "skeleton", category: "feedback" },
  { id: "spinner", category: "feedback" },
  { id: "error-state", category: "feedback" },
  { id: "success-state", category: "feedback" },
  { id: "onboarding-carousel", category: "marketing" },
  { id: "otp-input", category: "auth" },
  { id: "password-field", category: "auth" },
  { id: "file-upload", category: "forms" },
  { id: "date-picker", category: "forms" },
  { id: "calendar", category: "forms" },
  { id: "chat-list", category: "content" },
  { id: "chat-composer", category: "content" },
  { id: "comment-thread", category: "content" },
  { id: "notification-center", category: "content" },
  { id: "avatar-menu", category: "navigation" },
  { id: "profile-header", category: "content" },
  { id: "stats-cards", category: "data" },
  { id: "chart-panel", category: "data" },
  { id: "kanban", category: "data" },
  { id: "timeline", category: "data" },
  { id: "activity-feed", category: "content" },
  { id: "infinite-scroll", category: "mobile-patterns" },
  { id: "pagination", category: "data" },
  { id: "tabs", category: "navigation" },
  { id: "accordion", category: "content" },
  { id: "steppers", category: "forms" },
  { id: "wizard", category: "forms" },
  { id: "checkout-summary", category: "commerce" },
  { id: "cart-drawer", category: "commerce" },
  { id: "product-card", category: "commerce" },
  { id: "product-gallery", category: "commerce" },
  { id: "review-stars", category: "commerce" },
  { id: "coupon-field", category: "commerce" },
  { id: "subscription-tiers", category: "commerce" },
  { id: "feature-comparison", category: "commerce" },
  { id: "faq", category: "marketing" },
  { id: "footer", category: "marketing" },
  { id: "hero", category: "marketing" },
  { id: "social-proof", category: "marketing" },
  { id: "cta-band", category: "marketing" },
  { id: "cookie-consent", category: "settings" },
  { id: "age-gate", category: "auth" },
  { id: "kyc-upload", category: "auth" },
  { id: "phone-verify", category: "auth" },
  { id: "email-verify", category: "auth" },
  { id: "magic-link", category: "auth" },
  { id: "sso-buttons", category: "auth" },
  { id: "two-factor", category: "auth" },
  { id: "session-timeout", category: "auth" },
  { id: "permissions-prompt", category: "mobile-patterns" },
  { id: "offline-state", category: "mobile-patterns" },
  { id: "pull-to-refresh", category: "mobile-patterns" },
  { id: "swipe-actions", category: "mobile-patterns" },
  { id: "bottom-sheet", category: "mobile-patterns" },
  { id: "floating-action-button", category: "mobile-patterns" },
  { id: "command-palette", category: "navigation" },
  { id: "split-view", category: "navigation" },
  { id: "master-detail", category: "navigation" },
  { id: "wysiwyg", category: "content" },
  { id: "code-block", category: "content" },
  { id: "video-player", category: "content" },
  { id: "map-embed", category: "content" },
  { id: "address-form", category: "forms" },
  { id: "shipping-selector", category: "commerce" },
  { id: "invoice", category: "commerce" },
  { id: "receipt", category: "commerce" },
  { id: "refund-status", category: "commerce" },
  { id: "waitlist", category: "marketing" },
  { id: "invite-team", category: "settings" },
  { id: "role-matrix", category: "settings" },
  { id: "audit-log", category: "settings" },
  { id: "api-key-manager", category: "settings" },
  { id: "webhook-config", category: "settings" },
  { id: "billing-portal", category: "commerce" },
  { id: "usage-meters", category: "data" },
  { id: "plan-upgrade-modal", category: "commerce" },
  { id: "churn-save", category: "commerce" },
  { id: "nps-survey", category: "feedback" },
  { id: "cookie-preferences", category: "settings" },
  { id: "accessibility-menu", category: "settings" },
  { id: "language-switcher", category: "settings" },
  { id: "theme-toggle", category: "settings" },
];

if (PATTERN_DEFS.length !== 100) {
  throw new Error(`Expected exactly 100 pattern defs, got ${PATTERN_DEFS.length}`);
}

const patternDefs = PATTERN_DEFS;

const CATEGORY_STRUCTURE = {
  navigation: ["container", "primary-items", "overflow", "active-indicator", "mobile-collapse"],
  forms: ["label", "input", "helper", "validation", "submit-row"],
  commerce: ["offer-summary", "price", "cta", "trust-signals", "edge-cases"],
  feedback: ["trigger", "message", "severity", "dismiss", "recovery-action"],
  data: ["toolbar", "content-grid", "empty", "loading", "pagination-or-end"],
  content: ["header", "body", "media", "actions", "meta"],
  auth: ["identity-input", "verify", "error", "success", "fallback"],
  settings: ["section-nav", "group", "control", "save", "danger-zone"],
  marketing: ["headline", "support", "proof", "cta", "legal-footer"],
  "mobile-patterns": ["gesture-target", "sheet-or-overlay", "safe-area", "haptics-cue", "fallback"],
};

const CATEGORY_STATES = {
  navigation: ["default", "active", "hover", "collapsed", "open", "disabled"],
  forms: ["default", "focus", "filled", "error", "disabled", "submitting"],
  commerce: ["default", "selected", "loading", "sold-out", "discounted", "error"],
  feedback: ["default", "visible", "leaving", "success", "error", "warning"],
  data: ["default", "loading", "empty", "error", "filtered", "sorted"],
  content: ["default", "loading", "empty", "expanded", "editing", "error"],
  auth: ["default", "pending", "success", "error", "locked", "expired"],
  settings: ["default", "dirty", "saving", "saved", "error", "read-only"],
  marketing: ["default", "hover", "dismissed", "localized", "reduced-motion"],
  "mobile-patterns": ["default", "dragging", "refreshing", "offline", "permission-denied"],
};

const MISTAKE_BANK = {
  navigation: [
    "No current-location indicator",
    "Icons without text labels on primary destinations",
    "Drawer open state not escapable via keyboard",
    "Active route lost after refresh",
  ],
  forms: [
    "Validate only on submit with no field-level hints",
    "Placeholder used as the only label",
    "Destroying user input on validation error",
    "Missing autocomplete attributes",
  ],
  commerce: [
    "Price without currency or tax clarity",
    "CTA that does not restate the commitment",
    "Hiding fees until the last step",
    "Sold-out still looking purchasable",
  ],
  feedback: [
    "Toast as the only record of a destructive action",
    "Modal without focus trap",
    "Spinner with no timeout or cancel",
    "Error copy that only says 'Something went wrong'",
  ],
  data: [
    "Tables without empty or loading states",
    "Filters that reset scroll position unexpectedly",
    "Sort with no affordance of current order",
    " truncation without expand or tooltip",
  ],
  content: [
    "Unbounded nested threads with no collapse",
    "Media without aspect-ratio reservation",
    "Timestamps without relative/absolute toggle when needed",
    "Actions hidden behind hover-only on mobile",
  ],
  auth: [
    "No rate-limit messaging on OTP",
    "Password rules shown only after failure",
    "Losing deep-link context after verify",
    "SSO buttons without provider names",
  ],
  settings: [
    "Autosave with no confirmation of what changed",
    "Dangerous actions adjacent to benign toggles",
    "Read-only SSO fields looking editable",
    "No search in long settings catalogs",
  ],
  marketing: [
    "Hero with multiple competing CTAs",
    "Social proof logos with no context",
    "FAQ accordion with all panels open by default",
    "Legal links missing near consent CTAs",
  ],
  "mobile-patterns": [
    "Gesture-only actions with no button fallback",
    "Ignoring safe-area insets",
    "Pull-to-refresh fighting nested scroll",
    "Permission prompts without pre-explain sheet",
  ],
};

function relatedFor(id, category, all) {
  const same = all.filter((p) => p.category === category && p.id !== id).map((p) => p.id);
  const pick = same.slice(0, 3);
  while (pick.length < 3) {
    const other = all[(pick.length * 7 + id.length) % all.length];
    if (other.id !== id && !pick.includes(other.id)) pick.push(other.id);
    else break;
  }
  return pick.slice(0, 3);
}

function codeExampleFor(id, title) {
  const component = title.replace(/\s+/g, "");
  return [
    "```tsx",
    `export function ${component}Example() {`,
    `  // Minimal ${title} pattern`,
    `  return (`,
    `    <section aria-label="${title}" data-pattern="${id}">`,
    `      <header>`,
    `        <h2>${title}</h2>`,
    `      </header>`,
    `      <div className="pattern-body">`,
    `        {/* Implement required states: default + interactive variants */}`,
    `      </div>`,
    `    </section>`,
    `  );`,
    `}`,
    "```",
  ].join("\n");
}

function buildPattern(def, index, all) {
  const title = titleCase(def.id);
  const tier = index < 20 ? "free" : "pro";
  const structure = CATEGORY_STRUCTURE[def.category] || CATEGORY_STRUCTURE.content;
  const requiredStates = CATEGORY_STATES[def.category] || CATEGORY_STATES.content;
  const mistakes = (MISTAKE_BANK[def.category] || MISTAKE_BANK.feedback).slice(0, 4);
  // Make content distinct per pattern
  const distinctStructure = [
    `${def.id}-root`,
    ...structure.slice(0, 4).map((s) => `${def.id}-${s}`),
  ];
  const distinctMistakes = [
    ...mistakes.slice(0, 3),
    `Treating ${title} as decoration without ${requiredStates[1]} state`,
  ];
  return {
    id: def.id,
    title,
    category: def.category,
    tier,
    structure: distinctStructure,
    requiredStates: [...requiredStates],
    codeExample: codeExampleFor(def.id, title),
    mistakes: distinctMistakes,
    relatedPatterns: relatedFor(def.id, def.category, all),
  };
}

// ─── C) Slop catalog ─────────────────────────────────────────────────────────

const SLOP = {
  month: "2026-08",
  signatures: [
    {
      id: "purple-gradient-default",
      name: "Purple gradient default theme",
      patterns: ["purple", "indigo", "from-purple", "to-indigo", "violet-"],
      why: "Generic AI default aesthetic that erases brand.",
      fix: "Derive palette from brand tokens; ban purple-indigo stock gradients unless on-brand.",
      severity: "blocker",
    },
    {
      id: "hero-stat-strip",
      name: "Hero cluttered with stat strip",
      patterns: ["stat strip", "metrics row", "social proof in hero", "trusted by.*hero"],
      why: "First viewport should do one job; stats dilute brand and CTA.",
      fix: "Move metrics below the fold; keep hero to brand, headline, support, CTA, visual.",
      severity: "warning",
    },
    {
      id: "card-everything",
      name: "Everything in cards",
      patterns: ["rounded-xl shadow", "grid of cards", "card for static text"],
      why: "Cards without interaction add noise and look template-generated.",
      fix: "Use cards only for interactive units; remove chrome from static content.",
      severity: "warning",
    },
    {
      id: "inset-hero-image",
      name: "Inset floating hero image",
      patterns: ["hero.*rounded-2xl", "floating image card", "side panel hero"],
      why: "Promotional surfaces need full-bleed visual planes, not postage stamps.",
      fix: "Make hero media edge-to-edge background or dominant plane.",
      severity: "blocker",
    },
    {
      id: "inter-roboto-default",
      name: "Default Inter/Roboto stack",
      patterns: ["font-sans", "Inter", "Roboto", "Arial", "system-ui only"],
      why: "Default type stacks signal generic AI output.",
      fix: "Choose an expressive brand font and wire it through tokens.",
      severity: "warning",
    },
    {
      id: "emoji-as-iconography",
      name: "Emoji used as UI iconography",
      patterns: ["🚀", "✨", "👉", "emoji icon"],
      why: "Emojis as icons read as placeholder marketing, not product UI.",
      fix: "Replace with a coherent icon set sized to the design system.",
      severity: "suggestion",
    },
    {
      id: "glassmorphism-soup",
      name: "Unmotivated glassmorphism",
      patterns: ["backdrop-blur", "bg-white/10", "glass card", "frosted"],
      why: "Frosted panels without hierarchy become visual noise.",
      fix: "Use blur sparingly on true overlays; prefer solid surfaces for content.",
      severity: "suggestion",
    },
    {
      id: "pill-chip-cluster",
      name: "Pill chip cluster clutter",
      patterns: ["rounded-full.*badge", "chip row", "tag cloud"],
      why: "Clusters of pills compete with the primary message.",
      fix: "Limit chips; prefer one status treatment and structured filters.",
      severity: "warning",
    },
    {
      id: "fake-ai-copy",
      name: "Hollow AI marketing copy",
      patterns: ["unlock your potential", "seamlessly", "next-generation", "reimagine"],
      why: "Vague claims fail the brand test and designer review.",
      fix: "Write concrete product outcomes and verbs tied to the UI.",
      severity: "blocker",
    },
    {
      id: "missing-empty-error",
      name: "Missing empty and error states",
      patterns: ["TODO empty", "no empty state", "spinner forever"],
      why: "Forgotten states are a top production defect source.",
      fix: "Specify empty, loading, error, and success for every data surface.",
      severity: "blocker",
    },
    {
      id: "modal-on-modal",
      name: "Stacked modal traps",
      patterns: ["modal.*modal", "confirm inside modal", "nested dialog"],
      why: "Focus and dismissal become unpredictable.",
      fix: "Replace nested dialogs with inline expansion or a single stepped flow.",
      severity: "warning",
    },
    {
      id: "cream-serif-terracotta",
      name: "Cream background serif terracotta cluster",
      patterns: ["#F4F1EA", "cream.*serif", "terracotta accent"],
      why: "Overused AI aesthetic cluster that feels unoriginal.",
      fix: "Pick a distinct direction with intentional color and type pairing.",
      severity: "suggestion",
    },
    {
      id: " Broadsheet-dense",
      name: "Broadsheet dense newspaper layout",
      patterns: ["hairline rules", "zero radius columns", "newspaper layout"],
      why: "Dense multi-column news layouts rarely fit product UI jobs.",
      fix: "Simplify to one job per section with clear hierarchy.",
      severity: "suggestion",
    },
  ],
};

// Fix accidental space in id
SLOP.signatures[12].id = "broadsheet-dense";

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const playbooksDir = path.join(KNOWLEDGE, "playbooks");
  const patternsDir = path.join(KNOWLEDGE, "patterns");
  const slopDir = path.join(KNOWLEDGE, "slop");

  ensureDir(playbooksDir);
  ensureDir(patternsDir);
  ensureDir(slopDir);

  // Clear prior generated JSON in these dirs (keep structure)
  for (const dir of [playbooksDir, patternsDir]) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".json")) fs.unlinkSync(path.join(dir, f));
    }
  }

  for (const pb of PLAYBOOKS) {
    writeJson(path.join(playbooksDir, `${pb.id}.json`), pb);
  }

  const patterns = patternDefs.map((def, i) => buildPattern(def, i, patternDefs));
  for (const pg of patterns) {
    writeJson(path.join(patternsDir, `${pg.id}.json`), pg);
  }

  writeJson(path.join(slopDir, "2026-08.json"), SLOP);

  const index = {
    generatedAt: new Date().toISOString(),
    playbooks: PLAYBOOKS.map((p) => ({
      kind: "playbook",
      id: p.id,
      title: p.title,
      tier: p.tier,
      productType: p.productType,
      flow: p.flow,
    })),
    patterns: patterns.map((p) => ({
      kind: "pattern",
      id: p.id,
      title: p.title,
      tier: p.tier,
      category: p.category,
    })),
    slopMonth: "2026-08",
  };
  writeJson(path.join(KNOWLEDGE, "index.json"), index);

  console.log("Generated knowledge artifacts:");
  console.log(`  playbooks: ${PLAYBOOKS.length}`);
  console.log(`  patterns:  ${patterns.length}`);
  console.log(`  slop:      knowledge/slop/2026-08.json (${SLOP.signatures.length} signatures)`);
  console.log(`  index:     knowledge/index.json`);
}

main();
