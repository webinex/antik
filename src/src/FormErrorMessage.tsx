import { useField } from 'formik';
import { FC, memo, useMemo } from 'react';
import { Settings } from './FormSettings';

export interface UseFormErrorMessageArgs {
  name: string;
  label?: React.ReactNode;
  mode?: 'touched' | 'always';
}

export type FormErrorMessageProps = UseFormErrorMessageArgs;

function isKeyError(x: any): x is { key: string } {
  return typeof x === 'object' && x.hasOwnProperty('key') && x['key'] != null;
}

function useError(args: UseFormErrorMessageArgs) {
  const { name, label } = args;
  const [, { error }] = useField(name);
  const t = Settings.useTranslation();

  return useMemo(() => {
    if (typeof error === 'string') {
      return error;
    }

    if (isKeyError(error)) {
      const keyed = error as { key: string };
      return t(`errors.${keyed.key}`, { ...keyed, label });
    }

    return String(error).toString();
  }, [error, t, label]);
}

function useShow(args: UseFormErrorMessageArgs) {
  const { name, mode = 'touched' } = args;
  const [, { error, touched }] = useField(name);
  const hasError = !!error;

  return useMemo(() => hasError && (mode === 'always' || touched), [hasError, mode, touched]);
}

export function useFormErrorMessage(args: UseFormErrorMessageArgs) {
  const show = useShow(args);
  const error = useError(args);
  return useMemo(() => ({ show, error }), [show, error]);
}

const _FormErrorMessage: FC<ReturnType<typeof useFormErrorMessage>> = memo((props) => {
  const { error, show } = props;

  if (!show) {
    return null;
  }

  return <span>{error}</span>;
});

_FormErrorMessage.displayName = 'Form.ErrorMessage';

export const FormErrorMessage: FC<FormErrorMessageProps> = (props) => {
  const errors = useFormErrorMessage(props);
  return <_FormErrorMessage {...errors} />;
};

FormErrorMessage.displayName = 'Form.ErrorMessage';
