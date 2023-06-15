import { useField } from 'formik';
import { FC, memo } from 'react';
import { useFormItemName } from './useFormItemName';
import type { TextProps } from 'antd/es/typography/Text';
import { Typography } from 'antd';

export interface FormTextProps extends Omit<TextProps, 'children'> {
  name?: string;
  mapGet?: (field: ReturnType<typeof useField<any>>) => TextProps['children'];
}

type FormTextInternalProps = FormTextProps & { value: React.ReactNode };

const _FormText: FC<FormTextInternalProps> = memo((props) => {
  const { value, ...textProps } = props;
  return <Typography.Text {...textProps}>{value}</Typography.Text>;
});

_FormText.displayName = 'Form.Text';

export const FormText: FC<FormTextProps> = (props) => {
  const { name: nameProp, mapGet = DEFAULT_PROPS.mapGet, ...textProps } = props;
  const name = useFormItemName(nameProp);
  const field = useField(name);
  return <_FormText {...textProps} value={mapGet!(field)} />;
};

const DEFAULT_PROPS: Partial<FormTextProps> = {
  mapGet: ([{ value }]) => value,
};

FormText.defaultProps = { ...DEFAULT_PROPS };
FormText.displayName = 'Form.Text';
