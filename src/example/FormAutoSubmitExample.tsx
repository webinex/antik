import * as React from 'react';
import { Typography } from 'antd';
import * as Yup from 'yup';
import { Form } from '../src';

const INITIAL_VALUE: Yup.InferType<typeof SCHEMA> = {
  value: null!,
};

const SCHEMA = Yup.object({
  value: Yup.string().required().notOneOf(['invalid']),
});

export function FormAutoSubmitExample() {
  const [submittedValue, setSubmittedValue] = React.useState<Yup.InferType<typeof SCHEMA>>();

  return (
    <div>
      <Typography.Title level={2}>Form Auto Submit Example</Typography.Title>
      <Typography.Paragraph>
        This example demonstrates how to automatically submit a form when the value changes, provided that the
        validation schema is satisfied.
      </Typography.Paragraph>

      <Form
        type="formik"
        initialValues={INITIAL_VALUE}
        validationSchema={SCHEMA}
        onSubmit={setSubmittedValue}
        uid="form-auto-submit-example"
      >
        <Form.AutoSubmit />

        <Form.Item
          name="value"
          required
          extra="This field will auto-submit the form when changed. (This field is required and doesn't allow 'invalid' as a value)"
        >
          <Form.Input />
        </Form.Item>

        <pre style={{ marginTop: '2rem' }}>
          {submittedValue ? JSON.stringify(submittedValue, null, 2) : 'No value submitted yet.'}
        </pre>
      </Form>
    </div>
  );
}
