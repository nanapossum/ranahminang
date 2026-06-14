"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

type BookmarkButtonProps = {
  destinationId: string;
  canBookmark?: boolean;
  initialBookmarked?: boolean;
};

export function BookmarkButton({
  destinationId,
  canBookmark = false,
  initialBookmarked = false
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(canBookmark && !initialBookmarked);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  useEffect(() => {
    if (!canBookmark) {
      setIsCheckingStatus(false);
      setIsBookmarked(false);
      return;
    }

    async function checkBookmarkStatus() {
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const data = (await response.json()) as {
            bookmarks?: Array<{ destination?: { id: string } }>;
          };
          const bookmarked = data.bookmarks?.some(
            (b) => b.destination?.id === destinationId
          ) ?? false;
          setIsBookmarked(bookmarked);
        } else {
          setMessage("Unable to load bookmarks right now.");
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        setMessage("Unable to load bookmarks right now.");
      } finally {
        setIsCheckingStatus(false);
      }
    }

    void checkBookmarkStatus();
  }, [destinationId, canBookmark]);

  async function toggleBookmark() {
    if (!canBookmark || isLoading || isCheckingStatus) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      if (isBookmarked) {
        const response = await fetch(`/api/bookmarks/${destinationId}`, {
          method: "DELETE"
        });

        if (response.ok) {
          setIsBookmarked(false);
        } else {
          setMessage("Failed to remove bookmark.");
        }
      } else {
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destinationId })
        });

        if (response.ok) {
          setIsBookmarked(true);
        } else {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          if (response.status !== 409) {
            setMessage(data?.message || "Failed to add bookmark.");
          } else {
            setIsBookmarked(true);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setMessage("Bookmark update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!canBookmark) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-500 transition cursor-not-allowed"
        title="Sign in as a tourist to bookmark destinations"
      >
        <Bookmark size={16} aria-hidden="true" />
        Bookmark
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggleBookmark}
        disabled={isLoading || isCheckingStatus}
        className={
          isBookmarked
            ? "inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
            : "inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-400 hover:text-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
        }
      >
        <Bookmark size={16} aria-hidden="true" fill={isBookmarked ? "currentColor" : "none"} />
        {isCheckingStatus ? "Checking..." : isBookmarked ? "Bookmarked" : "Bookmark"}
      </button>
      {message ? <p className="text-xs text-stone-500">{message}</p> : null}
    </div>
  );
}
