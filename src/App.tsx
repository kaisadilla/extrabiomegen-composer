import ExtraBiomeGenPage from 'pages/ExtraBiomeGen/page';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import '@mantine/notifications/styles.css';
// eslint-disable-next-line import/order
import 'styles/root.scss';

import HomePage from 'pages/Home/page';
import LangPage from 'pages/Lang/page';
import LangPage2 from 'pages/Lang/page2';
import { Navigate, Route, Routes } from 'react-router';

function App () {
  return (
    <Routes>
      <Route index element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/ebg" element={<ExtraBiomeGenPage />} />
      <Route path="/lang" element={<LangPage />} />
      <Route path="/lang2" element={<LangPage2 />} />
    </Routes>
  );
}

export default App;
