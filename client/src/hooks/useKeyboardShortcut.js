"use client";
import { useEffect, useRef } from 'react';

export function useKeyboardShortcut(keys, callback, options = {}) {
  const callbackRef = useRef(callback);
  const keysRef = useRef(keys);
  const optionsRef = useRef(options);

  useEffect(() => {
    callbackRef.current = callback;
    keysRef.current = keys;
    optionsRef.current = options;
  });

  useEffect(() => {
    const handler = (e) => {
      const { ctrlKey, shiftKey, altKey, key } = e;
      const currentKeys = keysRef.current;

      const keyCombo = currentKeys.map(k => {
        const lowerK = k.toLowerCase();
        if (lowerK === 'ctrl') return ctrlKey;
        if (lowerK === 'shift') return shiftKey;
        if (lowerK === 'alt') return altKey;
        return key.toLowerCase() === lowerK;
      }).every(Boolean);

      if (keyCombo) {
        if (!optionsRef.current.allowBrowserDefault) {
          e.preventDefault();
        }
        callbackRef.current(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
