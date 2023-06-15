import { useField } from 'formik';
import { useFnRef } from './useFnRef';
import { useCallback } from 'react';

export function useFormFieldOnChange<TValue, TParams extends any[] = any[]>(
  propsOrName: { name: string } | string,
  map?: (...args: TParams) => TValue,
): (...args: TParams) => void {
  const name = typeof propsOrName === 'string' ? propsOrName : propsOrName.name;
  const [, , { setValue, setTouched }] = useField<TValue>(name);
  const setTouchedRef = useFnRef(setTouched);
  const setValueRef = useFnRef(setValue);

  return useCallback(
    (...args) => {
      setTouchedRef.current(true);
      setValueRef.current(map ? map.call(null, ...args) : (args[0] as any as TValue), true);
    },
    [map, setTouchedRef, setValueRef],
  );
}
