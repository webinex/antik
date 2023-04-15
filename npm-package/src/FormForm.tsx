import { Form as AntdForm } from 'antd';
import type { FormProps as AntdFormProps } from 'antd';
import type { FormProps as RcFormProps } from 'rc-field-form/lib/Form';
import { FC, PropsWithChildren } from 'react';

export type FormProps = PropsWithChildren<Omit<AntdFormProps, keyof RcFormProps | 'disabled'>>;

export const FormForm: FC<FormProps> = (props: FormProps) => {
  return <AntdForm {...props} />;
};

FormForm.displayName = 'Form';
