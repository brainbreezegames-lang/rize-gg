import { clsx, type ClassValue } from "clsx";
import type { SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmojiFlag(value?: string | null) {
  if (!value) return false;
  return /^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(value);
}

export function setImageFallback(
  event: SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.src = fallbackSrc;
}
