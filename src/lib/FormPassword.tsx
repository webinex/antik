import { memo } from 'react';
import { FormInputProps } from './FormInput';
import { Input } from 'antd';
import { useField } from 'formik';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormItemName } from './useFormItemName';
import { useFormFieldDisabled } from './useFormFieldDisabled';

export type FormPasswordProps = Omit<FormInputProps, 'type'>;

const FormPasswordComponent = memo((props: FormPasswordProps) => {
  props = Object.assign({}, FormPassword.defaults, props);

  const {
    name: nameProp,
    mapGet,
    mapSet,
    ...inputProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField(name);
  const handleBlur = useFormFieldOnBlur(name);
  const handleChange = useFormFieldOnChange(name, mapSet);
  const disabled = useFormFieldDisabled(props);

  return (
    <Input.Password
      {...inputProps}
      value={mapGet!(field)}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      name={name}
    />
  );
});

const DEFAULTS: Pick<FormPasswordProps, 'mapSet' | 'mapGet'> = {
  mapGet: ([{ value = '' }]) => value,
  mapSet: (e) => (e.target.value?.length === 0 ? null : (e.target.value ?? null)),
};

FormPasswordComponent.displayName = 'Form.Password';

export const FormPassword = /* @__PURE__ */ Object.assign(FormPasswordComponent, {
  defaults: DEFAULTS,
});
