import VoronoiPage from 'pages/Voronoi/page';
import { useState } from 'react';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import 'styles/root.scss';

function App() {
  const [count, setCount] = useState(0)

  return (
    <VoronoiPage />
  );
}

export default App
