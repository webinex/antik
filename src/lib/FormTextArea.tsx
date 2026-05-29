import { useField } from 'formik';
import { FC, memo } from 'react';
import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { useFormFieldOnChange } from './useFormFieldOnChange';
import { useFormFieldOnBlur } from './useFormFieldOnBlur';

export type FormTextAreaProps = TextAreaProps & {
  mapSet?: (...args: Parameters<NonNullable<TextAreaProps['onChange']>>) => any;
  mapGet?: (field: ReturnType<typeof useField<any>>) => NonNullable<TextAreaProps['value']>;
};

const _FormTextArea: FC<FormTextAreaProps> = memo((props) => <Input.TextArea {...props} />);

_FormTextArea.displayName = 'Form.TextArea';

const FormTextAreaComponent = memo((props: FormTextAreaProps) => {
  props = Object.assign({}, FormTextArea.defaults, props);

  const {
    name: nameProp,
    mapGet,
    mapSet,
    ...textAreaProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField<string>(name);
  const disabled = useFormFieldDisabled(props);
  const onChange = useFormFieldOnChange(name, mapSet);
  const onBlur = useFormFieldOnBlur(name);

  return (
    <_FormTextArea
      {...textAreaProps}
      name={name}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      value={mapGet!(field)}
    />
  );
});

const DEFAULTS: Partial<FormTextAreaProps> = {
  mapGet: ([{ value }]) => value ?? '',
  mapSet: (e) => (e.target.value?.length === 0 ? null : (e.target.value ?? null)),
};

FormTextAreaComponent.displayName = 'Form.TextArea';

export const FormTextArea = /* @__PURE__ */ Object.assign(FormTextAreaComponent, {
  defaults: DEFAULTS,
});
