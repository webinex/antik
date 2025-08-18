import { FormikContextType, useFormikContext } from 'formik';

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

export function _FormState<TValue = any>(props: FormStateProps<TValue>) {
  const { render } = Object.assign({}, FormState.DEFAULT_PROPS, props);
  const context = useFormikContext<TValue>();
  return render!(context);
}

_FormState.displayName = 'Form.State';

/**
 * Form.State component to display the current state of the form.
 * It useful for debugging and understanding the form's current values, errors, and touched fields.
 */
export const FormState = Object.assign(_FormState, {
  DEFAULT_PROPS: {
    render: renderDefault,
  },
});
