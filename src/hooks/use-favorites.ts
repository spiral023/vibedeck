'use client';

import { useState, useEffect } from 'react';

export function useFavorites(storageKey: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`vibedeck-favorites-${storageKey}`);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(`Failed to parse favorites for ${storageKey}`, e);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  const toggleFavorite = (id: string) => {
    if (!isLoaded) return;
    
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      
      localStorage.setItem(`vibedeck-favorites-${storageKey}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
