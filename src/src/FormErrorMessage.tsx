import { useField } from 'formik';
import { FC, memo, useMemo } from 'react';
import { Settings } from './FormSettings';

export interface UseFormErrorMessageArgs {
  name: string;
  label?: React.ReactNode;
  className?: string;
  mode?: 'touched' | 'always';
  style?: React.CSSProperties;
}

export interface FormErrorMessageRenderArgs {
  error: string;
}

export type FormErrorMessageProps = UseFormErrorMessageArgs & {
  /**
   * Allows custom rendering of the error message.
   *
   * @param args error message render arguments
   * @returns content to be displayed
   */
  render?: (args: FormErrorMessageRenderArgs) => React.ReactNode;
};

function isKeyError(x: any): x is { key: string } {
  return typeof x === 'object' && x.hasOwnProperty('key') && x['key'] != null;
}

function countOfKeysOfObject(obj: Record<string, any>): number {
  let count = 0;

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      count += countOfKeysOfArray(value);
    } else if (typeof value === 'object' && value !== null) {
      count += countOfKeysOfObject(value);
    } else {
      count++;
    }
  });

  return count;
}

function countOfKeysOfArray(arr: any[]): number {
  let count = 0;

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      count += countOfKeysOfArray(item);
    } else if (typeof item === 'object' && item !== null) {
      count += countOfKeysOfObject(item);
    } else {
      count++;
    }
  });

  return count;
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

    if (Array.isArray(error)) {
      return t(`errors.inner`, { count: countOfKeysOfArray(error), label, error });
    }

    if (typeof error === 'object' && error !== null) {
      const count = countOfKeysOfObject(error);
      if (count > 0) {
        return t(`errors.inner`, { count, label, error });
      }
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

const _FormErrorMessage: FC<
  ReturnType<typeof useFormErrorMessage> & Pick<FormErrorMessageProps, 'render' | 'className' | 'style'>
> = memo((props) => {
  const { error, show, render, className, style } = props;

  if (!show) {
    return null;
  }

  if (render) {
    return render({ error });
  }

  return (
    <span className={className} style={style}>
      {error}
    </span>
  );
});

_FormErrorMessage.displayName = 'Form.ErrorMessage';

export const FormErrorMessage: FC<FormErrorMessageProps> = (props) => {
  const { render, className, style } = props;
  const errors = useFormErrorMessage(props);
  return <_FormErrorMessage {...errors} render={render} className={className} style={style} />;
};

FormErrorMessage.displayName = _FormErrorMessage.displayName;
