import { useField } from 'formik';
import { Switch, SwitchProps } from 'antd';
import { FC, memo } from 'react';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';

export type FormSwitchProps = SwitchProps & {
  name?: string;
  mapSet?: (...args: Parameters<NonNullable<SwitchProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => Exclude<SwitchProps['checked'], undefined>;
};

const _FormSwitch: FC<FormSwitchProps> = memo((props) => <Switch {...props} />);

_FormSwitch.displayName = 'Form.Switch';

export const FormSwitch: FC<FormSwitchProps> = (props) => {
  const {
    name: nameProp,
    mapGet = DEFAULT_PROPS.mapGet,
    mapSet = DEFAULT_PROPS.mapSet,
    ...switchProps
  } = props;
  const name = useFormItemName(nameProp);
  const field = useField(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange<boolean>(name, mapSet);

  return (
    <_FormSwitch
      {...switchProps}
      name={name}
      checked={mapGet!(field)}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

const DEFAULT_PROPS: Partial<FormSwitchProps> = {
  mapGet: ([{ value }]) => !!value,
  mapSet: (value) => value,
};

FormSwitch.defaultProps = { ...DEFAULT_PROPS };
FormSwitch.displayName = 'Form.Switch';
