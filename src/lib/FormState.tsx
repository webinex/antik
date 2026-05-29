import { FormikContextType, useFormikContext } from 'formik';
import { memo } from 'react';

export interface FormStateProps<TValue = any> {
  /**
   * Render function to display form state.
   * @param context Formik context containing form state, values, errors, touched, etc.
   * @returns React node to render the form state.
   */
  render?: (context: FormikContextType<TValue>) => React.ReactNode;
}

export const renderDefault: FormStateProps['render'] = (context) => {
  const { values, errors, touched } = context;
  return <pre>{JSON.stringify({ values, errors, touched }, null, 2)}</pre>;
};

const DEFAULTS: Partial<FormStateProps<any>> = {
  render: renderDefault,
};

const FormStateComponent = memo(<TValue = any,>(props: FormStateProps<TValue>) => {
  props = Object.assign({}, FormState.defaults, props);

  const { render } = props;
  const context = useFormikContext<TValue>();
  return render!(context);
});

FormStateComponent.displayName = 'Form.State';

/**
 * Form.State component to display the current state of the form.
 * It useful for debugging and understanding the form's current values, errors, and touched fields.
 */
export const FormState = /* @__PURE__ */ Object.assign(FormStateComponent, {
  defaults: DEFAULTS,
});
