"use client";

import { useCallback, useEffect, useRef } from "react";

// ======================================
// Cấu hình câu thoại cho từng sự kiện
// ======================================

export const SPEECH_MESSAGES = {
  NOTIFICATION_ENABLED: "Cảm ơn quý khách",
  APP_STARTUP: "Hệ thống đang thiết lập kết nối, vui lòng chờ ít phút",
  CONNECTION_READY: "Liên kết hoàn tất. Cơ sở dữ liệu đã trực tuyến",
} as const;

export type SpeechEvent = keyof typeof SPEECH_MESSAGES;

// ======================================
// Hook: useSpeech
// ======================================

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Preload Vietnamese voice
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => v.lang === "vi-VN") ||
        voices.find((v) => v.lang.startsWith("vi")) ||
        null;
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  /** Phát bất kỳ text nào bằng giọng tiếng Việt */
  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn("[Speech] Error:", e.error);
        resolve(); // Don't reject — speech failure shouldn't break the app
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  /** Phát câu thoại theo event type đã cấu hình */
  const speakEvent = useCallback(
    (event: SpeechEvent): Promise<void> => {
      return speak(SPEECH_MESSAGES[event]);
    },
    [speak]
  );

  return { speak, speakEvent };
}
