"use client";
import { useEffect } from 'react';

export function usePreloadAssets(urls) {
  useEffect(() => {
    if (!urls || !Array.isArray(urls)) return;

    urls.forEach(url => {
      if (!url) return;
      
      const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
      const isAudio = url.match(/\.(mp3|wav|ogg)$/i);

      if (isImage) {
        const img = new Image();
        img.src = url;
      } else if (isAudio) {
        const audio = new Audio();
        audio.src = url;
        audio.load();
      } else {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, [urls]);
}
