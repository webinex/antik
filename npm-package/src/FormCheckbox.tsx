import { useField } from 'formik';
import { Checkbox, CheckboxProps } from 'antd';
import { FC, memo } from 'react';
import { useFieldChange } from './utils';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormLabel } from './useFormLabel';
import { useFormItemName } from './useFormItemName';

export type FormCheckboxProps = {
  name?: string;
  label?: React.ReactNode | false;
} & CheckboxProps;

const _FormCheckbox: FC<FormCheckboxProps> = memo((props: FormCheckboxProps) => {
  const { name, label, ...rest } = props;

  return (
    <Checkbox name={name} {...rest}>
      {label}
    </Checkbox>
  );
});

_FormCheckbox.displayName = 'Form.Checkbox';

function mapValue(e: CheckboxChangeEvent) {
  return e.target.checked;
}

export const FormCheckbox: FC<FormCheckboxProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);

  const [{ value }] = useField<boolean | null | undefined>({
    name,
    type: 'checkbox',
  });

  const onChange = useFieldChange(name, mapValue);
  const label = useFormLabel(name);
  const disabled = useFormFieldDisabled(props);

  return (
    <_FormCheckbox
      {...props}
      name={name}
      onChange={onChange}
      checked={value === true}
      label={label}
      disabled={disabled}
    />
  );
};

FormCheckbox.displayName = 'Form.Checkbox';
