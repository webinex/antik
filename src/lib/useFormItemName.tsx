import { useFormItemContext } from './FormItemContext';

export function useFormItemName(name: string | undefined, absolute = true): string {
  const { name: itemName } = useFormItemContext() ?? {};

  if (name && absolute) {
    return name;
  }

  if (itemName == null && name == null)
    throw new Error('`<Form.Item /> might wrap component or `name` should be provided');

  return itemName ? (name ? itemName + '.' + name : itemName) : name!;
}
