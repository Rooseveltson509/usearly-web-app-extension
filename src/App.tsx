import React, { useState } from 'react';
import './App.css';
import TestComponent from './components/TestComponent';
import PopupConfirmation from './components/PopupConfirmation';

const App: React.FC = () =>{
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="App">
      <button onClick={() => setShowPopup(true)}>Afficher le popup</button>
      {showPopup && (
        <PopupConfirmation
          userRank={8}
          totalReports={12}
          points={10}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default App;
