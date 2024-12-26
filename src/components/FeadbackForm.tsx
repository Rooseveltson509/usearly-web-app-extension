import React, { useEffect, useState } from 'react';
import { createAlert, createCoupdeCoeur, createSuggest } from '../services/apiService';
import LoginForm from './LoginForm';
import { Alert } from '../types/Alert';
import PopupConfirm from './popupConfirm/PopupConfirm';
import { CoupdeCoeur } from '../types/CoupdeCoeur';
import { Suggest } from '../types/Suggest';
import { emojiSentiments, getTitleForEmoji, heartEmojis } from '../utils/emojiUtils';
import SuggestConfirm from './popupConfirm/SuggestConfirm';
import CoupdeCoeurConfirm from './popupConfirm/CoupdeCoeurConfirm';
import FlashMessage from './flashMessage/FlashMessage';
import { getTokens } from '../utils/storageUtil';


interface FeedbackFormProps {
  screenshot: string | null;
  onClose: () => void;
  onCaptureClick: (
    formData: {
      alertDescription: string;
      sentiment: string;
      tips: string;
      isBlocked: 'yes' | 'no';
      screenshot: string | null;
    },
    action: string // Nouveau paramètre pour l'action
  ) => void;
  initialFormData?: {
    alertDescription: string;
    sentiment: string;
    tips: string;
    isBlocked: 'yes' | 'no';
    screenshot: string | null;
  };
  selectedAction: string; // Ajoutez selectedAction comme prop
}


