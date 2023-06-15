import { useField } from 'formik';
import { Checkbox } from 'antd';
import { FC, memo } from 'react';
import type { CheckboxGroupProps, CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

export type FormCheckboxGroupProps = CheckboxGroupProps & {
  mapSet?: (...args: Parameters<NonNullable<CheckboxGroupProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<CheckboxGroupProps['value']>;
};

const EMPTY_ARRAY: string[] = [];

const _FormCheckboxGroup: FC<FormCheckboxGroupProps> = memo((props) => <Checkbox.Group {...props} />);

_FormCheckboxGroup.displayName = 'Form.CheckboxGroup';

export const FormCheckboxGroup: FC<FormCheckboxGroupProps> = (props) => {
  const {
    name: nameProp,
    mapGet = DEFAULT_PROPS.mapGet,
    mapSet = DEFAULT_PROPS.mapSet,
    ...checkboxGroupProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<CheckboxValueType[]>(name);

  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange(name, mapSet);

  return (
    <_FormCheckboxGroup
      {...checkboxGroupProps}
      value={mapGet!(field)}
      onChange={onChange}
      name={name}
      disabled={disabled}
    />
  );
};

const DEFAULT_PROPS: Partial<FormCheckboxGroupProps> = {
  mapSet: (value) => value,
  mapGet: ([{ value }]) => value ?? EMPTY_ARRAY,
};

FormCheckboxGroup.displayName = 'Form.CheckboxGroup';
