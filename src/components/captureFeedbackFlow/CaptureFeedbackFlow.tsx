import React, { useState, useEffect } from 'react';
import EmojiSelector from '../emojis/EmojiSelector';
import FeedbackForm from '../FeadbackForm';

interface CaptureFeedbackFlowProps {
  screenshot: string | null;
  onClose: () => void;
  onCaptureClick: (formData: {
    alertDescription: string;
    sentiment: string;
    tips: string;
    isBlocked: 'yes' | 'no';
  }) => void;
  initialFormData?: {
    alertDescription: string;
    sentiment: string;
    tips: string;
    isBlocked: 'yes' | 'no';
  };
}

const CaptureFeedbackFlow: React.FC<CaptureFeedbackFlowProps> = ({
  screenshot,
  onClose,
  onCaptureClick,
  initialFormData = {
    alertDescription: '',
    sentiment: '😐',
    tips: '',
    isBlocked: 'no',
  },
}) => {
  const [step, setStep] = useState<'emoji' | 'form'>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(initialFormData.sentiment);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(screenshot);
  const [formData, setFormData] = useState(initialFormData);

  // Mise à jour des données en fonction de l'initialisation ou du retour après capture
  useEffect(() => {
    if (initialFormData) {
      setFormData((prev) => ({
        ...prev,
        ...initialFormData,
      }));
    }
  }, [initialFormData]);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setFormData((prev) => ({ ...prev, sentiment: emoji })); // Mise à jour de l'émoji sélectionné
    setStep('form'); // Transition vers le formulaire
  };

  const handleCaptureClick = () => {
    console.log('Sauvegarde des données avant capture:', formData);

    // Préserver les données actuelles avant la capture
    const updatedFormData = { ...formData };

    // Réinitialiser l'image capturée
    setCurrentScreenshot(null);

    // Passer les données sauvegardées pour la prochaine ouverture
    onCaptureClick(updatedFormData);
  };

  return (
    <div>
      {step === 'emoji' ? (
        <EmojiSelector onSelect={handleEmojiSelect} />
      ) : (
        <FeedbackForm
          screenshot={currentScreenshot}
          onClose={onClose}
          onCaptureClick={handleCaptureClick} // Passe les données actuelles à la capture
          initialFormData={formData} // Passe les données sauvegardées au formulaire
        />
      )}
    </div>
  );
};

export default CaptureFeedbackFlow;