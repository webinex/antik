import { useField } from 'formik';
import { DatePicker, DatePickerProps } from 'antd';
import { FC, memo, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { useFieldBlur, useFieldChange } from './utils';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormDatePickerProps = DatePickerProps;

const _FormDatePicker: FC<FormDatePickerProps> = memo((props) => {
  const { name, ...rest } = props;

  return <DatePicker name={name} {...rest} />;
});

_FormDatePicker.displayName = 'Form.DatePicker';

export const FormDatePicker: FC<FormDatePickerProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value: formikValue = null }] = useField(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFieldChange<Moment | null, Moment | null, string>(name);
  const onBlur = useFieldBlur(name);

  const value = useMemo(() => {
    return typeof formikValue === 'string' ? moment(formikValue) : formikValue;
  }, [formikValue]);

  return (
    <_FormDatePicker
      {...props}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
  );
};

FormDatePicker.displayName = 'Form.DatePicker';
