import { useFormItemName } from './useFormItemName';
import { useFormLabel } from './useFormLabel';
import { memo } from 'react';

export interface FormLabelValueProps {
  name?: string;
}

const FormLabelValueComponent = memo((props: FormLabelValueProps) => {
  props = Object.assign({}, FormLabelValue.defaults, props);

  const name = useFormItemName(props.name);
  return useFormLabel(name);
});

FormLabelValueComponent.displayName = 'Form.LabelValue';

export const FormLabelValue = /* @__PURE__ */ Object.assign(FormLabelValueComponent, {
  defaults: {} as Partial<FormLabelValueProps>,
});
