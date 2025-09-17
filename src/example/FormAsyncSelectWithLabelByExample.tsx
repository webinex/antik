import { useMemo } from 'react';
import { createEntireLoadOptionSource, Form } from '../src';
import { Tag, Typography } from 'antd';
import React from 'react';
import './../src/add/async-select';
import { FormAsyncSelect } from '../src/add/async-select/FormAsyncSelect';

const users = [
  { id: '1', firstName: 'John', lastName: 'Doe', isActive: true },
  { id: '2', firstName: 'Thomas', lastName: 'Walsh', isActive: true },
  { id: '3', firstName: 'James', lastName: 'Arch', isActive: false },
];

export function FormAsyncSelectWithLabelByExample() {
  const optionSource = useMemo(
    () =>
      createEntireLoadOptionSource({
        fn: () => Promise.resolve(users),
        valueBy: 'id',
        labelBy: (user) => (
          <div>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <Tag>{user.isActive ? 'ACTIVE' : 'INACTIVE'}</Tag>
          </div>
        ),
      }),
    [],
  );

  return (
    <div>
      <Typography.Title level={2}>
        Form Async Select with LabelBy Example <Tag color="warning">EXPERIMENTAL</Tag>
      </Typography.Title>
      <Typography.Paragraph>
        This example demonstrates how to use the <code>Form.AsyncSelect</code> component with a custom
        <code>labelBy</code> function to render complex labels for each option.
      </Typography.Paragraph>

      <Form
        type="formik"
        uid="form-async-select-with-label-by-example"
        initialValues={{ value: null!, array: [], always: [] }}
        onSubmit={() => {}}
      >
        <Form.Item name="value" label="User">
          <FormAsyncSelect optionSource={optionSource} allowClear valueType="option" />
        </Form.Item>
        <Form.Item name="array" label="Users">
          <FormAsyncSelect optionSource={optionSource} allowClear mode="multiple" valueType="option" />
        </Form.Item>
        <Form.Item name="always" label="Users (with always)">
          <FormAsyncSelect
            optionSource={optionSource}
            allowClear
            mode="multiple"
            valueType="option"
            always={[{ id: '4', firstName: 'Kevin', lastName: 'Hart', isActive: false }]}
          />
        </Form.Item>
        <Form.State />
      </Form>
    </div>
  );
}
