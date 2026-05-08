"use client";
import { useEffect } from 'react';

export function useKeyboardShortcut(keys, callback, options = {}) {
  useEffect(() => {
    const handler = (e) => {
      const { ctrlKey, shiftKey, altKey, key } = e;
      
      const keyCombo = keys.map(k => {
        const lowerK = k.toLowerCase();
        if (lowerK === 'ctrl') return ctrlKey;
        if (lowerK === 'shift') return shiftKey;
        if (lowerK === 'alt') return altKey;
        return key.toLowerCase() === lowerK;
      }).every(Boolean);

      if (keyCombo) {
        if (!options.allowBrowserDefault) {
          e.preventDefault();
        }
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, callback, options]);
}
