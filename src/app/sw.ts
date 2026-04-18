/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// ======================================
// Push Notification Handler
// ======================================
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options: NotificationOptions = {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: data.tag || "order-notification",
      data: {
        url: data.url || "/admin/orders",
      },
    };

    event.waitUntil(
      Promise.all([
        self.registration.showNotification(data.title || "Thông báo mới", options),
        // Send data to all open clients for TTS
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "PUSH_RECEIVED",
              title: data.title,
              body: data.body,
            });
          });
        }),
      ])
    );
  } catch {
    // Fallback for non-JSON payloads
    event.waitUntil(
      self.registration.showNotification("Thông báo mới", {
        body: event.data.text(),
        icon: "/icons/icon-192.png",
      })
    );
  }
});

// ======================================
// Notification Click Handler
// ======================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/admin/orders";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If there's already an open tab, focus it and navigate
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(url);
    })
  );
});

serwist.addEventListeners();
