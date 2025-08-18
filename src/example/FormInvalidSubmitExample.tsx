import * as React from 'react';
import * as Yup from 'yup';
import { Form } from '../src';
import { Typography } from 'antd';

const SCHEMA = Yup.object({
  input: Yup.string().nullable().required(),
});

const INITIAL_VALUE: Yup.InferType<typeof SCHEMA> = {
  input: null!,
};

export function FormInvalidSubmitExample() {
  return (
    <div>
      <Typography.Title level={2}>Form Invalid Submit Example</Typography.Title>
      <Typography.Paragraph>
        This example demonstrates how to handle form submission when there are validation errors. The form
        will not submit if there are validation errors, and an alert will be shown instead.
      </Typography.Paragraph>

      <Form
        type="formik"
        uid="form-invalid-submit-example"
        initialValues={INITIAL_VALUE}
        validationSchema={SCHEMA}
        onSubmit={() => alert('Submitted!')}
        onInvalidSubmit={() => alert('There validation errors on the form!')}
      >
        <Form.Item name="input" required>
          <Form.Input />
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Form.Submit type="primary">Submit From</Form.Submit>
        </div>
      </Form>
    </div>
  );
}
