// CaptureFeedbackFlow.tsx
import React, { useState } from 'react';
import EmojiSelector from '../emojis/EmojiSelector';
import FeedbackForm from '../FeadbackForm';

interface CaptureFeedbackFlowProps {
  screenshot: string | null; // Screenshot peut être une chaîne ou null
  onClose: () => void;
}

const CaptureFeedbackFlow: React.FC<CaptureFeedbackFlowProps> = ({ screenshot, onClose }) => {
  const [step, setStep] = useState<'emoji' | 'form'>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setStep('form'); // Passer à l'étape du formulaire après sélection de l'émoji
  };

  return (
    <div>
      {!selectedEmoji ? (
        <EmojiSelector onSelect={handleEmojiSelect} />
      ) : (
        <FeedbackForm screenshot={screenshot} initialSentiment={selectedEmoji} onClose={onClose} />
      )}
    </div>
  );
};

export default CaptureFeedbackFlow;
