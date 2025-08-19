
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopRibbon from './components/TopRibbon';
import Home from './pages/Home';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  let PageComponent;
  switch (currentPage) {
    case 'home':
      PageComponent = <Home />;
      break;
    // TODO: Add other pages here
    default:
      PageComponent = <Home />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#10121A' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopRibbon currentPage={currentPage} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {PageComponent}
        </div>
      </div>
    </div>
  );
}

export default App;
