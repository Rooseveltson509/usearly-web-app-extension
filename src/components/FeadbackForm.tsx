import React, { useEffect, useState } from 'react';
import { createAlert } from '../services/apiService';
import { getToken } from '../utils/storageUtil';
import LoginForm from './LoginForm';
import { isUserAuthenticated } from '../services/AuthService';
import { Alert } from '../types/Alert';
import PopupConfirm from './popupConfirm/PopupConfirm';
import { isApiError } from '../utils/isApiError';
import { initiateCapture } from '../utils/captureUtil';

interface FeedbackFormProps {
  screenshot: string | null; // Screenshot peut être une chaîne ou null
  onClose: () => void;
  initialSentiment: string; // Receives the initial selected emoji
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ screenshot, onClose, initialSentiment }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(true); // Affiche le formulaire initialement
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [sentiment, setSentiment] = useState<string>(initialSentiment); // Uses the initial emoji
  const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);
  const [isBlocked, setBlocking] = useState<'yes' | 'no'>('no'); // Par défaut "no"
  const [isLoading, setIsLoading] = useState(false); // Indique si la requête est en cours
  const [showOverlay, setShowOverlay] = useState<boolean>(false); // Contrôle l'affichage de l'overlay
  const [formData, setFormData] = useState({
    brandName: '',
    alertDescription: '',
    bugLocation: '',
    emojis: initialSentiment,
    capture: screenshot,
    tips: '',
  });


  // alert data
  const [brandName, setBrandName] = useState<string>('');
  const [alertDescription, setAlertDescription] = useState<string>('');
  const [bugLocation, setBugLocation] = useState<string>('');
  const [emojis, setEmojis] = useState<string>('');
  const [capture, setCapture] = useState<string>('');
  const [tips, setTips] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false); // État pour afficher la modal de confirmation
  const [errorMessages, setErrorMessages] = useState<string | null>(null); // Stocke les erreurs

  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // L'URL complète
    const currentUrl = window.location.href;
    setCapture(screenshot ?? "");
    try {
      // Créer un objet URL
      const urlObj = new URL(currentUrl);
      // Extraire uniquement le domaine sans www
      const cleanDomain = urlObj.hostname.replace(/^www\./, '');
      setFormData((prev) => ({
        ...prev,
        brandName: cleanDomain,
        bugLocation: urlObj.hostname,
      }));
      setBrandName(cleanDomain);
      setBugLocation(urlObj.hostname);
      console.log("Le nom du site sur lequel tu te trouve c'est: ", cleanDomain)
    } catch (error) {
      console.error('Erreur lors de la récupération du domaine:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Indique que le processus est en cours
    setErrorMessages(null); // Réinitialise les erreurs

    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
      console.log("Veuillez-vous connecter...")
      setShowLoginForm(true); // Affiche le formulaire de connexion
      setIsLoading(false);
      return;
    }

    const alertData: Alert = {
      marque: brandName,
      blocking: isBlocked,
      description: alertDescription,
      bugLocation: bugLocation,
      emojis: sentiment,
      capture,
      tips,
    };

    const token = await getToken();
    if (!token) {
      console.error('Erreur : le token est null ou undefined');
      setErrorMessages('Erreur : le token est null ou undefined');
      setIsLoading(false);
      return;
    }

    try {
      const result = await createAlert(alertData, token);
      setResponse(`Signalement envoyé avec succès : ${JSON.stringify(result)}`);
      setErrorMessages(null); // Efface les erreurs précédentes
      setShowFeedbackForm(false);
      setShowConfirmation(true); // Affiche la modal de confirmation
      //setShowOverlay(true); // Active l'overlay

      // Réinitialise les champs du formulaire
      setBrandName('');
      setBlocking('no');
      setAlertDescription('');
      setBugLocation('');
      setEmojis('');
      setCapture('');
      setTips('');
    } catch (err) {
      console.error('Erreur détectée :', err);
      console.log("erreur catcher:  ", error)

      if (isApiError(err)) {
        setErrorMessages(typeof err.error === 'string' ? err.error : err.error.join(', '));

      } else {
        setErrorMessages('Une erreur inattendue est survenue.');
      }
    } finally {
      setIsLoading(false); // Indique que la requête est terminée
    }
  };
  const handleLoginSuccess = () => {
    setShowLoginForm(false); // Ferme le formulaire de connexion
    if (pendingAction) {
      pendingAction(); // Exécute l'action en attente
      setPendingAction(null); // Réinitialise l'action en attente
    }
  };


  // Map to get the title based on the feeling
  const sentimentTitles = new Map<string, string>([
    ['😐', "Qu'est-ce qui pourrait être amélioré ?"],
    ['😤', "Qu'est-ce qui vous agace ?"],
    ['😡', "Qu'est-ce qui vous met en colère ?"],
    ['🤔', "Quel problème rencontrez-vous ?"],
    ['😭', "Qu’est-ce qui vous déçois ?"],
    ['😖', "Qu’est-ce qui vous frustre ?"],
    ['😵', "Qu’est-ce qui vous choque ?"],
    ['🤣', "Qu’est-ce qui vous vous fait marrer ?"],
  ]);

  const getTitle = () => sentimentTitles.get(sentiment) || "Donnez votre avis";

  // Function to toggle the emoji selector
  const toggleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  // Function to handle selection of a new emoji
  const handleEmojiSelect = (emoji: string) => {
    setSentiment(emoji);
    setShowEmojiSelector(false); // Hide the emoji selector after selection
  };

  const handleCaptureClick = async () => {
    const newCapture = await initiateCapture(); // Fonction pour démarrer la capture
    if (newCapture) {
      setCapture(newCapture); // Met à jour la capture
    }
  };

  return (
    <div className='my-class'>
      {/* Overlay */}
      {(showFeedbackForm || showConfirmation) && <div className="overlay"></div>}
      {/* Selected Emoji and selector (outside the form) */}
      {showFeedbackForm && (
        <div className='feedback-style'>
          <div id={`${!capture ? 'select-emoji' : 'select-emoji-display-img'
            }`} className='select-emoji'
            onClick={toggleEmojiSelector}>
            {sentiment}
            {showEmojiSelector && (
              <div className='blc-span-emojis'>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('😐')}>😐</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('😤')}>😤</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('😡')}>😡</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('🤔')}>🤔</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('😭')}>😭</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('😖')}>😖</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('😵')}>😵</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleEmojiSelect('🤣')}>🤣</span>
              </div>
            )}
          </div>
          <div className='close-button float-end' onClick={() => {
              setShowFeedbackForm(false);
              onClose();
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path d="M11.2502 3.49982L4.25024 10.4998" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M11.3376 10.4108L4.25034 3.50029" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
         {/*  <button type="button" className="camera-button" onClick={handleCaptureClick}>
            📸 Nouvelle capture
          </button> */}

          {/* Feedback form */}
          {errorMessages && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {errorMessages}
            </div>
          )}
          <div className="block-form">
            <form className='formStyle' onSubmit={handleSubmit}>
              {capture && (
                <div className="image-preview">
                  <img className='img-preview' src={screenshot ?? ""} alt="screenshot" />
                </div>
              )}
              <div className="input-container">
                <input
                  className="floating-input"
                  placeholder=" "
                  value={alertDescription}
                  onChange={(e) => setAlertDescription(e.target.value)}
                />
                <label htmlFor="name" className="floating-label">
                  {getTitle()}
                </label>
              </div>
              <input type="hidden" value={brandName} onChange={(e) => setBrandName(e.target.value)} />

              <div className='align-checkBtn'>
                {
                  <div className={`checkBoxFeedback ${alertDescription.trim() ? 'visible' : 'hidden'}`} >
                    <input
                      type="checkbox"
                      checked={isBlocked === 'yes'}
                      onChange={(e) => setBlocking(e.target.checked ? 'yes' : 'no')}
                      style={{ marginRight: '8px', width: '16px', height: '16px', accentColor: '#6a1b9a' }}
                    />
                    <label>Je suis bloqué</label>
                  </div>
                }

                {/* <button disabled={!alertDescription.trim()} type="submit" > */} {/* Disable the button if the comment is empty */}
                <button disabled={!alertDescription.trim()} // Désactive le bouton si le champ est vide
                  type="submit"
                  className={`submit-button ${!alertDescription.trim() ? 'feedbackSubmitDisabled' : 'feedbackSubmiEnabled'
                    }`}
                  id={`${!capture ? 'feedbackSubmitDisabled' : 'feedbackSubmiEnabled'
                    }`}
                >
                  {!alertDescription.trim() ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                      <circle cx="11.4771" cy="11.2048" r="11" transform="rotate(90 11.4771 11.2048)" fill="url(#paint0_linear_319_540)" />
                      <path d="M11.4001 6.20483L16.4771 11.312L11.4001 16.4191M15.7719 11.312L5.47705 11.312" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      <defs>
                        <linearGradient id="paint0_linear_319_540" x1="-2.47644" y1="35.6819" x2="26.1437" y2="0.204836" gradientUnits="userSpaceOnUse">
                          <stop offset="0.22376" stopColor="#908f91" />
                          <stop offset="0.613341" stopColor="#9f9f9f" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                      <circle cx="11.4771" cy="11.2048" r="11" transform="rotate(90 11.4771 11.2048)" fill="url(#paint0_linear_319_540)" />
                      <path d="M11.4001 6.20483L16.4771 11.312L11.4001 16.4191M15.7719 11.312L5.47705 11.312" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      <defs>
                        <linearGradient id="paint0_linear_319_540" x1="-2.47644" y1="35.6819" x2="26.1437" y2="0.204836" gradientUnits="userSpaceOnUse">
                          <stop offset="0.22376" stopColor="#6E36A9" />
                          <stop offset="0.613341" stopColor="#B033AE" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {showConfirmation && (
        <PopupConfirm onClose={() => {
          setShowConfirmation(false);
          onClose();
        }} />
      )}

      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default FeedbackForm;
