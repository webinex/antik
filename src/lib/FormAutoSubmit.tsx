import { useFormikContext } from 'formik';
import { memo, useEffect, useRef, useMemo } from 'react';
import { shallowEqual } from './shallowEqual';

export interface FormAutoSubmitProps<TFormValue extends object = any> {
  /**
   * Should the form be submitted automatically when the form is pristine (no changes made)?
   * @default false (configurable via Form.AutoSubmit.defaults.pristine)
   */
  pristine?: boolean;

  /**
   *
   * @param prevValues Previous form values
   * @param currentValues Current form values
   * @returns True if the form values are considered equal and should not trigger a submit.
   * @default undefined shallow comparison (configurable via Form.AutoSubmit.defaults.compare)
   */
  compare?: (prevValues: TFormValue, currentValues: TFormValue) => boolean;
}

const FormAutoSubmitComponent = memo(<TFormValue extends object = any,>(props: FormAutoSubmitProps<TFormValue>) => {
  const { pristine, compare } = Object.assign({}, FormAutoSubmit.defaults, props);
  const { errors, touched, values, submitForm } = useFormikContext<TFormValue>();

  const isFirstRender = useRef(true);
  const prevValuesRef = useRef<TFormValue>(values);

  const skipPristine = useMemo(() => pristine && Object.keys(touched).length === 0, [pristine, touched]);
  const skipErrored = useMemo(() => Object.keys(errors).length > 0, [errors]);

  useEffect(() => {
    const prevValues = prevValuesRef.current;
    prevValuesRef.current = values;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (compare!(prevValues, values) || skipErrored || skipPristine) {
      return;
    }

    submitForm();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, skipErrored, skipPristine]);

  return <></>;
});

FormAutoSubmitComponent.displayName = 'Form.AutoSubmit';

export const FormAutoSubmit = /* @__PURE__ */ Object.assign(FormAutoSubmitComponent, {
  defaults: {
    pristine: true,
    compare: shallowEqual,
  } as Partial<FormAutoSubmitProps<any>>,
});
