"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";

/**
 * Compute the Levenshtein distance between two strings.
 * This distance is the minimum number of single-character
 * edits (insertions or deletions) required to transform one
 * string into the other.
 */
function levenshteinDistance(a: string, b: string): number {
  const dp: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    dp[i] = [];
    for (let j = 0; j <= b.length; j++) {
      dp[i][j] = 0;
    }
  }

  for (let i = 0; i <= a.length; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[a.length][b.length];
}

interface UseDuckTokenGatingProps {
  oldDescription: string;
  newDescription: string;
  oldInstructions: string;
  newInstructions: string;
}

export function useDuckTokenGating({
  oldDescription,
  newDescription,
  oldInstructions,
  newInstructions,
}: UseDuckTokenGatingProps) {
  const { balance } = useAuth();

  const totalEdits = useMemo(() => {
    const descEdits = levenshteinDistance(oldDescription, newDescription);
    const instrEdits = levenshteinDistance(oldInstructions, newInstructions);
    return descEdits + instrEdits;
  }, [oldDescription, newDescription, oldInstructions, newInstructions]);

  const canEdit = balance >= totalEdits;

  return {
    totalEdits,
    canEdit,
    userBalance: balance,
  };
}
