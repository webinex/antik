import * as React from 'react';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';
import { Form } from './../src';
import type { DefaultOptionType } from 'antd/es/select';
import type { CheckboxOptionType } from 'antd';
import { useUsersOptionSource } from './useUserOptionSource';
import { useTranslation } from './useTranslation';

Form.settings.useTranslation = useTranslation;

Form.Item.defaultProps = {
  colon: false,
};

Form.defaultProps = {
  layout: 'vertical',
};

const SCHEMA = Yup.object({
  checkbox: Yup.bool().required(),
  firstName: Yup.string().nullable().required(),
});

function Track() {
  const { values, errors, touched } = useFormikContext();
  return <pre>{JSON.stringify({ values, errors, touched }, undefined, 2)}</pre>;
}

const INITIAL_VALUE = {
  firstName: '',
  number: 0,
  select: 0,
  asyncSelect: null,
  asyncMultiSelect: [],
  checkbox: false,
  checkboxGroup: [],
  textArea: '',
  radioGroup: 1,
  switch: null,
  datePicker: null,
};

function onSubmit() {}

const SELECT_OPTIONS: DefaultOptionType[] = Array.from(new Array(30)).map((_, index) => ({
  value: index,
  label: `Value ${index}`,
}));

const CHECKBOX_OPTIONS: CheckboxOptionType[] = Array.from(new Array(10)).map((_, index) => ({
  value: index,
  label: `Value ${index}`,
}));

function Watch() {
  const value = Form.useWatch('form', 'firstName');
  return (
    <div>
      <div>Watch:</div>
      <div>{value}</div>
    </div>
  );
}

export function App() {
  const userSource = useUsersOptionSource();

  return (
    <>
      <Watch />
      <br />
      <Form.Formik uid="form" initialValues={INITIAL_VALUE} onSubmit={onSubmit} validationSchema={SCHEMA}>
        <Form>
          <Form.Item name="firstName" required>
            <Form.Input />
          </Form.Item>
          <Form.Item name="firstName">
            <Form.Text />
          </Form.Item>
          <Form.Item name="number">
            <Form.InputNumber />
          </Form.Item>
          <Form.Item name="select">
            <Form.Select options={SELECT_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="checkbox" labelAlign="left" label={false} required>
            <Form.Checkbox />
          </Form.Item>
          <Form.Item name="checkboxGroup" required>
            <Form.CheckboxGroup options={CHECKBOX_OPTIONS} />
          </Form.Item>
          <Form.Item name="radioGroup" required>
            <Form.RadioGroup options={CHECKBOX_OPTIONS} />
          </Form.Item>
          <Form.Item name="switch" label={false}>
            <Form.Switch checkedChildren="On" unCheckedChildren="Off" />
          </Form.Item>
          <Form.Item name="datePicker">
            <Form.DatePicker />
          </Form.Item>
          <Form.Item name="textArea">
            <Form.TextArea />
          </Form.Item>
          <Track />
        </Form>
      </Form.Formik>
    </>
  );
}
