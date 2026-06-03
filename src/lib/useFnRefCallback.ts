import { useCallback } from 'react';
import { useFnRef } from './useFnRef';

export function useFnRefCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useFnRef(fn);
  return useCallback((...args: any[]) => ref.current.apply(null, args), [ref]) as any as T;
}
