import React from 'react';

export function fc<T extends React.ComponentType<any>>(Component: T) {
  return Component as T & {
    propTypes?: React.FC<React.ComponentProps<T>>['propTypes'];
    contextTypes?: unknown;
    displayName?: string;
  };
}
