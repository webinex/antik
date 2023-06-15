import { useField } from 'formik';
import { Radio, RadioGroupProps } from 'antd';
import { FC, memo } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';

export type FormRadioGroupProps = RadioGroupProps & {
  mapSet?: (...args: Parameters<NonNullable<RadioGroupProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<RadioGroupProps['value']>;
};

const _FormRadioGroup: FC<FormRadioGroupProps> = memo((props) => <Radio.Group {...props} />);

_FormRadioGroup.displayName = 'Form.RadioGroup';

export const FormRadioGroup: FC<FormRadioGroupProps> = (props: FormRadioGroupProps) => {
  const {
    name: nameProp,
    mapGet = DEFAULT_PROPS.mapGet,
    mapSet = DEFAULT_PROPS.mapSet,
    ...radioGroupProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<CheckboxValueType>(name);
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
};

const DEFAULT_PROPS: Partial<FormRadioGroupProps> = {
  mapGet: ([{ value }]) => value ?? null,
  mapSet: (e) => e.target.value ?? null,
};

FormRadioGroup.defaultProps = { ...DEFAULT_PROPS };
FormRadioGroup.displayName = 'Form.RadioGroup';
