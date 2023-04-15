import { useEffect } from 'react';
import { Formik, FormikConfig, FormikContextType, FormikValues, useFormikContext } from 'formik';
import { FormNamespaceContext } from '../FormNamespace';
import { FormMap } from '../FormMap';

interface Extension<T> {
  uid: string;
  children: JSX.Element | ((formik: FormikContextType<T>) => JSX.Element);
  namespace?: string;
}

type FormikWithoutChildren<T> = Omit<FormikConfig<T>, 'children'>;
export type FormFormikProps<T = any> = FormikWithoutChildren<T> & Extension<T>;

function useRegistration(uid: string) {
  const formik = useFormikContext();

  useEffect(() => {
    FormMap.set(uid, formik);
  }, [formik, uid]);

  useEffect(() => {
    return () => {
      FormMap.destroy(uid);
    };
  }, [uid]);
}

function Render(props: { uid: string; children: FormFormikProps['children'] }) {
  const { children, uid } = props;
  const formik = useFormikContext();
  useRegistration(uid);

  return typeof children === 'function' ? children(formik) : children;
}

export function FormFormik<T extends FormikValues>(props: FormFormikProps<T>) {
  const { uid, children, namespace, ...formikProps } = props;

  return (
    <FormNamespaceContext.Provider value={namespace}>
      <Formik<T> {...formikProps}>
        <Render uid={uid} children={children} />
      </Formik>
    </FormNamespaceContext.Provider>
  );
}
