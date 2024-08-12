import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Option, OptionSource } from '@webinex/antik';
import type { SelectProps } from 'antd';

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
  const prevRef = useRef<string>();
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

  useEffect(() => {
    const shouldFetch = !isFirstRenderRef.current || preload;
    isFirstRenderRef.current = false;

    if (!shouldFetch) {
      return;
    }

    fetch(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, searchValue, preload]);
}

function useOptions<OptionType extends Option>(
  args: UseAsyncSelectArgs<OptionType>,
  [state]: UseAsyncSelectState<OptionType>,
) {
  const { options } = state;
  const { data } = options;
  const {
    always,
    optionSource: { valueBy },
  } = args;

  return useMemo<OptionType[]>(() => {
    const alwaysOptions = Array.isArray(always) ? always : always !== undefined ? [always] : [];
    let options: OptionType[] = [...(data ?? [])];

    if (alwaysOptions.length === 0) {
      return options;
    }

    alwaysOptions.forEach((option) => {
      if (!options.some((x) => x[valueBy!] === option[valueBy!])) {
        options.unshift(option);
      }
    });

    return options;
  }, [always, valueBy, data]);
}

function useOnDropdownVisibleChange<OptionType extends Option>(
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

function useOnSearch<OptionType extends Option>(reducer: UseAsyncSelectState<OptionType>) {
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
  const onDropdownVisibleChange = useOnDropdownVisibleChange(args, reducer);
  const onSearch = useOnSearch(reducer);
  const {
    optionSource: { labelBy, valueBy },
  } = args;

  const props = useMemo<UseAsyncSelectResult<OptionType>[0]>(
    () => ({
      loading: isFetching,
      onDropdownVisibleChange,
      options,
      onSearch,
      searchValue,
      filterOption: false,
      fieldNames: { label: labelBy, value: valueBy },
    }),
    [isFetching, onDropdownVisibleChange, options, onSearch, searchValue, labelBy, valueBy],
  );

  return useMemo(() => [props, reducer], [props, reducer]);
}
