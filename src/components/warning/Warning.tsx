import React, { useEffect } from "react";

interface WarningFormProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Warning: React.FC<WarningFormProps> = ({ onClose }) => {
 /*  useEffect(() => {
    // Automatiquement fermer le popup après 3 secondes
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer); 
  }, [onClose]); */

  return (
    <div className="overlay">
      <div className="warning-popup">
        <h1>⚠️ Contenu inapproprié détecté</h1>
        <p>Vous serez redirigé hors de cette page dans quelques secondes.</p>
        <button className="close-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Warning;
