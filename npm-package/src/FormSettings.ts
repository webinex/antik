export interface FormSettings {
  useTranslation: () => (key: string, values?: any) => string;
}

const t = (key: string) => key;

export const Settings: FormSettings = {
  useTranslation: () => t,
};
