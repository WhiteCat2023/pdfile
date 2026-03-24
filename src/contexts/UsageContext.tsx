
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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

interface UsageProviderProps {
    children: ReactNode;
}

export const UsageProvider = ({ children }: UsageProviderProps) => {
    const { currentUser } = useAuth();
    const [usageCount, setUsageCount] = useState(0);
    const [usageLimit, setUsageLimit] = useState(5);
    const [isLimitReached, setIsLimitReached] = useState(false);

    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const getUsageData = useCallback((): UsageData => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedUsage = localStorage.getItem('usageData');
            if (storedUsage) {
                try {
                    const data: UsageData = JSON.parse(storedUsage);
                    if (data.date === getToday()) {
                        return data;
                    }
                } catch (error) {
                    console.error("Error parsing usage data from localStorage", error);
                }
            }
        }
        return { count: 0, date: getToday() };
    }, []);

    useEffect(() => {
        if (!currentUser) {
            const limit = 5;
            setUsageLimit(limit);
            const usageData = getUsageData();
            setUsageCount(usageData.count);
            setIsLimitReached(usageData.count >= limit);
        } else {
            setUsageLimit(Infinity); // Unlimited for logged-in users
            setUsageCount(0);
            setIsLimitReached(false);
        }
    }, [currentUser, getUsageData]);

    const recordUsage = useCallback(() => {
        if (!currentUser) {
            const currentCount = usageCount;
            if (currentCount < usageLimit) {
                const newCount = currentCount + 1;
                setUsageCount(newCount);
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('usageData', JSON.stringify({ count: newCount, date: getToday() }));
                }
                if (newCount >= usageLimit) {
                    setIsLimitReached(true);
                }
            }
        }
    }, [currentUser, usageCount, usageLimit]);

    const value = {
        usageCount,
        usageLimit,
        recordUsage,
        isLimitReached,
    };

    return (
        <UsageContext.Provider value={value}>
            {children}
        </UsageContext.Provider>
    );
};
