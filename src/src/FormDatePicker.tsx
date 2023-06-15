import { useField } from 'formik';
import { DatePicker, DatePickerProps } from 'antd';
import { FC, memo, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormDatePickerProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
  mapSet?: (...args: Parameters<NonNullable<DatePickerProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => DatePickerProps['value'];
};

const _FormDatePicker: FC<DatePickerProps> = memo((props) => <DatePicker {...props} />);

_FormDatePicker.displayName = 'Form.DatePicker';

export const FormDatePicker: FC<FormDatePickerProps> = (props) => {
  const { name: nameProp, mapGet, mapSet } = { ...DEFAULT_PROPS, ...props };
  const name = useFormItemName(nameProp);
  const field = useField(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange<Dayjs | null, Parameters<NonNullable<DatePickerProps['onChange']>>>(
    name,
    mapSet,
  );
  const onBlur = useFormFieldOnBlur(name);
  const value = mapGet!(field);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const valueMemo = useMemo(() => value, [value?.toISOString()]);

  return (
    <_FormDatePicker
      {...props}
      picker={props.picker as any}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={valueMemo}
    />
  );
};

const DEFAULT_PROPS: Pick<FormDatePickerProps, 'mapSet' | 'mapGet'> = {
  mapGet: ([{ value = null }]) => (value != null ? dayjs(value) : value),
  mapSet: (value) => value,
};

FormDatePicker.defaultProps = { ...DEFAULT_PROPS };
FormDatePicker.displayName = 'Form.DatePicker';
