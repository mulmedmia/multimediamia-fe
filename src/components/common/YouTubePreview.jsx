"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import {
  getYouTubeEmbedUrl,
  getYouTubeVideoId,
  extractYouTubeUrlFromSubmission,
} from "@/lib/youtube";

export default function YouTubePreview({
  submission,
  url,
  title = "Video Karya Peserta",
  className = "",
  showFallback = false,
  fallbackText = "Video presentasi tidak disematkan",
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const rawUrl =
    url ||
    submission?.links?.find((l) => l?.link_type?.toUpperCase() === "YOUTUBE")?.url ||
    submission?.links?.find((l) => l?.url?.includes("youtu"))?.url;
  const videoId = rawUrl ? getYouTubeVideoId(rawUrl) : null;
  const embedUrl = url
    ? getYouTubeEmbedUrl(url)
    : extractYouTubeUrlFromSubmission(submission);

  if (!embedUrl) {
    if (!showFallback) return null;
    return (
      <div
        className={`aspect-video w-full bg-[#141824] rounded-xl flex flex-col items-center justify-center text-[#AAB1BD] space-y-2 p-6 border border-white/10 ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-[#1E2939] flex items-center justify-center text-[#99A1AF]">
          <Play className="h-7 w-7 ml-0.5 opacity-60" />
        </div>
        <span className="text-xs sm:text-sm text-center text-[#99A1AF]">
          {fallbackText}
        </span>
      </div>
    );
  }

  // YouTube Facade Pattern: Hindari loading ratusan KB script iframe sebelum user mengklik putar
  if (!isPlaying && videoId) {
    return (
      <div
        className={`aspect-video w-full rounded-xl overflow-hidden bg-black/90 border border-white/10 relative shadow-inner group/video cursor-pointer select-none ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(true);
        }}
        role="button"
        tabIndex={0}
        aria-label={`Putar video ${title}`}
      >
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-105 opacity-85 group-hover/video:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover/video:scale-110 group-hover/video:bg-red-600">
            <Play className="h-6 w-6 fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2.5 left-3 right-3 text-xs font-medium text-white/90 truncate drop-shadow">
          {title}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`aspect-video w-full rounded-xl overflow-hidden bg-black/90 border border-white/10 relative shadow-inner group/video ${className}`}
      onClick={(e) => {
        // Mencegah navigasi kartu saat user mengklik area video
        e.stopPropagation();
      }}
    >
      <iframe
        src={`${embedUrl}?autoplay=1`}
        title={title}
        width="100%"
        height="100%"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
