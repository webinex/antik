import { useFieldSetDisabled } from './FormFieldSet';

export function useFormFieldDisabled(disabled?: boolean): boolean;
export function useFormFieldDisabled(propsOrDisabled: { disabled?: boolean }): boolean;
export function useFormFieldDisabled(propsOrDisabled: { disabled?: boolean } | boolean | undefined): boolean {
  const disabled = typeof propsOrDisabled === 'object' ? propsOrDisabled.disabled : propsOrDisabled;
  const fieldSetDisabled = useFieldSetDisabled() ?? false;

  return fieldSetDisabled || disabled || false;
}
