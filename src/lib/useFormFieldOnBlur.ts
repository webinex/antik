import { useField } from 'formik';
import { useFnRef } from './useFnRef';
import { useCallback } from 'react';

export function useFormFieldOnBlur(propsOrName: { name: string } | string) {
  const name = typeof propsOrName === 'string' ? propsOrName : propsOrName.name;
  const [, , { setTouched }] = useField(name);
  const setTouchedRef = useFnRef(setTouched);

  return useCallback(() => setTouchedRef.current(true, true), [setTouchedRef]);
}
