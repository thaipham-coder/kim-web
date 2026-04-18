"use client";

import { useState, useEffect, useCallback } from "react";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check support and current state
  useEffect(() => {
    const checkSupport = async () => {
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      setIsSupported(supported);

      if (!supported) {
        setIsLoading(false);
        return;
      }

      setPermission(Notification.permission);

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch {
        // SW not ready yet
      }

      setIsLoading(false);
    };

    checkSupport();
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) return false;

    try {
      setIsLoading(true);

      // Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setIsLoading(false);
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      // Send subscription to server
      const response = await fetch("/api/web-push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription on server");
      }

      setIsSubscribed(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("[Push] Subscribe error:", error);
      setIsLoading(false);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Remove from server
        await fetch("/api/web-push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        // Unsubscribe locally
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("[Push] Unsubscribe error:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
