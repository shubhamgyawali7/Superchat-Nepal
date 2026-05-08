"use client";
import { useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';

export function useAutoSave(data, onSave, delay = 3000) {
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (debouncedData) {
      onSave(debouncedData);
    }
  }, [debouncedData, onSave]);
}
