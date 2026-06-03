import { useField } from 'formik';
import { Radio, RadioGroupProps } from 'antd';
import { FC, memo } from 'react';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';

export type FormRadioGroupProps = RadioGroupProps & {
  mapSet?: (...args: Parameters<NonNullable<RadioGroupProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<RadioGroupProps['value']>;
};

const _FormRadioGroup: FC<FormRadioGroupProps> = memo((props) => <Radio.Group {...props} />);

_FormRadioGroup.displayName = 'Form.RadioGroup';

const FormRadioGroupComponent = memo((props: FormRadioGroupProps) => {
  props = Object.assign({}, FormRadioGroup.defaults, props);

  const {
    name: nameProp,
    mapGet,
    mapSet,
    ...radioGroupProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<any>(name);
  const onChange = useFormFieldOnChange(name, mapSet);
  const disabled = useFormFieldDisabled(props);

  return (
    <_FormRadioGroup
      {...radioGroupProps}
      name={name}
      value={mapGet!(field)}
      onChange={onChange}
      disabled={disabled}
    />
  );
});

const DEFAULTS: Partial<FormRadioGroupProps> = {
  mapGet: ([{ value }]) => value ?? null,
  mapSet: (e) => e.target.value ?? null,
};

FormRadioGroupComponent.displayName = 'Form.RadioGroup';

export const FormRadioGroup = /* @__PURE__ */ Object.assign(FormRadioGroupComponent, {
  defaults: DEFAULTS,
});
