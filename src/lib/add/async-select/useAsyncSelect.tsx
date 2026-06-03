import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Option, OptionSource, __OptionSourceInternalTypes } from '@webinex/antik';
import type { SelectProps } from 'antd';
import { OptionSourceUtil } from '@webinex/antik';

export const ASYNC_SELECT_EXTENDED_VALUE_FIELD = '__extend__value';
export const ASYNC_SELECT_EXTENDED_LABEL_FIELD = '__extend__label';

interface AsyncSelectOptionsState<OptionType extends Option> {
  data: OptionType[] | undefined;
  currentData: OptionType[] | undefined;
  error: any | undefined;
  isUninitialized: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface AsyncSelectState<OptionType extends Option> {
  searchValue: string;
  options: AsyncSelectOptionsState<OptionType>;
}

function useAsyncSelectState<OptionType extends Option>() {
  return useState<AsyncSelectState<OptionType>>({
    searchValue: '',
    options: {
      currentData: undefined,
      data: undefined,
      error: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      isSuccess: false,
      isUninitialized: true,
    },
  });
}

type UseAsyncSelectState<OptionType extends Option> = ReturnType<typeof useAsyncSelectState<OptionType>>;

function normalizeSearchString(searchString: string | undefined) {
  return !searchString || searchString.length === 0 ? undefined : searchString;
}

function useLazyQueryOptions<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
  [, setState]: UseAsyncSelectState<OptionType>,
) {
  const { optionSource } = args;
  const { search } = optionSource;
  const prevRef = useRef<string | undefined>(undefined);
  const isFirstCall = useRef<boolean>(true);

  return useCallback(
    (searchString: string | undefined) => {
      searchString = normalizeSearchString(searchString);

      if (prevRef.current === searchString && !isFirstCall.current) {
        return;
      }

      isFirstCall.current = false;
      prevRef.current = searchString;

      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          isUninitialized: false,
          isFetching: true,
          isLoading:
            prev.options.isUninitialized === false && prev.options.isLoading === false ? false : true,
          currentData: undefined,
        },
      }));

      search(searchString)
        .then((options) =>
          setState((prev) => ({
            ...prev,
            options: {
              ...prev.options,

              isSuccess: true,
              isError: false,
              error: undefined,
              currentData: options,
              data: options,
              isFetching: false,
              isLoading: false,
            },
          })),
        )
        .catch((error) =>
          setState((prev) => ({
            ...prev,
            options: {
              ...prev.options,
              data: undefined,
              currentData: undefined,
              error,
              isError: true,
              isFetching: false,
              isLoading: false,
              isSuccess: false,
              isUninitialized: false,
            },
          })),
        );
    },
    [setState, search],
  );
}

function useQueryOptions<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
  reducer: UseAsyncSelectState<OptionType>,
) {
  const [state] = reducer;
  const { searchValue } = state;
  const { preload } = args;
  const fetch = useLazyQueryOptions(args, reducer);
  const isFirstRenderRef = useRef(true);

  useEffect(
    () => {
      if (!preload) return;

      fetch(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    fetch(searchValue);
  }, [fetch, searchValue, preload]);
}

export function extendWithValueByAndLabelBy<OptionType extends Option>(
  options: OptionType[],
  getters: Pick<OptionSource<OptionType>, 'labelBy' | 'valueBy'>,
) {
  const { valueBy, labelBy } = getters;
  const labelByFn =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    typeof labelBy === 'function' ? (labelBy as __OptionSourceInternalTypes<OptionType>['LabelBy']) : null;
  const valueFn =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    typeof valueBy === 'function' ? (valueBy as __OptionSourceInternalTypes<OptionType>['ValueBy']) : null;

  if (!labelByFn && !valueFn) {
    return options;
  }

  return options.map((option) => {
    const extension: Record<string, any> = {};
    if (labelByFn) extension[ASYNC_SELECT_EXTENDED_LABEL_FIELD] = labelByFn(option);
    if (valueFn) extension[ASYNC_SELECT_EXTENDED_VALUE_FIELD] = valueFn(option);

    return {
      ...option,
      ...extension,
    };
  });
}

export function omitExtendedValueByAndLabelBy<OptionType extends Option>(option: OptionType) {
  if (ASYNC_SELECT_EXTENDED_LABEL_FIELD in option) {
    const { [ASYNC_SELECT_EXTENDED_LABEL_FIELD]: _, ...rest } = option as any;
    option = rest;
  }

  if (ASYNC_SELECT_EXTENDED_VALUE_FIELD in option) {
    const { [ASYNC_SELECT_EXTENDED_VALUE_FIELD]: _, ...rest } = option as any;
    option = rest;
  }

  return option;
}

function useOptions<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
  [state]: UseAsyncSelectState<OptionType>,
) {
  const { options } = state;
  const { data } = options;
  const {
    always,
    optionSource: { valueBy, labelBy },
  } = args;

  return useMemo<OptionType[]>(() => {
    function unshiftAlwaysOptions(options: OptionType[]) {
      if (!always) {
        return options;
      }

      const alwaysOptions = Array.isArray(always) ? always : [always];
      const valueFn = OptionSourceUtil.valueByFn(valueBy);
      alwaysOptions.forEach((option) => {
        if (!options.some((x) => valueFn(x) === valueFn(option))) {
          options.unshift(option);
        }
      });
      return options;
    }

    let options: OptionType[] = [...(data ?? [])];
    options = unshiftAlwaysOptions(options);
    options = extendWithValueByAndLabelBy(options, { valueBy, labelBy });
    return options;
  }, [always, valueBy, labelBy, data]);
}

