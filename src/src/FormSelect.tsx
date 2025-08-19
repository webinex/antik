import { useField } from 'formik';
import { Select, SelectProps } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import type { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { fc } from './fc';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> = {
  name?: string;
  valueType?: 'option' | 'value';
  mapSet?: (value: ValueType | OptionType | OptionType[] | null) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<SelectProps['value']>;
} & SelectProps<ValueType, OptionType>;

type FormSelectInternalProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> = FormSelectProps<ValueType, OptionType> &
  Required<Pick<FormSelectProps<ValueType, OptionType>, 'onChange' | 'onBlur'>>;

let _FormSelectMemo = fc(function <
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(props: FormSelectInternalProps<ValueType, OptionType>) {
  const { name, ...rest } = props;
  return <Select {...rest} />;
});

_FormSelectMemo.displayName = 'Form.Select';
_FormSelectMemo = memo(_FormSelectMemo) as any;

function useMapValue<ValueType, OptionType extends BaseOptionType>(
  props: FormSelectProps<ValueType, OptionType>,
) {
  const { valueType = 'value', mapSet } = props;

  return useCallback(
    (value: ValueType, option: OptionType | OptionType[] | undefined) => {
      if (valueType === 'value') {
        return mapSet!(value ?? null);
      }

      return mapSet!(option ?? null);
    },
    [valueType, mapSet],
  );
}

function useValue<ValueType, OptionType extends BaseOptionType>(
  props: FormSelectProps<ValueType, OptionType>,
  name: string,
  valueType: FormSelectProps['valueType'] = 'value',
) {
  const { mapGet, fieldNames, mode } = props;
  const { value: valueField = 'value' } = fieldNames ?? {};
  const field = useField(name);
  const value = mapGet!(field);

  return useMemo(() => {
    function mapOne(value: OptionType) {
      if (valueType === 'value') {
        return value;
      }

      return value?.[valueField] ?? null;
    }

    return mode === 'multiple' || mode === 'tags' ? value.map(mapOne) : mapOne(value);
  }, [value, valueField, valueType, mode]);
}

const _FormSelect = fc(function <
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(props: FormSelectProps<ValueType, OptionType>) {
  props = Object.assign({}, FormSelect.DEFAULT_PROPS, props);
  const { name: nameProp, valueType, onDeselect: onDeselectProp, onSelect: onSelectProp, ...rest } = props;
  const name = useFormItemName(nameProp);

  const value = useValue(props, name, valueType);
  const disabled = useFormFieldDisabled(props);
  const mapValue = useMapValue(props);
  const onChange = useFormFieldOnChange(name, mapValue);
  const onBlur = useFormFieldOnBlur(name);

  return (
    <_FormSelectMemo<ValueType, OptionType>
      {...rest}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
});

_FormSelect.displayName = 'Form.Select';

const DEFAULT_PROPS: FormSelectProps<any> = {
  mapGet: ([{ value }]) => value,
  mapSet: (value) => value,
};

export const FormSelect = Object.assign(_FormSelect, {
  DEFAULT_PROPS,
});
