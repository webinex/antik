import * as React from 'react';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';
import { Form } from './../src';
import type { DefaultOptionType } from 'antd/es/select';
import { Typography, type CheckboxOptionType } from 'antd';
import { useUsersOptionSource } from './useUserOptionSource';
import { useTranslation } from './useTranslation';
import './App.css';

import { FormAsyncSelect } from './../src/add/async-select/FormAsyncSelect';
import { FormObjectErrorDemo } from './FormObjectErrorDemo';
import { FormInvalidSubmitExample } from './FormInvalidSubmitExample';
import { FormAutoSubmitExample } from './FormAutoSubmitExample';
import { FormAsyncSelectWithLabelByExample } from './FormAsyncSelectWithLabelByExample';

const error = console.error;
console.error = (...args) => {
  if (args[0].startsWith('Warning:')) {
    console.warn(...args);
  } else {
    error(...args);
  }
};

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
  password: null!,
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
  dateTimePicker: null,
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
      <Typography.Text>Watch:</Typography.Text>
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
      <Form
        type="formik"
        uid="form"
        initialValues={INITIAL_VALUE}
        onSubmit={onSubmit}
        validationSchema={SCHEMA}
      >
        <Form.Item name="firstName" required>
          <Form.Input />
        </Form.Item>
        <Form.Item name="firstName">
          <Form.Text />
        </Form.Item>
        <Form.Item name="password">
          <Form.Password />
        </Form.Item>
        <Form.Item name="number">
          <Form.InputNumber />
        </Form.Item>
        <Form.Item name="select">
          <Form.Select options={SELECT_OPTIONS} allowClear />
        </Form.Item>
        <Form.Item name="asyncSelect">
          <FormAsyncSelect optionSource={userSource} allowClear />
        </Form.Item>
        <Form.Item name="checkbox" label={false} required>
          <Form.Checkbox>
            <Form.LabelValue />
          </Form.Checkbox>
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
        <Form.Item name="dateTimePicker">
          <Form.DatePicker format={'DD/MM/YYYY HH:mm'} />
        </Form.Item>
        <Form.Item name="textArea">
          <Form.TextArea name="textArea" />
        </Form.Item>
        <Track />
      </Form>

      <Typography.Title level={3}>Form function body example</Typography.Title>
      <Form type="formik" uid="form-values-example" initialValues={{ value: '123' }} onSubmit={() => {}}>
        {({ values, errors }) => <pre>{JSON.stringify({ values, errors }, undefined, 4)}</pre>}
      </Form>

      <Typography.Title level={3}>Form Object error</Typography.Title>
      <FormObjectErrorDemo />

      <FormInvalidSubmitExample />
      <FormAutoSubmitExample />
      <FormAsyncSelectWithLabelByExample />
    </>
  );
}
