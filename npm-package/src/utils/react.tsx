import { useField } from 'formik';
import React, { useCallback, useRef } from 'react';

export function useFnRef<T>(fn: T): React.MutableRefObject<T> {
  const ref = useRef(fn);
  ref.current = fn;

  return ref;
}

export function useFnRefCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useFnRef(fn);
  return useCallback((...args: any[]) => ref.current.apply(null, args), [ref]) as any as T;
}

export function useFieldChange<TValue, TInputValue = TValue, TInputValue2 = void>(
  propsOrName: { name: string } | string,
  map?: (inputValue: TInputValue, inputValue2: TInputValue2) => TValue,
): (value: TInputValue, value2: TInputValue2) => void {
  const name = typeof propsOrName === 'string' ? propsOrName : propsOrName.name;
  const [, , { setValue, setTouched }] = useField<TValue>(name);
  const setTouchedRef = useFnRef(setTouched);
  const setValueRef = useFnRef(setValue);

  return useCallback(
    (value: TInputValue, value2: TInputValue2) => {
      setTouchedRef.current(true);
      setValueRef.current(map ? map(value, value2) : (value as any as TValue), true);
    },
    [map, setTouchedRef, setValueRef],
  );
}

export function useFieldBlur(propsOrName: { name: string } | string) {
  const name = typeof propsOrName === 'string' ? propsOrName : propsOrName.name;
  const [, , { setTouched }] = useField(name);
  const setTouchedRef = useFnRef(setTouched);

  return useCallback(() => setTouchedRef.current(true, true), [setTouchedRef]);
}
