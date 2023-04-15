import { FC, useCallback } from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import { useFormRef } from './useFormRef';
import { Button, ButtonProps } from 'antd';
import { useFieldSetDisabled } from './FormFieldSet';

export interface FormSubmitProps extends ButtonProps {
  uid?: string;
  onSubmitted?: () => any;
}

const useHandleClick = (
  { onSubmitted, onClick }: FormSubmitProps,
  formik: { current: FormikContextType<any> | undefined },
) => {
  return useCallback(
    async (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
      const errors = await formik.current!.validateForm();
      const isValid = Object.keys(errors).length === 0;
      await formik.current!.submitForm();
      isValid && onSubmitted && onSubmitted();
      onClick && onClick(e);
    },
    [formik, onSubmitted, onClick],
  );
};

function SubmitCurrentForm(props: FormSubmitProps) {
  const formik = useFormikContext();
  const handleClick = useHandleClick(props, { current: formik });
  return <Button {...props} onClick={handleClick} />;
}

function SubmitForm(props: FormSubmitProps) {
  const { uid, onSubmitted, ...otherProps } = props;
  const form = useFormRef(uid!);
  const handleClick = useHandleClick(props, form);
  return <Button {...otherProps} onClick={handleClick} />;
}

export const FormSubmit: FC<FormSubmitProps> = (props) => {
  const fieldSetDisabled = useFieldSetDisabled();
  const disabled = props.disabled ?? fieldSetDisabled;
  return props.uid ? (
    <SubmitForm {...props} disabled={disabled} />
  ) : (
    <SubmitCurrentForm {...props} disabled={disabled} />
  );
};
