import { FormItem } from './FormItem';
import { FormInput } from './FormInput';
import { FormFormik } from './FormFormik';
import { FormSubmit } from './FormSubmit';
import { FormFieldSet } from './FormFieldSet';
import { FormForm } from './FormForm';
import { FormSelect } from './FormSelect';
import { FormCheckbox } from './FormCheckbox';
import { FormTextArea } from './FormTextArea';
import { FormDatePicker } from './FormDatePicker';
import { FormInputNumber } from './FormInputNumber';
import { FormRadioGroup } from './FormRadioGroup';
import { FormErrorMessage } from './FormErrorMessage';
import { FormSwitch } from './FormSwitch';
import { FormCheckboxGroup } from './FormCheckboxGroup';
import { FormText } from './FormText';
import { useFormWatch } from './useFormWatch';
import { useFormRef, useFormSubmit } from './useFormRef';
import { useFormLabel } from './useFormLabel';
import { useFormFieldDisabled } from './useFormFieldDisabled';
import { useFormItemName } from './useFormItemName';
import { Settings, FormSettings } from './FormSettings';
import { useFormValidate } from './useFormValidate';
import { FormTimePicker } from './FormTimePicker';

const BUILT_IN = {
  Item: FormItem,
  Input: FormInput,
  TextArea: FormTextArea,
  Text: FormText,
  Formik: FormFormik,
  Submit: FormSubmit,
  FieldSet: FormFieldSet,
  Select: FormSelect,
  Checkbox: FormCheckbox,
  DatePicker: FormDatePicker,
  TimePicker: FormTimePicker,
  InputNumber: FormInputNumber,
  RadioGroup: FormRadioGroup,
  ErrorMessage: FormErrorMessage,
  Switch: FormSwitch,
  CheckboxGroup: FormCheckboxGroup,
  useWatch: useFormWatch,
  useRef: useFormRef,
  useSubmit: useFormSubmit,
  useLabel: useFormLabel,
  useDisabled: useFormFieldDisabled,
  useName: useFormItemName,
  useValidate: useFormValidate,
};

export interface FormExtensions {}

export type FormType = typeof FormForm;

export const Form: FormType & typeof BUILT_IN & FormExtensions & { settings: FormSettings } = Object.assign(
  FormForm,
  BUILT_IN,
  {} as FormExtensions,
  { settings: Settings },
);
