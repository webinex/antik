import React, { useContext } from 'react';

export interface FormItemContextValue {
  name: string;
}

export const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined);

export function useFormItemContext() {
  return useContext(FormItemContext);
}
