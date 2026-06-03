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

const FormInputNumberComponent = memo((props: FormInputNumberProps) => {
  props = Object.assign({}, FormInputNumber.defaults, props);

  const {
    name: nameProp,
    mapGet,
    mapSet,
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
});

const DEFAULTS: Partial<FormInputNumberProps> = {
  mapSet: (value) => value ?? null,
  mapGet: ([{ value }]) => value ?? null,
};

FormInputNumberComponent.displayName = 'Form.InputNumber';

export const FormInputNumber = /* @__PURE__ */ Object.assign(FormInputNumberComponent, {
  defaults: DEFAULTS,
});
