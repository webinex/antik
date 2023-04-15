import { useField } from 'formik';
import { FC, memo } from 'react';
import { useFormItemName } from './useFormItemName';
import type { TextProps } from 'antd/es/typography/Text';
import { Typography } from 'antd';

export interface FormTextProps extends Omit<TextProps, 'children'> {
  name?: string;
}

type FormTextInternalProps = FormTextProps & { value: React.ReactNode };

const _FormText: FC<FormTextInternalProps> = memo((props) => {
  const { value, ...textProps } = props;
  return <Typography.Text {...textProps}>{value}</Typography.Text>;
});

_FormText.displayName = 'Form.Text';

export const FormText: FC<FormTextProps> = (props) => {
  const { name: nameProp } = props;
  const name = useFormItemName(nameProp);
  const [{ value }] = useField(name);
  return <_FormText {...props} value={value} />;
};

FormText.displayName = 'Form.Text';
