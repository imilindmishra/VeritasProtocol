// File: frontend/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- ADD THIS NEW FUNCTION ---
export function formatTimeAgo(timestamp: number | bigint): string {
  const now = new Date();
  const date = new Date(Number(timestamp) * 1000);
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return "Market closed";
  }

  const days = Math.floor(diffInSeconds / (60 * 60 * 24));
  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;

  const hours = Math.floor(diffInSeconds / (60 * 60));
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  
  return "Closing soon";
}