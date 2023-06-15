import { useField } from 'formik';
import { Checkbox, CheckboxProps } from 'antd';
import { FC, memo } from 'react';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';

type FormCheckboxInternalProps = {
  name?: string;
} & CheckboxProps;

export type FormCheckboxProps = Omit<FormCheckboxInternalProps, 'checked' | 'onChange'> & {
  mapSet?: (...args: Parameters<NonNullable<CheckboxProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<CheckboxProps['checked']>;
};

const _FormCheckbox: FC<FormCheckboxInternalProps> = memo((props) => <Checkbox {...props} />);

_FormCheckbox.displayName = 'Form.Checkbox';

export const FormCheckbox: FC<FormCheckboxProps> = (props) => {
  const { name: nameProp, mapGet, mapSet, ...checkboxProps } = props;
  const name = useFormItemName(nameProp);

  const field = useField<boolean | null | undefined>({
    name,
    type: 'checkbox',
  });

  const onChange = useFormFieldOnChange(name, mapSet!);
  const disabled = useFormFieldDisabled(props);

  return (
    <_FormCheckbox
      {...checkboxProps}
      name={name}
      onChange={onChange}
      checked={mapGet!(field)}
      disabled={disabled}
    />
  );
};

const DEFAULT_PROPS: Pick<FormCheckboxProps, 'mapGet' | 'mapSet'> = {
  mapSet: (e) => e.target.checked,
  mapGet: ([{ value }]) => !!value,
};

FormCheckbox.displayName = 'Form.Checkbox';
FormCheckbox.defaultProps = { ...DEFAULT_PROPS };
