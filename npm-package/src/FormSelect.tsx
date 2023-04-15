import { useField } from 'formik';
import { Select, SelectProps } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { fc, useFieldBlur, useFieldChange } from './utils';
import type { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> = {
  name?: string;
  valueType?: 'option' | 'value';
} & SelectProps<ValueType, OptionType>;

type FormSelectInternalProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> = FormSelectProps<ValueType, OptionType> &
  Required<Pick<FormSelectProps<ValueType, OptionType>, 'onChange' | 'onBlur'>>;

let _FormSelect = fc(function <
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(props: FormSelectInternalProps<ValueType, OptionType>) {
  const { name, ...rest } = props;

  return <Select {...rest} />;
});

_FormSelect.displayName = 'Form.Select';
_FormSelect = memo(_FormSelect) as any;

function useMapValue<ValueType, OptionType extends BaseOptionType>(
  valueType: FormSelectProps['valueType'] = 'value',
) {
  return useCallback(
    (value: ValueType, option: OptionType | OptionType[]) => {
      if (valueType === 'value') {
        return value ?? null;
      }

      return option ?? null;
    },
    [valueType],
  );
}

function useValue<ValueType, OptionType extends BaseOptionType>(
  props: FormSelectProps<ValueType, OptionType>,
  name: string,
  valueType: FormSelectProps['valueType'] = 'value',
) {
  const { value: valueField = 'value' } = props.fieldNames ?? {};
  const [{ value }] = useField(name);

  return useMemo(
    () => (valueType === 'value' ? value : value ? value[valueField] : value),
    [value, valueField, valueType],
  );
}

export const FormSelect = fc(function <
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(props: FormSelectProps<ValueType, OptionType>) {
  const { name: nameProp, valueType, ...rest } = props;
  const name = useFormItemName(nameProp);

  const value = useValue(props, name, valueType);
  const disabled = useFormFieldDisabled(props);
  const mapValue = useMapValue(valueType);
  const onChange = useFieldChange(name, mapValue);
  const onBlur = useFieldBlur(name);

  return (
    <_FormSelect<ValueType, OptionType>
      {...rest}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
});

FormSelect.displayName = 'Form.Select';
