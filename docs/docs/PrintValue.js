import React from "react";
import CodeBlock from "@theme/CodeBlock";
import { useFormikContext } from "formik";

export const PrintValue = () => {
  const { values } = useFormikContext();
  return (
    <CodeBlock language="json">
      {JSON.stringify(values, undefined, 2)}
    </CodeBlock>
  );
};
