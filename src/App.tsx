import MsdPage from 'pages/Msd/page';
import { useState } from 'react';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import 'styles/root.scss';

function App() {
  const [count, setCount] = useState(0)

  return (
    <MsdPage />
  );
}

export default App
