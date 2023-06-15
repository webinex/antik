import React from 'react';
import Code from '@theme/CodeBlock';

const NO_LINE_BELOW = '/* no-line-below */';
const IF_VIEW_START = '/* if-view *';
const IF_VIEW_ELSE = '/* if-view-else *';
const IF_VIEW_END = '/* if-view-end *';

function trimNoLineBelow(text: string) {
  const codeLines = text.split(/\r?\n/);
  const resultLines: string[] = [];

  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].indexOf(NO_LINE_BELOW) < 0) {
      resultLines.push(codeLines[i]);
      continue;
    }

    i = i + 1;
  }

  return resultLines.join('\n');
}

export default function CodeBlock({ children }: { children: string }) {
  const code = trimNoLineBelow(children);
  return (
    <div>
      <Code language="jsx" showLineNumbers>
        {code}
      </Code>
    </div>
  );
}
