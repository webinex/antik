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

const FormTextComponent = memo((props: FormTextProps) => {
  props = Object.assign({}, FormText.defaults, props);

  const {
    name: nameProp,
    mapGet,
    ...textProps
  } = props;

  const name = useFormItemName(nameProp);
  const field = useField(name);
  return <_FormText {...textProps} value={mapGet!(field)} />;
});

const DEFAULTS: Partial<FormTextProps> = {
  mapGet: ([{ value }]) => value,
};

FormTextComponent.displayName = 'Form.Text';

export const FormText = /* @__PURE__ */ Object.assign(FormTextComponent, {
  defaults: DEFAULTS,
});
