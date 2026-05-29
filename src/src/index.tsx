import { createRoot } from 'react-dom/client';
import { App } from './App';

declare module '@webinex/antik' {
  interface TypeConfigurationOverride {
    experimentalOptionSource: true;
  }
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
