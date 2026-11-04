/**
 * Persistent localStorage utilities for tracking watched episodes in CineNest Studio.
 * Synchronizes across tabs and components via custom DOM events.
 */

export const WATCHED_STORAGE_KEY = 'cinenest_watched_episodes';
export const WATCHED_CHANGED_EVENT = 'cinenest:watched-changed';

export interface WatchedChangeEventDetail {
  episodeId?: number;
  watched?: boolean;
  watchedIds: number[];
}

/**
 * Retrieves all watched episode IDs from localStorage.
 */
export function getWatchedEpisodes(): number[] {
  try {
    const raw = localStorage.getItem(WATCHED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0);
    }
    return [];
  } catch (err) {
    console.warn('Failed to parse watched episodes from localStorage:', err);
    return [];
  }
}

/**
 * Checks if a specific episode ID is marked as watched.
 */
export function isEpisodeWatched(episodeId: number): boolean {
  const watched = getWatchedEpisodes();
  return watched.includes(episodeId);
}

/**
 * Dispatches an event across window to notify all listening components.
 */
function notifyWatchedChange(episodeId?: number, watched?: boolean, watchedIds?: number[]) {
  const current = watchedIds ?? getWatchedEpisodes();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<WatchedChangeEventDetail>(WATCHED_CHANGED_EVENT, {
        detail: { episodeId, watched, watchedIds: current },
      })
    );
  }
}

/**
 * Sets the watched state for a given episode ID.
 * Returns the updated list of watched episode IDs.
 */
export function setEpisodeWatched(episodeId: number, watched: boolean): number[] {
  const current = getWatchedEpisodes();
  const exists = current.includes(episodeId);

  let updated: number[];
  if (watched && !exists) {
    updated = [...current, episodeId].sort((a, b) => a - b);
  } else if (!watched && exists) {
    updated = current.filter((id) => id !== episodeId);
  } else {
    return current;
  }

  try {
    localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving watched episodes to localStorage:', err);
  }

  notifyWatchedChange(episodeId, watched, updated);
  return updated;
}

/**
 * Toggles the watched state for a given episode ID.
 * Returns boolean representing whether the episode is now watched.
 */
export function toggleEpisodeWatched(episodeId: number): boolean {
  const isWatched = isEpisodeWatched(episodeId);
  const nextState = !isWatched;
  setEpisodeWatched(episodeId, nextState);
  return nextState;
}

/**
 * Marks a collection of episode IDs as watched.
 */
export function markMultipleEpisodesWatched(episodeIds: number[]): number[] {
  const current = new Set(getWatchedEpisodes());
  episodeIds.forEach((id) => {
    if (typeof id === 'number' && id > 0) current.add(id);
  });
  const updated = Array.from(current).sort((a, b) => a - b);
  try {
    localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving batch watched episodes:', err);
  }
  notifyWatchedChange(undefined, true, updated);
  return updated;
}

/**
 * Clears all watched episodes from localStorage.
 */
export function clearAllWatchedEpisodes(): void {
  try {
    localStorage.removeItem(WATCHED_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing watched episodes:', err);
  }
  notifyWatchedChange(undefined, false, []);
}
