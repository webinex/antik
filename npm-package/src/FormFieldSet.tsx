import React, { PropsWithChildren, useContext } from 'react';

const FieldSetContext = React.createContext(false);

export function useFieldSetDisabled() {
  return useContext(FieldSetContext);
}

export interface FormFieldSetProps {
  disabled?: boolean;
}

export function FormFieldSet(props: PropsWithChildren<FormFieldSetProps>) {
  const { disabled, children } = props;

  return (
    <FieldSetContext.Provider value={!!disabled}>
      <fieldset disabled={!!disabled}>{children}</fieldset>
    </FieldSetContext.Provider>
  );
}
