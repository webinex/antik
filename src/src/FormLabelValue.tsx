import { useFormItemName } from './useFormItemName';
import { useFormLabel } from './useFormLabel';

export interface FormLabelValueProps {
  name?: string;
}

export function FormLabelValue(props: FormLabelValueProps) {
  const name = useFormItemName(props.name);
  return useFormLabel(name);
}
