import { TypeConfiguration } from './configuration';
import { Option } from './Option';

type LabelByFn<TOption extends Option = Option> = (option: TOption) => React.ReactNode;
type ValueByFn<TOption extends Option = Option> = (option: TOption) => string | number;
type SearchByFn<TOption extends Option = Option> = (option: TOption) => string;

/**
 * @deprecated Only for internal usage
 */
export interface __OptionSourceInternalTypes<TOption extends Option = Option> {
  LabelBy: LabelByFn<TOption>;
  ValueBy: ValueByFn<TOption>;
  SearchBy: SearchByFn<TOption>;
}

export interface OptionSource<TOption extends Option = Option> {
  /**
   * Defines how to extract the search string from an option.
   */
  searchBy?: TypeConfiguration['experimentalOptionSource'] extends true
    ? Extract<keyof TOption, string> | string | SearchByFn<TOption>
    : Extract<keyof TOption, string> | string;

  /**
   * Defines how to extract the value from an option.
   */
  valueBy?: TypeConfiguration['experimentalOptionSource'] extends true
    ? Extract<keyof TOption, string> | string | ValueByFn<TOption>
    : Extract<keyof TOption, string> | string;

  /**
   * Defines how to extract the label from an option.
   */
  labelBy?: TypeConfiguration['experimentalOptionSource'] extends true
    ? Extract<keyof TOption, string> | string | LabelByFn<TOption>
    : Extract<keyof TOption, string> | string;

  /**
   * Searches for options matching the given search string.
   * @param searchString The search string to filter options.
   * @returns Options that match the search string.
   */
  search: (searchString: string | undefined) => Promise<TOption[]>;
}

type EntireLoadFn<TOption extends Option = Option> = () => Promise<TOption[]>;
interface EntireLoadOptions<TOption extends Option = Option>
  extends Pick<OptionSource<TOption>, 'labelBy' | 'searchBy' | 'valueBy'> {
  fn: EntireLoadFn<TOption>;
}

const EMPTY_ARRAY: readonly Option[] = Object.freeze([] as Option[]);
export const EMPTY_OPTION_SOURCE: OptionSource = {
  search: () => Promise.resolve(EMPTY_ARRAY as Option[]),
};

export function emptyOptionSource<TOption extends Option = Option>() {
  return EMPTY_OPTION_SOURCE as any as OptionSource<TOption>;
}

export function createEntireLoadOptionSource<TOption extends Option = Option>(
  fnOrOptions: EntireLoadFn<TOption> | EntireLoadOptions<TOption>,
): OptionSource<TOption> {
  const options: EntireLoadOptions<TOption> =
    typeof fnOrOptions === 'function' ? { fn: fnOrOptions } : fnOrOptions;
  const source = new EntireLoadOptionSource<TOption>(options);
  return {
    search: source.search,
    searchBy: options.searchBy,
    labelBy: options.labelBy,
    valueBy: options.valueBy,
  };
}

class EntireLoadOptionSource<TOption extends Option = Option> implements OptionSource<TOption> {
  private _options: EntireLoadOptions<TOption>;
  private _source: Promise<TOption[]>;
  private _resolve!: (value: TOption[]) => any;
  private _resolved: boolean = false;
  private _fetching: boolean = false;

  constructor(options: EntireLoadOptions<TOption>) {
    this._options = options;

    this._source = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  public search = async (text: string | undefined) => {
    if (this._resolved || this._fetching) {
      return await this._source.then((items) => this.filter(items, text));
    }

    this._fetching = true;
    this._options
      .fn()
      .then(this._resolve)
      .finally(() => (this._fetching = false));

    return this._source.then((items) => this.filter(items, text));
  };

  private filter(items: TOption[], text: string | undefined) {
    if (text == null) {
      return items;
    }

    const filterFn = (option: TOption) => {
      const searchValue = OptionSourceUtil.searchValueOf(this._options.searchBy, option) ?? '';
      return searchValue.toLowerCase().includes(text.toLowerCase());
    };

    return items.filter(filterFn);
  }
}

export const OptionSourceUtil = {
  /**
   * Returns a function that extracts the search string value from an option.
   *
   * Resolution order:
   * - If `searchBy` is a function — that function is called with the option.
   * - If `searchBy` is a string — it is treated as the key of the option's field.
   * - Otherwise, if the option has a string `label` field — that value is used.
   * - If none of the above apply — returns `null`.
   *
   * This utility provides a unified way to get a "searchable value" from an option,
   * regardless of whether it was configured via function, property name, or falls back to `label`.
   *
   * @param searchBy The option source `searchBy` configuration.
   * @returns A function `(option: TOption) => string | null` that extracts the search value from the option.
   */
  searchByFn: <TOption extends Option>(searchBy: OptionSource<TOption>['searchBy']) => {
    return (option: TOption) => {
      if (typeof searchBy === 'function') {
        return (searchBy as SearchByFn<TOption>)(option);
      } else if (typeof searchBy === 'string') {
        return option[searchBy] as string;
      } else if (typeof option['label'] === 'string') {
        return option['label'] as string;
      } else {
        return null;
      }
    };
  },

  /**
   * Extracts the search string value from a given option.
   * Refer to {@link OptionSourceUtil.searchByFn} for detailed behavior.
   *
   * @param searchBy The option source `searchBy` configuration.
   * @param option The option object from which the search value should be extracted.
   * @returns The extracted string value, or `null` if no valid value is found.
   */
  searchValueOf: <TOption extends Option>(searchBy: OptionSource<TOption>['searchBy'], option: TOption) => {
    return OptionSourceUtil.searchByFn(searchBy)(option);
  },

  labelByFn: <TOption extends Option>(labelBy: OptionSource<TOption>['labelBy']) => {
    return (option: TOption) => {
      if (typeof labelBy === 'function') {
        return (labelBy as LabelByFn<TOption>)(option);
      } else if (typeof labelBy === 'string') {
        return option[labelBy] as React.ReactNode;
      } else {
        return option['label'] as React.ReactNode;
      }
    };
  },

  labelOf: <TOption extends Option>(labelBy: OptionSource<TOption>['labelBy'], option: TOption) => {
    return OptionSourceUtil.labelByFn(labelBy)(option);
  },

  valueByFn: <TOption extends Option>(valueBy: OptionSource<TOption>['valueBy']) => {
    return (option: TOption) => {
      if (typeof valueBy === 'function') {
        return (valueBy as ValueByFn<TOption>)(option);
      } else if (typeof valueBy === 'string') {
        return option[valueBy] as string | number;
      } else {
        return option['value'] as string | number;
      }
    };
  },

  valueOf: <TOption extends Option>(valueBy: OptionSource<TOption>['valueBy'], option: TOption) => {
    return OptionSourceUtil.valueByFn(valueBy)(option);
  },
};
