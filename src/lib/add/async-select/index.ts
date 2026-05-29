import { Form } from '@webinex/antik';
import { FormAsyncSelect } from './FormAsyncSelect';
import { useAsyncSelect } from './useAsyncSelect';

Form.AsyncSelect = FormAsyncSelect;
Form.useAsyncSelect = useAsyncSelect;

export { type UseAsyncSelectArgs, type UseAsyncSelectResult, useAsyncSelect } from './useAsyncSelect';
export { FormAsyncSelect, type FormAsyncSelectProps } from './FormAsyncSelect';
