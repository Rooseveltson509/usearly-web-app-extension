import React, { useState } from "react";

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ onSelect }) => {
  const initialEmojis = [
    { emoji: "😐", name: "Neutre" },
    { emoji: "😤", name: "Agacé" },
    { emoji: "😡", name: "En colère" },
  ];
  const additionalEmojis = [
    { emoji: "🤔", name: "Pensif" },
    { emoji: "😭", name: "Triste" },
    { emoji: "😖", name: "Dégouté" },
    { emoji: "😵", name: "Étourdi" },
    { emoji: "🤣", name: "Hilarant" },
  ];

  const [emojis, setEmojis] = useState(initialEmojis);
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    if (!showMore) {
      setEmojis([...emojis, ...additionalEmojis]);
      setShowMore(true);
    }
  };

  return (
    <div className="emoji-popup-container">
      {/* Goutte d'eau */}
      <div className="emoji-waterdrop"></div>

      {/* Titre */}
      <div className="emoji-popup-title">
        Quelle émotion ressentez-vous face à ce problème ?
      </div>

      {/* Conteneur des emojis */}
      <div className="emoji-container">
        {emojis.map((emojiObj, index) => (
          <div
            key={index}
            className="emoji-item"
            onClick={() => onSelect(emojiObj.emoji)}
          >
            {/* Émoji */}
            <span className="emoji-span">{emojiObj.emoji}</span>

            {/* Tooltip pour le nom de l'émotion */}
            <div className="emoji-tooltip">{emojiObj.name}</div>
          </div>
        ))}

        {/* Bouton Plus (+) */}
        {!showMore && (
          <div className="add-more-button" onClick={handleShowMore}>
            +
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiSelector;