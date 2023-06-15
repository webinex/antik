import { useCallback } from 'react';
import { FormMap } from './FormMap';
import { FormikContextType } from 'formik';

export function useFormRef<TFormValue = any>(uid: string) {
  return FormMap.getRef(uid) as React.RefObject<FormikContextType<TFormValue> | null>;
}

export function useFormSubmit(uid: string) {
  const ref = useFormRef(uid);
  return useCallback(() => {
    if (!ref.current) {
      return;
    }

    return ref.current.submitForm();
  }, [ref]);
}
