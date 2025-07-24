const blacklist = new Set<string>();

export function addToBlacklist(sessionID: string) {
  blacklist.add(sessionID);
}

export function isBlacklisted(sessionID: string): boolean {
  return blacklist.has(sessionID);
}

export function removeFromBlacklist(sessionID: string) {
  blacklist.delete(sessionID);
} 