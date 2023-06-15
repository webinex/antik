import { useCallback } from 'react';
import { useFormRef } from './useFormRef';

export function useFormValidate(uid: string) {
  const formRef = useFormRef(uid);

  return useCallback(
    () =>
      formRef.current!.validateForm().then((x) => {
        const isValid = Object.keys(x).length === 0;
        if (!isValid) formRef.current?.submitForm(); // show errors
        return isValid;
      }),
    [formRef],
  );
}
