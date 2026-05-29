import React, { FC, memo, useMemo } from 'react';
import { Form, type FormItemProps as AntdFormItemProps } from 'antd';
import { useFormLabel } from './useFormLabel';
import { useFormErrorMessage } from './FormErrorMessage';
import { FormItemContext } from './FormItemContext';
import { useFormItemName } from './useFormItemName';

export type MayBeFormItemBase = {
  name?: string;
};

export type FormItemProps = Omit<
  AntdFormItemProps,
  | 'children'
  | 'dependencies'
  | 'getValueFromEvent'
  | 'name'
  | 'normalize'
  | 'rules'
  | 'shouldUpdate'
  | 'trigger'
  | 'validateTrigger'
  | 'valuePropName'
  | 'validateDebounce'
  | 'validateFirst'
  | 'isListField'
  | 'isList'
  | 'getValueProps'
  | 'messageVariables'
  | 'initialValue'
  | 'onReset'
  | 'onMetaChange'
  | 'preserve'
> & {
  name?: string;

  /**
   * Whether to use absolute name for the form item.
   * If true, the name will be used as is.
   * If false, the name will be concatenated with the parent form item name.
   * @default false
   */
  nameAbsolute?: boolean;

  /**
   * Whether to show the error message.
   * If true, the error message will be shown.
   * If false, the error message will be ignored.
   * @default false
   */
  noErrorMessage?: boolean;

  label?: React.ReactNode | boolean;
  children?: React.ReactNode;
};

type FormItemInternalProps = FormItemProps & { error: any; show: boolean };

const _FormItem: FC<FormItemInternalProps> = memo((props) => {
  const {
    error,
    show,
    help: helpProp,
    validateStatus: validateStatusProp,
    noErrorMessage = false,
    nameAbsolute,
    ...rest
  } = props;

  const help = noErrorMessage ? undefined : (helpProp ?? (show ? error : undefined));
  const validateStatus = validateStatusProp ?? (show ? 'error' : '');

  return <Form.Item {...rest} validateStatus={validateStatus} help={help} />;
});

const FormItemComponent = memo((props: FormItemProps) => {
  props = Object.assign({}, FormItem.defaults, props);

  const { name: nameProp, nameAbsolute = false } = props;
  const name = useFormItemName(nameProp, nameAbsolute);
  const label = useFormLabel(name, props.label);
  const errors = useFormErrorMessage({ name, label });
  const context = useMemo(() => ({ name }), [name]);

  return (
    <FormItemContext.Provider value={context}>
      <_FormItem {...props} {...errors} label={label} />
    </FormItemContext.Provider>
  );
});

FormItemComponent.displayName = 'Form.Item';

export const FormItem = /* @__PURE__ */ Object.assign(FormItemComponent, {
  defaults: {} as Partial<FormItemProps>,
});
