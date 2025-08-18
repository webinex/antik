import { ComponentProps, FC } from 'react';
import { FormInputProps } from './FormInput';
import { Input } from 'antd';
import { useField } from 'formik';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormItemName } from './useFormItemName';
import { useFormFieldDisabled } from './useFormFieldDisabled';

export type FormPasswordProps = Omit<FormInputProps, 'type'>;

const _FormPasswordInternal: FC<ComponentProps<typeof Input.Password>> = (props) => {
  return <Input.Password {...props} type="password" />;
};

_FormPasswordInternal.displayName = 'Form.Password';

const _FormPassword: FC<FormPasswordProps> = (props) => {
  const {
    name: nameProp,
    mapGet,
    mapSet,
    ...inputProps
  } = Object.assign({}, FormPassword.DEFAULT_PROPS, props);

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
};

const DEFAULT_PROPS: Pick<FormPasswordProps, 'mapSet' | 'mapGet'> = {
  mapGet: ([{ value = '' }]) => value,
  mapSet: (e) => (e.target.value?.length === 0 ? null : (e.target.value ?? null)),
};

export const FormPassword = Object.assign(_FormPassword, {
  DEFAULT_PROPS,
});
