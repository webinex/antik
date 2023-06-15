import { useFormNamespace } from './FormNamespace';
import { Settings } from './FormSettings';

function usePrefix() {
  const namespace = useFormNamespace();
  return namespace ? namespace + '.' : '';
}

function useKey(name: string) {
  const prefix = usePrefix();
  const key = prefix + name;
  return key.replace(/\[\d+\]/g, '');
}

export interface UseFormLabelArgs {
  name: string;
  label?: React.ReactNode | false;
}

export function useFormLabel(args: UseFormLabelArgs): React.ReactNode;
export function useFormLabel(name: string, label?: React.ReactNode | false): React.ReactNode;
export function useFormLabel(
  nameOrArgs: UseFormLabelArgs | string,
  label?: React.ReactNode | false,
): React.ReactNode {
  const name = typeof nameOrArgs === 'string' ? nameOrArgs : nameOrArgs.name;
  label = typeof nameOrArgs === 'string' ? label : nameOrArgs.label;

  const t = Settings.useTranslation();
  const key = useKey(name);

  if (label === false) {
    return undefined;
  }

  if (label && label !== true) {
    return label;
  }

  return t(key);
}
