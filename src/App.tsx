import ExtraBiomeGenPage from 'pages/ExtraBiomeGen/page';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import HomePage from 'pages/Home/page';
import LangPage from 'pages/Lang/page';
import { Navigate, Route, Routes } from 'react-router';
import 'styles/root.scss';

function App () {
  return (
    <Routes>
      <Route index element={<Navigate to="/extrabiomegen-composer/" />} />
      <Route
        path="/extrabiomegen-composer"
        element={<Navigate to="/extrabiomegen-composer/" />}
      />
      <Route path="/extrabiomegen-composer/">
        {false && <Route index element={<Navigate to="/extrabiomegen-composer/" replace />} />}
        <Route path="ebg" element={<ExtraBiomeGenPage />} />
        <Route path="lang" element={<LangPage />} />
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
