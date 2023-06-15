import React, { FC, memo, useMemo } from 'react';
import { Form, type FormItemProps as AntdFormItemProps } from 'antd';
import type { InternalFieldProps } from 'rc-field-form/es/Field';
import { useFormLabel } from './useFormLabel';
import { useFormErrorMessage } from './FormErrorMessage';
import { FormItemContext } from './FormItemContext';
import { useFormItemName } from './useFormItemName';

export type MayBeFormItemBase = {
  name?: string;
};

export type FormItemProps = Omit<AntdFormItemProps, keyof InternalFieldProps> & {
  name?: string;
  label?: React.ReactNode | boolean;
  children?: React.ReactNode;
};

type FormItemInternalProps = FormItemProps & { error: any; show: boolean };

const _FormItem: FC<FormItemInternalProps> = memo((props) => {
  const { error, show, help: helpProp, validateStatus: validateStatusProp, ...rest } = props;
  const help = helpProp ?? (show ? error : undefined);
  const validateStatus = validateStatusProp ?? (show ? 'error' : '');

  return <Form.Item {...rest} validateStatus={validateStatus} help={help} />;
});

export const FormItem: FC<FormItemProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const label = useFormLabel(name, props.label);
  const errors = useFormErrorMessage({ name, label });
  const context = useMemo(() => ({ name }), [name]);

  return (
    <FormItemContext.Provider value={context}>
      <_FormItem {...props} {...errors} label={label} />
    </FormItemContext.Provider>
  );
};
