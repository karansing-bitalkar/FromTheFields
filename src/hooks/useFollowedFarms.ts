import { useState, useCallback } from "react";

const STORAGE_KEY = "ftf_followed_farms";

function loadFollowed(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFollowed(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFollowedFarms() {
  const [followedIds, setFollowedIds] = useState<string[]>(loadFollowed);

  const followFarm = useCallback((id: string) => {
    setFollowedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveFollowed(next);
      return next;
    });
  }, []);

  const unfollowFarm = useCallback((id: string) => {
    setFollowedIds((prev) => {
      const next = prev.filter((f) => f !== id);
      saveFollowed(next);
      return next;
    });
  }, []);

  const isFollowing = useCallback((id: string) => followedIds.includes(id), [followedIds]);

  return { followedIds, followFarm, unfollowFarm, isFollowing };
}
