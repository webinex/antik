import { useField } from 'formik';
import { DatePicker, DatePickerProps } from 'antd';
import { FC, memo, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormDatePickerProps = Omit<DatePickerProps<Dayjs, false>, 'value' | 'onChange'> & {
  mapSet?: (...args: Parameters<NonNullable<DatePickerProps<Dayjs, false>['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => DatePickerProps<Dayjs, false>['value'];
};

const FormDatePickerInternal: FC<DatePickerProps<Dayjs, false>> = memo((props) => <DatePicker {...props} />);

FormDatePickerInternal.displayName = 'Form.DatePicker';

const FormDatePickerComponent = memo((props: FormDatePickerProps) => {
  props = Object.assign({}, FormDatePicker.defaults, props);

  const { name: nameProp, mapGet, mapSet } = props;
  const name = useFormItemName(nameProp);
  const field = useField(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange<
    Dayjs | null,
    Parameters<NonNullable<DatePickerProps<Dayjs, false>['onChange']>>
  >(name, mapSet);
  const onBlur = useFormFieldOnBlur(name);
  const value = mapGet!(field);

  const valueMemo = useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...(Array.isArray(value) ? value.map((x) => x.toISOString()).join(',') : [value?.toISOString()])],
  );

  return (
    <FormDatePickerInternal
      {...props}
      picker={props.picker as any}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={valueMemo}
    />
  );
});

const DEFAULTS: Pick<FormDatePickerProps, 'mapSet' | 'mapGet'> = {
  mapGet: ([{ value = null }]) => (value != null ? dayjs(value) : value),
  mapSet: (value) => value,
};

FormDatePickerComponent.displayName = 'Form.DatePicker';

export const FormDatePicker = /* @__PURE__ */ Object.assign(FormDatePickerComponent, {
  defaults: DEFAULTS,
});
