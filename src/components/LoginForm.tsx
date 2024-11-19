import React, { useState } from 'react';
import { login } from '../services/AuthService';

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Empêche le rechargement de la page par défaut
    console.log("Le formulaire a été soumis avec l'email:", email);

    const success = await login(email, password); // Appelle la fonction login
    if (success) {
      console.log("Connexion réussie");
      onLoginSuccess();
      onClose();
    } else {
      console.error("Échec de la connexion : Nom d’utilisateur ou mot de passe incorrect.");
      setError("Nom d’utilisateur ou mot de passe incorrect...");
    }
  };

  return (
    <div className="overlay">
      <div className="login-popup">
        <div className="login-header">
          <svg xmlns="http://www.w3.org/2000/svg" className='login-logo' width="80" height="80" viewBox="0 0 109 108" fill="none">
            <g filter="url(#filter0_d_329_887)">
              <rect x="34" y="30" width="41" height="39.7188" rx="4" fill="url(#paint0_linear_329_887)" />
            </g>
            <path d="M57.4056 39.2617H63.0013V53.4176C63.0013 55.0535 62.5897 56.4788 61.7666 57.6932C60.9435 58.9006 59.7956 59.8364 58.3231 60.5008C56.8505 61.1581 55.1401 61.4867 53.1918 61.4867C51.2209 61.4867 49.4991 61.1581 48.0266 60.5008C46.5541 59.8364 45.41 58.9006 44.5944 57.6932C43.7789 56.4788 43.3711 55.0535 43.3711 53.4176V39.2617H48.9781V52.9568C48.9781 53.714 49.1518 54.3891 49.4991 54.9821C49.8541 55.575 50.3487 56.0394 50.983 56.3752C51.6173 56.7109 52.3536 56.8788 53.1918 56.8788C54.0301 56.8788 54.7626 56.7109 55.3893 56.3752C56.0237 56.0394 56.5183 55.575 56.8732 54.9821C57.2281 54.3891 57.4056 53.714 57.4056 52.9568V39.2617Z" fill="white" />
            <path d="M68.5403 61.5189C67.7247 61.5189 67.0262 61.2474 66.4447 60.7044C65.8708 60.1615 65.5876 59.5043 65.5952 58.7327C65.5876 57.9754 65.8708 57.3289 66.4447 56.7931C67.0262 56.2502 67.7247 55.9787 68.5403 55.9787C69.3105 55.9787 69.9902 56.2502 70.5792 56.7931C71.1758 57.3289 71.4778 57.9754 71.4854 58.7327C71.4778 59.2471 71.3343 59.715 71.0549 60.1365C70.7831 60.558 70.4244 60.8938 69.9789 61.1438C69.5409 61.3938 69.0613 61.5189 68.5403 61.5189Z" fill="white" />
            <defs>
              <filter id="filter0_d_329_887" x="0" y="0" width="109" height="107.719" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="17" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_329_887" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_329_887" result="shape" />
              </filter>
              <linearGradient id="paint0_linear_329_887" x1="26.8696" y1="69.7187" x2="80.5746" y2="28.3654" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5A13A5" />
                <stop offset="1" stopColor="#FE2190" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3 className='title-form'>Connectez-vous !</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className='login-form' onSubmit={handleLogin} onClick={(e) => e.stopPropagation()}>
          <input type="email" placeholder="Adresse email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-field">
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
            <button type="button" className="toggle-password"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
              <path d="M4.00498 12.8237C4.81192 9.09561 8.18523 6.44669 11.9798 6.44669C15.7731 6.44669 19.1464 9.09561 19.9545 12.8237C19.9865 12.9716 20.0783 13.1013 20.2097 13.1841C20.341 13.2669 20.5012 13.2962 20.655 13.2654C20.8088 13.2346 20.9435 13.1463 21.0296 13.0199C21.1157 12.8935 21.1461 12.7394 21.1141 12.5915C20.1947 8.35114 16.3493 5.30835 11.9798 5.30835C7.61019 5.30835 3.76479 8.35114 2.84544 12.5915C2.81343 12.7394 2.84382 12.8935 2.92991 13.0199C3.016 13.1463 3.15076 13.2346 3.30452 13.2654C3.45828 13.2962 3.61847 13.2669 3.74983 13.1841C3.88119 13.1013 3.97297 12.9716 4.00498 12.8237ZM11.9679 8.72338C13.0662 8.72338 14.1196 9.14314 14.8962 9.89032C15.6728 10.6375 16.1091 11.6509 16.1091 12.7076C16.1091 13.7642 15.6728 14.7776 14.8962 15.5248C14.1196 16.272 13.0662 16.6918 11.9679 16.6918C10.8696 16.6918 9.81628 16.272 9.03965 15.5248C8.26302 14.7776 7.82672 13.7642 7.82672 12.7076C7.82672 11.6509 8.26302 10.6375 9.03965 9.89032C9.81628 9.14314 10.8696 8.72338 11.9679 8.72338Z" fill="#6A707C" />
            </svg></button>
          </div>
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Se souvenir de moi</label>
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
          </div>
          <button id="login-button" type="submit">Se connecter</button>
        </form>
        <button onClick={onClose} className="close-button-form">Fermer</button>
      </div>
    </div>
  );
};

export default LoginForm;
