import React, { useState, useEffect } from "react";

interface WarningFormProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Warning: React.FC<WarningFormProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(10); // Compte à rebours de 10 secondes

  useEffect(() => {
    // Décrémenter le compte à rebours chaque seconde
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Fermer automatiquement après 10 secondes
    if (countdown <= 0) {
      clearInterval(timer);
      onClose(); // Appeler la fonction de fermeture
    }

    return () => clearInterval(timer); // Nettoyage
  }, [countdown, onClose]);

  return (
    <div className="overlay">
      <div className="warning-popup">
        <h1>⚠️ Contenu inapproprié détecté</h1>
        <p>Notre extension Usearly ne sera pas active sur ce site.</p>
        <p>
          fermeture dans <strong>{countdown}</strong> secondes.
        </p>
        <button onClick={onClose} className="close-button-form">Fermer</button>
      </div>
    </div>
  );
};

export default Warning;
