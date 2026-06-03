import React, { memo, PropsWithChildren, useContext } from 'react';

const FieldSetContext = React.createContext(false);

export function useFieldSetDisabled() {
  return useContext(FieldSetContext);
}

export interface FormFieldSetProps {
  disabled?: boolean;
}

const FormFieldSetComponent = memo((props: PropsWithChildren<FormFieldSetProps>) => {
  props = Object.assign({}, FormFieldSet.defaults, props);

  const { disabled, children } = props;

  return (
    <FieldSetContext.Provider value={!!disabled}>
      <fieldset disabled={!!disabled}>{children}</fieldset>
    </FieldSetContext.Provider>
  );
});

FormFieldSetComponent.displayName = 'Form.FieldSet';

export const FormFieldSet = /* @__PURE__ */ Object.assign(FormFieldSetComponent, {
  defaults: {} as Partial<PropsWithChildren<FormFieldSetProps>>,
});
