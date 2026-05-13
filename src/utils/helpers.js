import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes without conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Relative time from ISO string
 */
export function timeAgo(isoString) {
  const ms = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor(ms / 3600000)
  const mins = Math.floor(ms / 60000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}

/**
 * Generate a unique ID
 */
export function genId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Truncate text to a given length
 */
export function truncate(str, len = 100) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

/**
 * Pick a random item from an array
 */
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Delay helper
 */
export const delay = (ms) => new Promise((r) => setTimeout(r, ms))
