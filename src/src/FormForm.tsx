import { Form as AntdForm } from 'antd';
import type { FormProps as AntdFormProps } from 'antd';
import type { FormProps as RcFormProps } from 'rc-field-form/lib/Form';
import { FormFormik, FormFormikProps } from './FormFormik';
import { FormikValues } from 'formik';
import { fc } from './fc';

export type FormBaseProps = Omit<AntdFormProps, keyof RcFormProps | 'disabled'>;

export interface FormOnlyProps extends FormBaseProps {
  type?: 'form' | never;
  children?: React.ReactNode | undefined;
  uid?: never;
  ns?: never;
  component?: never;
  render?: never;
  initialValues?: never;
  initialStatus?: never;
  initialErrors?: never;
  initialTouched?: never;
  onReset?: never;
  onSubmit?: never;
  validationSchema?: never;
  validate?: never;
  innerRef?: never;
  validateOnChange?: never;
  validateOnBlur?: never;
  validateOnMount?: never;
  isInitialValid?: never;
  enableReinitialize?: never;
}

export interface FormWithFormikProps<TValue = any> extends FormBaseProps, FormFormikProps<TValue> {
  type: 'formik';
}

function isFormWithFormikProps<TValue>(props: FormProps<TValue>): props is FormWithFormikProps<TValue> {
  return props.type === 'formik';
}

export type FormProps<TValue> = FormOnlyProps | FormWithFormikProps<TValue>;

const FORMIK_PROPS_EXCEPT_CHILDREN: (keyof FormFormikProps)[] = [
  'uid',
  'ns',
  'component',
  'render',
  'initialValues',
  'initialStatus',
  'initialErrors',
  'initialTouched',
  'onReset',
  'onSubmit',
  'validationSchema',
  'validate',
  'innerRef',
  'validateOnChange',
  'validateOnBlur',
  'validateOnMount',
  'isInitialValid',
  'enableReinitialize',
];

function splitProps<TValue>(
  props: FormFormikProps<TValue>,
): [
  Omit<FormFormikProps<TValue>, 'children'>,
  Omit<FormWithFormikProps<TValue>, keyof FormFormikProps>,
  FormFormikProps<TValue>['children'],
] {
  const formikProps: Record<string, any> = {};
  const formProps: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (FORMIK_PROPS_EXCEPT_CHILDREN.includes(key as any)) {
      formikProps[key] = value;
    } else if (key !== 'children') {
      formProps[key] = value;
    }
  }

  return [formikProps, formProps, props.children] as any;
}

export const FormForm = fc(<TValue extends FormikValues = any>(props: FormProps<TValue>) => {
  if (!isFormWithFormikProps(props)) {
    return <AntdForm {...props} />;
  }

  const [formikProps, formProps, children] = splitProps(props);

  if (typeof children === 'function') {
    <FormFormik<TValue> {...formikProps}>
      {(formik) => <AntdForm {...formProps}>{children(formik)}</AntdForm>}
    </FormFormik>;
  }

  return (
    <FormFormik<TValue> {...formikProps}>
      <AntdForm {...formProps}>{children as JSX.Element}</AntdForm>
    </FormFormik>
  );
});

FormForm.displayName = 'Form';
FormForm.defaultProps = {};
