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

const FormSwitchComponent = memo((props: FormSwitchProps) => {
  props = Object.assign({}, FormSwitch.defaults, props);

  const {
    name: nameProp,
    mapGet,
    mapSet,
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
});

const DEFAULTS: Partial<FormSwitchProps> = {
  mapGet: ([{ value }]) => !!value,
  mapSet: (value) => value,
};

FormSwitchComponent.displayName = 'Form.Switch';

export const FormSwitch = /* @__PURE__ */ Object.assign(FormSwitchComponent, {
  defaults: DEFAULTS,
});
