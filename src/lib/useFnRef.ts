import React, { useRef } from 'react';

export function useFnRef<T>(fn: T): React.RefObject<T> {
  const ref = useRef(fn);
  ref.current = fn;

  return ref;
}
