import React from 'react';
import ReactDOM from 'react-dom/client';

const Popup: React.FC = () => {
  return (
    <div style={{ padding: '10px' }}>
      <h1>Extension Popup</h1>
      <p>Cliquez trois fois pour déclencher le menu contextuel !</p>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Popup />);
}
