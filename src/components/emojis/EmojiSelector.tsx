import React, { useEffect, useState } from "react";

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
  action: string; // Argument pour distinguer les actions
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ onSelect, action }) => {
  // Jeux d'émojis
  const defaultEmojis = [
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

  const heartEmojis = [
    { emoji: "❤️", name: "Passion" },
    { emoji: "👍", name: "Satisfaction" },
    { emoji: "👏", name: "Félicitations" },
  ];

  const additionalHeartEmojis = [
    { emoji: "🤩", name: "Enthousiasme" },
    { emoji: "🤣", name: "Hilarant" },
  ];

  const [emojis, setEmojis] = useState(defaultEmojis);
  const [showMore, setShowMore] = useState(false);

  // Mettre à jour les émojis affichés en fonction de l'action
  useEffect(() => {
    if (action === "cheart") {
      setEmojis(heartEmojis);
    } else {
      setEmojis(defaultEmojis);
    }
    setShowMore(false); // Réinitialiser l'état de "plus"
  }, [action]);

  // Ajouter les émojis supplémentaires
  const handleShowMore = () => {
    if (!showMore) {
      if (action === "cheart") {
        setEmojis((prev) => [...prev, ...additionalHeartEmojis]);
      } else {
        setEmojis((prev) => [...prev, ...additionalEmojis]);
      }
      setShowMore(true);
    }
  };

  return (
    <div className="emoji-popup-container">
      {/* Goutte d'eau */}
      <div className="emoji-waterdrop"></div>

      {/* Titre dynamique */}
      <div className="emoji-popup-title">
        {action === "cheart"
          ? "Quelle émotion exprime votre coup de cœur ?"
          : "Quelle émotion ressentez-vous face à ce problème ?"}
      </div>

      {/* Conteneur des emojis */}
      <div className="emoji-container">
        {emojis.map((emojiObj, index) => (
          <div
            key={index}
            className="emoji-item"
            onClick={() => onSelect(emojiObj.emoji)}
          >
            <span className="emoji-span">{emojiObj.emoji}</span>
            <div className="emoji-tooltip">{emojiObj.name}</div>
          </div>
        ))}

        {/* Bouton "Plus (+)" */}
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