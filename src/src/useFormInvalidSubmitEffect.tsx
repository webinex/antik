import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';

export interface UseFormInvalidSubmitEffectArgs {
  onInvalidSubmit?: () => void;
}

export function useFormInvalidSubmitEffect(args: UseFormInvalidSubmitEffectArgs) {
  const { onInvalidSubmit } = args;
  const { isValid, submitCount } = useFormikContext();
  const prevSubmitCountRef = useRef(submitCount);

  useEffect(() => {
    const prevSubmitCount = prevSubmitCountRef.current;
    prevSubmitCountRef.current = submitCount;

    if (submitCount !== prevSubmitCount && submitCount > 0 && !isValid) {
      onInvalidSubmit?.();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);
}
