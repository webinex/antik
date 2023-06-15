import { useField } from 'formik';
import React, { FC, memo } from 'react';
import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormTextAreaProps = TextAreaProps & {
  mapSet?: (...args: Parameters<NonNullable<TextAreaProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<TextAreaProps['value']>;
};

const _FormTextArea: FC<FormTextAreaProps> = memo((props) => <Input.TextArea {...props} />);

_FormTextArea.displayName = 'Form.TextArea';

export const FormTextArea: FC<FormTextAreaProps> = (props) => {
  const {
    name: nameProp,
    mapGet = DEFAULT_PROPS.mapGet,
    mapSet = DEFAULT_PROPS.mapSet,
    ...textAreaProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<string>(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange(name, mapSet);
  const onBlur = useFormFieldOnBlur(name);

  return (
    <_FormTextArea
      {...textAreaProps}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={mapGet!(field)}
    />
  );
};

const DEFAULT_PROPS: Partial<FormTextAreaProps> = {
  mapGet: ([{ value }]) => value ?? '',
  mapSet: (e) => (e.target.value?.length === 0 ? null : e.target.value ?? null),
};

FormTextArea.displayName = 'Form.TextArea';
