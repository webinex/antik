import { useField } from 'formik';
import { Checkbox } from 'antd';
import { FC, memo } from 'react';
import type { CheckboxGroupProps, CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useFieldChange } from './utils';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormCheckboxGroupProps = CheckboxGroupProps;

const EMPTY_ARRAY: string[] = [];

const _FormCheckboxGroup: FC<FormCheckboxGroupProps> = memo((props) => {
  const { name, ...rest } = props;

  return <Checkbox.Group name={name} {...rest} />;
});

_FormCheckboxGroup.displayName = 'Form.CheckboxGroup';

export const FormCheckboxGroup: FC<FormCheckboxGroupProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value = EMPTY_ARRAY }] = useField<CheckboxValueType[]>(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFieldChange(name);

  return <_FormCheckboxGroup {...props} value={value} onChange={onChange} name={name} disabled={disabled} />;
};

FormCheckboxGroup.displayName = 'Form.CheckboxGroup';
