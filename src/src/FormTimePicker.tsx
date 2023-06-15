import { useField } from 'formik';
import { TimePicker, TimePickerProps } from 'antd';
import { FC, memo, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormTimePickerProps = Omit<TimePickerProps, 'value' | 'onChange'> & {
  mapSet?: (...args: Parameters<NonNullable<TimePickerProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => TimePickerProps['value'];
};

const _FormTimePicker: FC<TimePickerProps> = memo((props) => <TimePicker {...props} />);

_FormTimePicker.displayName = 'Form.TimePicker';

export const FormTimePicker: FC<FormTimePickerProps> = (props) => {
  const {
    name: nameProp,
    mapGet,
    mapSet,
    value: valueProp,
    onChange: onChangeProp,
    onBlur: onBlurProp,
    ...restProps
  } = { ...DEFAULT_PROPS, ...(props as TimePickerProps) };

  const name = useFormItemName(nameProp);
  const field = useField(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange<Dayjs | null, Parameters<NonNullable<TimePickerProps['onChange']>>>(
    name,
    mapSet,
  );
  const onBlur = useFormFieldOnBlur(name);
  const value = useMemo(() => mapGet!(field), [field, mapGet]);

  return (
    <_FormTimePicker
      {...restProps}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
  );
};

const DEFAULT_PROPS: Pick<FormTimePickerProps, 'mapSet' | 'mapGet'> = {
  mapGet: ([{ value = null }]) => (typeof value === 'string' ? dayjs(value) : value),
  mapSet: (value) => value,
};

FormTimePicker.defaultProps = { ...DEFAULT_PROPS };
FormTimePicker.displayName = 'Form.TimePicker';
