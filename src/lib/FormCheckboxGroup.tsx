import { useField } from 'formik';
import { Checkbox } from 'antd';
import { FC, memo } from 'react';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import type { CheckboxGroupProps } from 'antd/es/checkbox';

export type FormCheckboxGroupProps = CheckboxGroupProps & {
  mapSet?: (...args: Parameters<NonNullable<CheckboxGroupProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<CheckboxGroupProps['value']>;
};

const EMPTY_ARRAY: string[] = [];

const _FormCheckboxGroup: FC<FormCheckboxGroupProps> = memo((props) => <Checkbox.Group {...props} />);

_FormCheckboxGroup.displayName = 'Form.CheckboxGroup';

const FormCheckboxGroupComponent = memo((props: FormCheckboxGroupProps) => {
  props = Object.assign({}, FormCheckboxGroup.defaults, props);

  const {
    name: nameProp,
    mapGet,
    mapSet,
    ...checkboxGroupProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<any[]>(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange(name, mapSet);

  return (
    <_FormCheckboxGroup
      {...checkboxGroupProps}
      value={mapGet!(field)}
      onChange={onChange}
      name={name}
      disabled={disabled}
    />
  );
});

const DEFAULTS: Partial<FormCheckboxGroupProps> = {
  mapSet: (value) => value,
  mapGet: ([{ value }]) => value ?? EMPTY_ARRAY,
};

FormCheckboxGroupComponent.displayName = 'Form.CheckboxGroup';

export const FormCheckboxGroup = /* @__PURE__ */ Object.assign(FormCheckboxGroupComponent, {
  defaults: DEFAULTS,
});