function useDropdownVisibleChange<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
  reducer: UseAsyncSelectState<OptionType>,
) {
  const [state, setState] = reducer;
  const { searchValue } = state;
  const fetch = useLazyQueryOptions(args, reducer);

  return useCallback(
    (open: boolean) => {
      if (!open && searchValue?.length > 0) {
        setState((prev) => ({ ...prev, searchValue: '' }));
      }

      fetch(undefined);
    },
    [fetch, searchValue, setState],
  );
}

export type UseAsyncSelectResult<OptionType extends Option> = [
  Pick<
    SelectProps<any, OptionType>,
    'options' | 'searchValue' | 'onSearch' | 'loading' | 'onDropdownVisibleChange' | 'fieldNames'
  > & { filterOption: boolean },
  UseAsyncSelectState<OptionType>,
];

export interface UseAsyncSelectArgs<OptionType extends Option> {
  optionSource: OptionSource<OptionType>;
  preload?: boolean;
  always?: OptionType[];
}

function useSearch<OptionType extends Option>(reducer: UseAsyncSelectState<OptionType>) {
  const [, setState] = reducer;
  return useCallback((value: string) => setState((prev) => ({ ...prev, searchValue: value })), [setState]);
}

function useArgs<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
): UseAsyncSelectArgs<OptionType> {
  return useMemo(
    () => ({
      ...args,
      optionSource: { valueBy: 'value', labelBy: 'label', searchBy: 'label', ...args.optionSource },
    }),
    [args],
  );
}

function useFieldNames(args: UseAsyncSelectArgs<any>) {
  const {
    optionSource: { valueBy, labelBy },
  } = args;
  return useMemo((): SelectProps['fieldNames'] => {
    const labelProp =
      typeof labelBy === 'string'
        ? labelBy
        : typeof labelBy === 'function'
          ? ASYNC_SELECT_EXTENDED_LABEL_FIELD
          : undefined;

    const valueProp =
      typeof valueBy === 'string'
        ? valueBy
        : typeof valueBy === 'function'
          ? ASYNC_SELECT_EXTENDED_VALUE_FIELD
          : undefined;

    if (!labelProp && !valueProp) return undefined;

    return { label: labelProp, value: valueProp };
  }, [valueBy, labelBy]);
}

export function useAsyncSelect<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
): UseAsyncSelectResult<OptionType> {
  args = useArgs(args);

  const reducer = useAsyncSelectState<OptionType>();
  const [state] = reducer;
  const {
    options: { isFetching },
    searchValue,
  } = state;

  const options = useOptions<OptionType>(args, reducer);
  useQueryOptions<OptionType>(args, reducer);
  const onDropdownVisibleChange = useDropdownVisibleChange(args, reducer);
  const onSearch = useSearch(reducer);
  const fieldNames = useFieldNames(args);

  const props = useMemo<UseAsyncSelectResult<OptionType>[0]>(
    () => ({
      loading: isFetching,
      onDropdownVisibleChange,
      options,
      onSearch,
      searchValue,
      filterOption: false,
      fieldNames: fieldNames,
    }),
    [isFetching, onDropdownVisibleChange, options, onSearch, searchValue, fieldNames],
  );

  return useMemo(() => [props, reducer], [props, reducer]);
}
