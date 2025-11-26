import { Option, FormSelectProps, Form, fc, FormExtensions } from '@webinex/antik';
import {
  UseAsyncSelectArgs,
  UseAsyncSelectResult,
  extendWithValueByAndLabelBy,
  omitExtendedValueByAndLabelBy,
  useAsyncSelect,
} from './useAsyncSelect';
import { useEffect, useMemo } from 'react';

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
  const mapGetAndSet = useMapGetAndSet(props);

  const [
    {
      options: { isFetching, currentData },
    },
  ] = asyncSelectState;

  useEffect(() => {
    onSearchLoad && onSearchLoad(currentData ?? []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, onSearchLoad]);

  return (
    <Form.Select<ValueType, OptionType> {...asyncSelect} {...selectProps} {...mapGetAndSet} showSearch />
  );
};

export const FormAsyncSelect = fc(_FormAsyncSelect);

Form.AsyncSelect = FormAsyncSelect;
Form.useAsyncSelect = useAsyncSelect;

function useMapGetAndSet<ValueType, OptionType extends Option>(
  props: FormAsyncSelectProps<ValueType, OptionType>,
) {
  const { mapGet: mapGetProp, mapSet: mapSetProp } = props;
  const { labelBy, valueBy } = props.optionSource;

  return useMemo((): Pick<FormSelectProps<ValueType, Option>, 'mapGet' | 'mapSet'> => {
    const mapGet = mapGetProp ?? Form.Select.DEFAULT_PROPS.mapGet!;
    const mapSet = mapSetProp ?? Form.Select.DEFAULT_PROPS.mapSet!;

    if (typeof labelBy !== 'function' && typeof valueBy !== 'function') {
      return {};
    }

    return {
      mapGet: (field) => {
        const result = mapGet(field);
        const map = (value: any) =>
          value && typeof value === 'object'
            ? extendWithValueByAndLabelBy([value], { valueBy, labelBy })[0]
            : value;
        return Array.isArray(result) ? result.map(map) : map(result);
      },

      mapSet: (value) => {
        const map = (option: any) =>
          value && typeof option === 'object' ? omitExtendedValueByAndLabelBy(option) : option;
        const cleanedValue = Array.isArray(value) ? value.map(map) : map(value);
        return mapSet!(cleanedValue);
      },
    };
  }, [labelBy, valueBy, mapSetProp, mapGetProp]);
}
