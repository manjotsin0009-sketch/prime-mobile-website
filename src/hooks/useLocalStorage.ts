import { useEffect, useMemo, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobile;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const value = useMemo(() => {
    try {
      const parsed = localStorage.getItem(key);
      return parsed ? (JSON.parse(parsed) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key]);

  const setValue = (nextValue: T) => {
    localStorage.setItem(key, JSON.stringify(nextValue));
  };

  return [value, setValue] as const;
}
