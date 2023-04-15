import React, { FC, memo } from 'react';
import { useField } from 'formik';
import { Input, InputProps } from 'antd';
import { useFieldBlur, useFieldChange } from './utils';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormInputProps = InputProps;

type FormInputInternalProps = FormInputProps &
  Required<Pick<FormInputProps, 'onChange' | 'onBlur'>> & {
    name: string;
  };

const _FormInput: FC<FormInputInternalProps> = memo((props) => {
  const { name, ...rest } = props;

  return <Input name={name} {...rest} />;
});

_FormInput.displayName = 'Form.Input';

function mapValue(e: React.ChangeEvent<HTMLInputElement>) {
  return e.target.value?.length === 0 ? null : e.target.value ?? null;
}

export const FormInput: FC<FormInputProps> = (props: FormInputProps) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value = '' }] = useField<string>(name);

  const disabled = useFormFieldDisabled(props);
  const onBlur = useFieldBlur(name);
  const onChange = useFieldChange(name, mapValue);

  return (
    <_FormInput
      {...props}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

FormInput.displayName = 'Form.Input';
