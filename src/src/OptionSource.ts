import { Option } from './Option';

export interface OptionSource<TOption extends Option = Option> {
  searchBy?: Extract<keyof TOption, string> | string;
  valueBy?: Extract<keyof TOption, string> | string;
  labelBy?: Extract<keyof TOption, string> | string;
  search: (searchString: string | undefined) => Promise<TOption[]>;
}

type EntireLoadFn<TOption extends Option = Option> = () => Promise<TOption[]>;
interface EntireLoadOptions<TOption extends Option = Option> {
  fn: EntireLoadFn<TOption>;
  searchBy?: Extract<keyof TOption, string> | string;
  valueBy?: Extract<keyof TOption, string> | string;
  labelBy?: Extract<keyof TOption, string> | string;
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

    return items.filter((item) =>
      (item[this._options.searchBy ?? 'label'] as string).toLowerCase().includes(text.toLowerCase()),
    );
  }
}
