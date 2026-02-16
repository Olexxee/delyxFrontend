import { useState, useCallback } from "react";

export function useAsyncState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  
  const stableSetData = useCallback((value: T | null | ((prev: T | null) => T | null)) => {
    setData(value);
  }, []);

  const run = useCallback(async (promise: Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promise;
      setData(result);
      return result;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    data, 
    loading, 
    error, 
    run, 
    setData: stableSetData, // Use the memoized version
    setError 
  };
}