import React from 'react';
/* no-line-below */
import { PrintValue } from './PrintValue';
import { Form } from '@webinex/antik';

export default function PageForm() {
  return (
    <Form
      /* no-line-below */
      uid="form"
      /* no-line-below */
      type="formik"
      // ...
      initialValues={{ firstName: '' }}
      /* no-line-below */
      onSubmit={() => {}}
      /* no-line-below */
      layout="vertical"
    >
      <Form.Item name="firstName" required>
        <Form.Input />
      </Form.Item>
      <PrintValue />
    </Form>
  );
}
