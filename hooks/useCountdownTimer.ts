import { useState, useEffect, useCallback } from "react";

export interface CountdownTimerOptions {
  expiresAt: string;
  initialRemainingSeconds?: number;
  onExpire?: () => void;
}

export interface CountdownTimerResult {
  remainingSeconds: number;
  formattedTime: string;
  isExpired: boolean;
  isWarning: boolean; // <= 10 minutes (600s)
  isUrgent: boolean;  // <= 5 minutes (300s)
}

/**
 * Authoritative countdown timer hook.
 * Calculates remaining seconds against server-issued `expiresAt` timestamp.
 */
export function useCountdownTimer({
  expiresAt,
  initialRemainingSeconds,
  onExpire,
}: CountdownTimerOptions): CountdownTimerResult {
  const calculateRemaining = useCallback((): number => {
    const expireTime = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expireTime - now) / 1000));
  }, [expiresAt]);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (typeof initialRemainingSeconds === "number") {
      return Math.max(0, initialRemainingSeconds);
    }
    return calculateRemaining();
  });

  const [isExpired, setIsExpired] = useState<boolean>(remainingSeconds <= 0);

  useEffect(() => {
    // If already expired, do nothing
    if (remainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateRemaining, onExpire, remainingSeconds]);

  // Format MM:SS or HH:MM:SS
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  let formattedTime = "";
  if (hours > 0) {
    formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const isWarning = remainingSeconds > 0 && remainingSeconds <= 600; // <= 10 minutes
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 300;  // <= 5 minutes

  return {
    remainingSeconds,
    formattedTime,
    isExpired,
    isWarning,
    isUrgent,
  };
}
