import { createTheme, MantineProvider, Modal, Popover, Text, Tooltip } from '@mantine/core';
import { ModalsProvider, type ContextModalProps } from '@mantine/modals';
import ImportContentModal from 'modals/ImportContent.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'state/store.ts';
import App from './App.tsx';

const mantineTheme = createTheme({
  //colors: {
  //  blue: [
  //    "var(--color-primary-l3)",
  //    "var(--color-primary-l3)",
  //    "var(--color-primary-l3)",
  //    "var(--color-primary-l3)",
  //    "var(--color-primary-l2)",
  //    "var(--color-primary-l1)",
  //    "var(--color-primary)",
  //    "var(--color-primary-d1)",
  //    "var(--color-primary-d2)",
  //    "var(--color-primary-d2)",
  //  ]
  //},
  defaultRadius: 0,
  components: {
    TooltipFloating: Tooltip.Floating.extend({
      defaultProps: {
        position: 'top',
        zIndex: 100_000_000,
      }
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        zIndex: 100_000_000,
      }
    }),
    Popover: Popover.extend({
      defaultProps: {
        zIndex: 100_000_000
      }
    }),
    Text: Text.extend({
      styles: {
        root: {
          //wordBreak: 'break-all', // By default, Mantine only breaks at word boundaries.
        }
      }
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
      }
    })
  },
});

const modals: Record<string, React.FC<ContextModalProps<any>>> = {
  importContent: ImportContentModal,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={mantineTheme}>
      <ModalsProvider modals={modals}>

        <App />

      </ModalsProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>,
)
