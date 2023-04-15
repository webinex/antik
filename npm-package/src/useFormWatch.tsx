import { getIn } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { FormMap } from './FormMap';
import { useFormRef } from './useFormRef';

export function useFormWatch<TValue = any>(uid: string, name: string) {
  const formRef = useFormRef(uid);
  const [value, setValue] = useState<TValue | undefined>(() => {
    return formRef?.current ? getIn(formRef?.current, name) : undefined;
  });
  const prevValueRef = useRef<TValue | undefined>(value);

  useEffect(() => {
    const currentValue = FormMap.getRef(uid)?.current
      ? getIn(FormMap.getRef(FormMap.getRef(uid).current?.values), name)
      : undefined;

    if (value !== currentValue) {
      prevValueRef.current = currentValue;
      setValue(currentValue);
    }

    const unsubscribe = FormMap.subscribe(uid, name, (value: TValue) => {
      if (prevValueRef.current === value) {
        return;
      }

      prevValueRef.current = value;
      setValue(value);
    });

    return () => {
      setValue(undefined);
      prevValueRef.current = undefined;
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, name]);

  return value;
}
