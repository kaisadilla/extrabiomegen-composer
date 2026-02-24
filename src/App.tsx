import MsdPage from 'pages/Msd/page';
import { useState } from 'react';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import LangPage from 'pages/Lang/page';
import { Route, Routes } from 'react-router';
import 'styles/root.scss';

function App () {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/extrabiomegen-composer/ebg" element={<MsdPage />} />
      <Route path="/extrabiomegen-composer/lang" element={<LangPage />} />
    </Routes>
  );
}

export default App;
