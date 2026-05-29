import * as Yup from 'yup';
import { Form } from '../lib';

const SCHEMA = Yup.object({
  value: Yup.object({
    a: Yup.string().required(),
    b: Yup.string().required(),
    c: Yup.string().nullable(),
  }).required(),
});

export function FormObjectErrorDemo() {
  return (
    <Form
      type="formik"
      uid="form-object-error-demo"
      initialValues={{ value: { a: '', b: '', c: '' } }}
      validationSchema={SCHEMA}
      onSubmit={() => {}}
    >
      <Form.Item name="value" label="Value" required>
        <Form.Item name="value.a" nameAbsolute label="A">
          <Form.Input />
        </Form.Item>
        <Form.Item name="b" label="B">
          <Form.Input />
        </Form.Item>
        <Form.Item name="c" label="C">
          <Form.Input />
        </Form.Item>
      </Form.Item>
      <Form.Submit type="primary">Submit</Form.Submit>
    </Form>
  );
}
