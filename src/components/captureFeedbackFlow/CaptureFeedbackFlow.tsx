import React, { useState, useEffect } from 'react';
import EmojiSelector from '../emojis/EmojiSelector';
import FeedbackForm from '../FeadbackForm';
import { enableLensMode, openFeedbackWithEmojiSelection } from '../../content/ContentScript';

interface CaptureFeedbackFlowProps {
  screenshot: string | null;
  action: string;
  onClose: () => void;
  onCaptureClick: (
    formData: {
      alertDescription: string;
      sentiment: string;
      tips: string;
      isBlocked: "yes" | "no";
      screenshot: string | null;
    },
    action: string
  ) => void;
  initialFormData?: {
    alertDescription: string;
    sentiment: string;
    tips: string;
    isBlocked: "yes" | "no";
    screenshot: string | null;
  };
  selectedAction: string;
  initialStep?: "emoji" | "form" | "capture"; // Correctement défini
}


const CaptureFeedbackFlow: React.FC<CaptureFeedbackFlowProps> = ({
  action,
  screenshot,
  onClose,
  onCaptureClick,
  initialFormData = {
    alertDescription: '',
    sentiment: '',
    tips: '',
    isBlocked: 'no',
    screenshot: null,
  },
  selectedAction,
  initialStep = 'emoji',
}) => {
  //const [selectedEmoji, setSelectedEmoji] = useState<string | null>(initialFormData.sentiment);
  //const [step, setStep] = useState<'emoji' | 'form' | 'capture'>(initialStep);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(screenshot);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(initialFormData.sentiment);
  const [localAction, setLocalAction] = useState(selectedAction);
  const [step, setStep] = useState<'emoji' | 'form' | 'capture'>(
    selectedAction === 'suggestion' ? 'form' : initialStep
  );
  

  // Initialiser `localAction` uniquement au montage
  useEffect(() => {
    if (selectedAction === 'suggestion') {
      setStep('form');
    }
    console.log('[CaptureFeedbackFlow] Initialisation');
    console.log('[CaptureFeedbackFlow] selectedAction :', selectedAction);
    console.log('[CaptureFeedbackFlow] initialFormData :', initialFormData);
    console.log('[CaptureFeedbackFlow] Initial step:', initialStep);
    console.log('[CaptureFeedbackFlow] Action actuelle après capture :', localAction);

    if (!localAction) {
      setLocalAction(selectedAction);
      console.log('[CaptureFeedbackFlow] Mise à jour de localAction :', selectedAction);
    }
  }, [selectedAction]);


  const handleEmojiSelect = (emoji: string) => {
    console.log('Emoji sélectionné :', emoji);
    setSelectedEmoji(emoji);
    setFormData((prev) => ({ ...prev, sentiment: emoji })); // Met à jour le sentiment
    setStep('form'); // Passe au formulaire
  };

  const handleCaptureClick = (formData: any, action: string) => {
    console.log('[CaptureFeedbackFlow] Début de capture avec action :', action);

      // Vérifier si l'action est "suggestion"
  if (action === 'suggestion') {
    console.log('[CaptureFeedbackFlow] L’action est "suggestion", affichage direct du formulaire.');
    setStep('form'); // Passe directement au formulaire
    return;
  }
    onClose();
    enableLensMode((newScreenshot: string) => {
      console.log('[CaptureFeedbackFlow] Capture terminée avec screenshot');

      // Rouvrez le formulaire avec la capture et l'action originale
      openFeedbackWithEmojiSelection(
        newScreenshot,
        action, // Passez l'action originale
        { initialFormData: formData }, // FormData inclus
        'form' // Étape initiale
      );
    });
  };
  

  return (
    <div>
      {step === 'emoji' && (
        <EmojiSelector onSelect={handleEmojiSelect}  action={action} />
      )}

      {step === 'form' && (
        <FeedbackForm
          screenshot={currentScreenshot}
          onClose={onClose}
          onCaptureClick={(formData, action) => {
            console.log('[CaptureFeedbackFlow] Form data reçu :', formData);
            console.log('[CaptureFeedbackFlow] Action reçue :', action);
            handleCaptureClick(formData, action); // Passe au mode capture
          }}
          //onEmojiSelect={handleEmojiSelect}
          initialFormData={{ ...formData, sentiment: selectedEmoji }} // Inclut l'emoji sélectionné
          selectedAction={localAction}
        />
      )}
    </div>
  );
};

export default CaptureFeedbackFlow;