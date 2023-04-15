import React, { useContext } from 'react';
export const FormNamespaceContext = React.createContext<string | undefined>(undefined);

export function useFormNamespace() {
  return useContext(FormNamespaceContext);
}
