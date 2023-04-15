import { FormSettings } from '../src';

function translate(key: string, value: any) {
  let result = '';

  for (const char of key) {
    if (result.length === 0) {
      result += char.toUpperCase();
      continue;
    }

    if (char.toUpperCase() === char && result.at(-1) !== result.at(-1)!.toUpperCase()) {
      result += ' ' + char.toLowerCase();
      continue;
    }

    result += char;
  }

  return result;
}

export const useTranslation: FormSettings['useTranslation'] = () => {
  return translate;
};
