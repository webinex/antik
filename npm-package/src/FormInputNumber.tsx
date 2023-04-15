import { useField } from 'formik';
import { FC, memo } from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { useFieldBlur, useFieldChange } from './utils/react';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export interface FormInputNumberProps extends InputNumberProps<number> {}

type FormNumberInternalProps = FormInputNumberProps &
  Required<Pick<FormInputNumberProps, 'onChange' | 'onBlur'>>;

let _FormInputNumber: FC<FormNumberInternalProps> = (props) => {
  const { name, ...rest } = props;

  return <InputNumber name={name!} {...rest} />;
};

_FormInputNumber.displayName = 'Form.InputNumber';
_FormInputNumber = memo(_FormInputNumber);

const mapValue = (value: number | null | undefined) => value ?? null;

export const FormInputNumber: FC<FormInputNumberProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value = null }] = useField<number | null>(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFieldChange(name, mapValue);
  const onBlur = useFieldBlur(name);

  return (
    <_FormInputNumber
      {...props}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

FormInputNumber.displayName = 'Form.InputNumber';
