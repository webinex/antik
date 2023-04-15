import { useField } from 'formik';
import { Radio, RadioChangeEvent, RadioGroupProps } from 'antd';
import { FC, memo } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useFieldChange } from './utils';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormRadioGroupProps = RadioGroupProps;

const _FormRadioGroup: FC<FormRadioGroupProps> = memo((props) => {
  const { name, ...rest } = props;

  return <Radio.Group {...rest} name={name} />;
});

_FormRadioGroup.displayName = 'Form.RadioGroup';

function mapValue(e: RadioChangeEvent) {
  return e.target.value ?? null;
}

export const FormRadioGroup: FC<FormRadioGroupProps> = (props: FormRadioGroupProps) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value }] = useField<CheckboxValueType>(name);
  const onChange = useFieldChange(name, mapValue);
  const disabled = useFormFieldDisabled(props);

  return <_FormRadioGroup {...props} name={name} value={value} onChange={onChange} disabled={disabled} />;
};

FormRadioGroup.displayName = 'Form.RadioGroup';
