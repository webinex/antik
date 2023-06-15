import { useField } from 'formik';
import { FC, memo } from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormInputNumberProps = InputNumberProps<number> & {
  mapSet?: (...args: Parameters<NonNullable<InputNumberProps<number>['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => Exclude<InputNumberProps<number>['value'], undefined>;
};

type FormNumberInternalProps = FormInputNumberProps &
  Required<Pick<FormInputNumberProps, 'onChange' | 'onBlur'>>;

let _FormInputNumber: FC<FormNumberInternalProps> = memo((props) => <InputNumber {...props} />);

_FormInputNumber.displayName = 'Form.InputNumber';
_FormInputNumber = memo(_FormInputNumber);

export const FormInputNumber: FC<FormInputNumberProps> = (props) => {
  const {
    name: nameProp,
    mapGet = DEFAULT_PROPS.mapGet,
    mapSet = DEFAULT_PROPS.mapSet,
    ...inputNumberProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<number | null>(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange(name, mapSet);
  const onBlur = useFormFieldOnBlur(name);

  return (
    <_FormInputNumber
      {...inputNumberProps}
      name={name}
      value={mapGet!(field)}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

const DEFAULT_PROPS: Partial<FormInputNumberProps> = {
  mapSet: (value) => value ?? null,
  mapGet: ([{ value }]) => value ?? null,
};

FormInputNumber.defaultProps = { ...DEFAULT_PROPS };
FormInputNumber.displayName = 'Form.InputNumber';
