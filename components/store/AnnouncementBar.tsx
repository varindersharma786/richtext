"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  link_text: string | null;
  background_color: string;
  text_color: string;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if user has dismissed announcements
    const isDismissed = localStorage.getItem("announcements_dismissed");
    if (isDismissed) {
      setDismissed(true);
    }

    // Fetch active announcements
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // Auto-rotate announcements every 5 seconds if multiple exist
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("announcements_dismissed", "true");
  };

  if (dismissed || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          backgroundColor: currentAnnouncement.background_color,
          color: currentAnnouncement.text_color,
        }}
        className="relative"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <p className="text-sm font-medium">
                {currentAnnouncement.message}
                {currentAnnouncement.link_url && (
                  <Link
                    href={currentAnnouncement.link_url}
                    className="ml-2 underline"
                    style={{ color: currentAnnouncement.text_color }}
                  >
                    {currentAnnouncement.link_text || "Learn More"}
                  </Link>
                )}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Indicator dots if multiple announcements */}
          {announcements.length > 1 && (
            <div className="flex justify-center gap-1 mt-2">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-4 opacity-100" : "opacity-40"
                  }`}
                  style={{ backgroundColor: currentAnnouncement.text_color }}
                  aria-label={`Go to announcement ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
