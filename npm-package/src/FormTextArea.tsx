import { useField } from 'formik';
import React, { FC, memo } from 'react';
import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';
import { useFieldBlur, useFieldChange } from './utils';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormTextAreaProps = TextAreaProps;

const _FormTextArea: FC<FormTextAreaProps> = memo((props) => {
  const { name, ...rest } = props;

  return <Input.TextArea name={name} {...rest} />;
});

_FormTextArea.displayName = 'Form.TextArea';

function mapValue(e: React.ChangeEvent<HTMLTextAreaElement>) {
  return e.target.value?.length === 0 ? null : e.target.value ?? null;
}

export const FormTextArea: FC<FormTextAreaProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value = '' }] = useField<string>(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFieldChange(name, mapValue);
  const onBlur = useFieldBlur(name);

  return (
    <_FormTextArea
      {...props}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
  );
};

FormTextArea.displayName = 'Form.TextArea';
