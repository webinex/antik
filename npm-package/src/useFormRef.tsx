import { useCallback } from 'react';
import { FormMap } from './FormMap';

export function useFormRef(uid: string) {
  return FormMap.getRef(uid);
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
