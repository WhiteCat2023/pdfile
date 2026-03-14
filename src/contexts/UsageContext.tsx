
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface UsageData {
  count: number;
  date: string; // YYYY-MM-DD
}

interface UsageContextType {
  usageCount: number;
  usageLimit: number;
  recordUsage: () => void;
  isLimitReached: boolean;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const useUsage = (): UsageContextType => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
};

const USAGE_LIMIT = 10;
const STORAGE_KEY = 'dailyUsage';

export const UsageProvider = ({ children }: { children: ReactNode }) => {
  const [usageCount, setUsageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let currentUsage: UsageData = { count: 0, date: today };

    try {
      const storedUsage = localStorage.getItem(STORAGE_KEY);
      if (storedUsage) {
        const parsedUsage: UsageData = JSON.parse(storedUsage);
        if (parsedUsage.date === today) {
          currentUsage = parsedUsage;
        } else {
          // Reset for the new day
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, date: today }));
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsage));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
    
    setUsageCount(currentUsage.count);
    setIsLimitReached(currentUsage.count >= USAGE_LIMIT);
  }, []);

  const recordUsage = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = usageCount + 1;
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, date: today }));
        setUsageCount(newCount);
        if (newCount >= USAGE_LIMIT) {
            setIsLimitReached(true);
        }
    } catch (error) {
        console.error("Failed to write to localStorage", error);
    }
  }, [usageCount]);

  const value = {
    usageCount,
    usageLimit: USAGE_LIMIT,
    recordUsage,
    isLimitReached,
  };

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  );
};
