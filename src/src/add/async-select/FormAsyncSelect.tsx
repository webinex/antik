import { Option, FormSelectProps, Form, fc, FormExtensions } from '@webinex/antik';
import { UseAsyncSelectArgs, UseAsyncSelectResult, useAsyncSelect } from './useAsyncSelect';
import { useEffect } from 'react';

export type { FormExtensions };

declare module '@webinex/antik' {
  interface FormExtensions {
    AsyncSelect: typeof FormAsyncSelect;
    useAsyncSelect: typeof useAsyncSelect;
  }
}

export interface FormAsyncSelectProps<ValueType, OptionType extends Option>
  extends UseAsyncSelectArgs<OptionType>,
    Omit<FormSelectProps<ValueType, OptionType>, keyof UseAsyncSelectResult<OptionType>> {
  onSearchLoad?: (options: OptionType[]) => any;
}

const _FormAsyncSelect = <ValueType, OptionType extends Option>(
  props: FormAsyncSelectProps<ValueType, OptionType>,
) => {
  const { optionSource, preload, always, onSearchLoad, ...selectProps } = props;
  const [asyncSelect, asyncSelectState] = useAsyncSelect({ optionSource, preload, always });

  const [
    {
      options: { isFetching, currentData },
    },
  ] = asyncSelectState;

  useEffect(() => {
    onSearchLoad && onSearchLoad(currentData ?? []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, onSearchLoad]);

  return <Form.Select<ValueType, OptionType> {...asyncSelect} {...selectProps} showSearch />;
};

export const FormAsyncSelect = fc(_FormAsyncSelect);

Form.AsyncSelect = FormAsyncSelect;
Form.useAsyncSelect = useAsyncSelect;
