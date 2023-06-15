import { FC, memo } from 'react';
import { useField } from 'formik';
import { Input, InputProps } from 'antd';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';
import { useFormFieldOnChange } from './useFormFieldOnChange';

export type FormInputProps = Omit<InputProps, 'onChange' | 'value' | 'onBlur'> & {
  mapSet?: (...args: Parameters<NonNullable<InputProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<InputProps['value']>;
};

type FormInputInternalProps = FormInputProps &
  Required<Pick<InputProps, 'value' | 'onChange' | 'onBlur'>> & {
    name: string;
  };

const _FormInput: FC<FormInputInternalProps> = memo((props) => {
  const { name, ...rest } = props;

  return <Input name={name} {...rest} />;
});

_FormInput.displayName = 'Form.Input';

export const FormInput: FC<FormInputProps> = (props: FormInputProps) => {
  const { name: nameProp, mapGet, mapSet, ...inputProps } = { ...DEFAULT_PROPS, ...props };
  const name = useFormItemName(nameProp);
  const field = useField<string>(name);

  const disabled = useFormFieldDisabled(props);
  const onBlur = useFormFieldOnBlur(name);
  const onChange = useFormFieldOnChange(name, mapSet);

  return (
    <_FormInput
      {...inputProps}
      name={name}
      value={mapGet!(field)}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

const DEFAULT_PROPS: Pick<FormInputProps, 'mapSet' | 'mapGet'> = {
  mapGet: ([{ value = '' }]) => value,
  mapSet: (e) => (e.target.value?.length === 0 ? null : e.target.value ?? null),
};

FormInput.defaultProps = { ...DEFAULT_PROPS };
FormInput.displayName = 'Form.Input';