const apiActions = {
  default: async (data: any, token: string) => createAlert(data, token),
  coupDeCoeur: async (data: CoupdeCoeur, token: string) => createCoupdeCoeur(data, token),
  suggest: async (data: Suggest, token: string) => createSuggest(data, token),
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  screenshot,
  onClose,
  onCaptureClick,
  selectedAction,
  initialFormData = {
    alertDescription: '',
    sentiment: '😐',
    tips: '',
    isBlocked: 'no',
    screenshot: null,
  },
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(true); // Affiche le formulaire initialement
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState(initialFormData.alertDescription);
  const [sentiment, setSentiment] = useState(initialFormData.sentiment);
  const [tips, setTips] = useState(initialFormData.tips);
  const [isBlocked, setBlocking] = useState<'yes' | 'no'>(initialFormData.isBlocked);
  const [capture, setCapture] = useState<string | null>(screenshot);
  // alert data
  const [brandName, setBrandName] = useState<string>('');
  const [siteUrl, setSitUrl] = useState<string>('');
  const [bugLocation, setBugLocation] = useState<string>('');
  const [emojis, setEmojis] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false); // État pour afficher la modal de confirmation
  const [errorMessages, setErrorMessages] = useState<string | null>(null); // Stocke les erreurs
  const [isSubmitting, setIsSubmitting] = useState(false); // Indique si le formulaire est en cours de soumission
  const [flashMessage, setFlashMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
  } | null>(null);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [codeStatus, setCodeStatus] = useState<number>();

  const [response, setResponse] = useState<string | null>(null);
  const [localAction, setLocalAction] = useState(selectedAction);

  useEffect(() => {
    const currentUrl = window.location.href;
    setLocalAction(selectedAction); // Synchronise uniquement lors de l'initialisation

    setCapture(screenshot ?? '');
    try {
      const urlObj = new URL(currentUrl);
      const cleanDomain = urlObj.hostname.replace(/^www\./, '');
      setBrandName(cleanDomain);
      setSitUrl(cleanDomain);
      setBugLocation(urlObj.hostname);
    } catch (error) {
      console.error('Erreur lors de la récupération du domaine:', error);
    }
  }, [selectedAction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Indique que le processus est en cours
    setErrorMessages(null); // Réinitialise les erreurs

    try {

      // Récupérez le token après vérification
      const tokens = await getTokens();
      const accessToken = tokens.accessToken;
      // Vérifie si l'utilisateur est authentifié
      //const isAuthenticated = await isUserAuthenticated();
      if (!accessToken) {
        console.error("L'utilisateur n'est pas authentifié ou le token est invalide.");
        setErrorMessages("Veuillez vous connecter pour soumettre ce formulaire.");
        setShowLoginForm(true); // Affiche le formulaire de connexion
        setIsSubmitting(false);
        return;
      }

      if (!accessToken) {
        throw new Error("Erreur : aucun token valide trouvé après authentification.");
      }

      const alertData: Alert = {
        marque: brandName,
        siteUrl: siteUrl,
        blocking: isBlocked,
        description: alertDescription,
        bugLocation: bugLocation,
        emojis: sentiment,
        capture,
        tips,
      };

      let result;
      console.log("Action sélectionnée :", selectedAction);

      if (selectedAction === "cheart") {
        const coupDeCoeurData: CoupdeCoeur = {
          marque: brandName,
          description: alertDescription,
          emplacement: bugLocation,
          emoji: sentiment,
        };
        result = await apiActions.coupDeCoeur(coupDeCoeurData, accessToken);
      } else if (selectedAction === "capture") {
        result = await apiActions.default(alertData, accessToken);
      } else if (selectedAction === "suggestion") {
        const suggest: Suggest = {
          marque: brandName,
          description: alertDescription,
          emplacement: bugLocation,
        };
        result = await apiActions.suggest(suggest, accessToken);
      } else {
        throw new Error("Action inconnue.");
      }

      // Gestion des réponses en fonction du statut
      if (result.status === 201) {
        console.log("Réponse API :", result);
        setResponse(result.message || "Signalement créé avec succès.");
        setErrorMessages(null);
        setShowFeedbackForm(false);
        setShowConfirmation(true); // Affiche la modal de confirmation
        setFlashMessage({
          message: result.message || "Signalement créé avec succès.",
          type: "success",
          duration: 10000,
        });
      } else if (result.status === 200) {
        console.log("Un problème similaire a déjà été signalé.");
        setCodeStatus(result.status);
        setResponse(result.message || "Un problème similaire a déjà été signalé.");
        setErrorMessages(null);
        setTotalReports(result.totalReports || 1); // Mettez à jour le total des signalements
        setShowFeedbackForm(false);
        setShowConfirmation(true);
        setFlashMessage({
          message: result.message || "Signalement déjà existant.",
          type: "info",
          duration: 7000,
        });
      } else {
        throw new Error(`Code de statut inattendu : ${result.status}`);
      }

      // Réinitialise les champs du formulaire après succès
      setBrandName("");
      setSitUrl("");
      setBlocking("no");
      setAlertDescription("");
      setBugLocation("");
      setEmojis("");
      setCapture("");
      setTips("");
    } catch (err: any) {
      console.error("Erreur détectée :", err);

      // Gestion des erreurs spécifiques
      if (err.message.includes("Un signalement similaire existe déjà")) {
        setErrorMessages("Un problème similaire a déjà été signalé.");
        setResponse("Un problème similaire a déjà été signalé.");
      } else {
        setErrorMessages(err.message || "Une erreur inattendue est survenue.");
      }
    } finally {
      setIsSubmitting(false); // Réinitialise l'état de soumission
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginForm(false); // Ferme le formulaire de connexion
    if (pendingAction) {
      pendingAction(); // Exécute l'action en attente
      setPendingAction(null); // Réinitialise l'action en attente
    }
  };

  // Function to toggle the emoji selector
  const toggleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const handleEmojiSelect = (emoji: string): void => {
    setSentiment(emoji);
    console.log('emoji selected:', sentiment);
  };


  return (
    <div className='my-class'>
      {/* Overlay */}
      {(showFeedbackForm || showConfirmation) && <div className="overlay"></div>}
      {/* Selected Emoji and selector (outside the form) */}
      {showFeedbackForm && (
        <div className='feedback-style'>
          {selectedAction === 'suggestion' && (
            <div className="emoji-waterdrop"></div>
          )}

          {selectedAction !== 'suggestion' && (
            <div id={`${!capture ? 'select-emoji' : 'select-emoji-display-img'
              }`} className='select-emoji'
              onClick={toggleEmojiSelector}>
              {showEmojiSelector && (
                <div className='blc-span-emojis'>
                  {/* heartEmojis */}
                  {selectedAction === 'cheart' && (
                    heartEmojis.map(({ emoji }) => (
                      <span
                        key={emoji}
                        style={{ cursor: 'pointer', margin: '0 5px' }}
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </span>
                    ))
                  )}

                  {selectedAction !== 'cheart' && (
                    emojiSentiments.map(({ emoji }) => (
                      <span
                        key={emoji}
                        style={{ cursor: 'pointer', margin: '0 5px' }}
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </span>
                    ))
                  )}
                </div>
              )}
              {sentiment}
            </div>
          )}

          <div className='close-button float-end closeForm' onClick={() => {
            setShowFeedbackForm(false);
            onClose();
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path d="M11.2502 3.49982L4.25024 10.4998" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M11.3376 10.4108L4.25034 3.50029" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          {selectedAction === 'capture' && (
            <button className="camera-button"
              type='button'
              onClick={() => {
                const currentFormData = {
                  alertDescription,
                  sentiment,
                  tips,
                  isBlocked,
                  screenshot: capture, // Ajoutez la capture si elle existe
                };
                console.log('[FeedbackForm] Nouvelle capture déclenchée avec :', currentFormData, 'Action actuelle :', selectedAction);
                // Passez toujours `selectedAction` pour ne pas changer d'action
                onCaptureClick(currentFormData, selectedAction);
              }}>
              📸 Reprendre une capture
            </button>
          )}
          {/* Feedback form */}
          {errorMessages && (
            <div style={{ color: "red", marginBlockStart: "10px" }}>
              {errorMessages}
            </div>
          )}
          <div className="block-form">


            {isSubmitting && (
              <div className="loader-container">
                <div className="loader"></div>
                <span>Veuillez patienter...</span>
              </div>
            )}

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
                  {getTitleForEmoji(sentiment, selectedAction)}
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
                      style={{ marginInlineEnd: '8px', inlineSize: '16px', blockSize: '16px', accentColor: '#6a1b9a' }}
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
      {/* Flash message */}
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          duration={flashMessage.duration}
          onClose={() => setFlashMessage(null)} // Supprime le message flash après sa fermeture
        />

      )}

      {/* Modal de confirmation */}
      {showConfirmation && (
        <>
          {selectedAction === 'cheart' && (
            <CoupdeCoeurConfirm
              onClose={() => {
                setShowConfirmation(false);
                onClose();
              }}
            />
          )}

          {selectedAction === 'suggestion' && (
            <SuggestConfirm
              onClose={() => {
                setShowConfirmation(false);
                onClose();
              }}
            />
          )}

          {selectedAction !== 'cheart' && selectedAction !== 'suggestion' && (
            <PopupConfirm
              onClose={() => {
                setShowConfirmation(false);
                onClose();
              }}
              message={response}
              userRank={totalReports}
              statusCode={codeStatus}
            />
          )}
        </>
      )}

      {showLoginForm && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginForm(false)}
        />
      )}
    </div>
  );
};

export default FeedbackForm;
