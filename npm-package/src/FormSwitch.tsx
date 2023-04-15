import { useField } from 'formik';
import { Switch, SwitchProps } from 'antd';
import { FC, memo } from 'react';
import { useFieldChange } from './utils';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormSwitchProps = SwitchProps & {
  name?: string;
};

const _FormSwitch: FC<FormSwitchProps> = memo((props: FormSwitchProps) => {
  const { name, ...rest } = props;

  return <Switch {...rest} />;
});

_FormSwitch.displayName = 'Form.Switch';

export const FormSwitch: FC<FormSwitchProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value = null }] = useField(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFieldChange<boolean, boolean, React.MouseEvent<HTMLButtonElement>>(name);

  return <_FormSwitch {...props} name={name} checked={value} disabled={disabled} onChange={onChange} />;
};

FormSwitch.displayName = 'Form.Switch';
