import React, { useState } from 'react';

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ onSelect }) => {
  const [showMoreEmojis, setShowMoreEmojis] = useState(false);

  const defaultEmojis = ['😐', '😤', '😡'];
  const moreEmojis = ['😭', '😂', '🤔', '😍']; // Emojis supplémentaires

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      {/* Emojis par défaut */}
      {defaultEmojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onSelect(emoji)}
          style={{
            fontSize: '2rem',
            cursor: 'pointer',
            background: 'none',
            border: 'none'
          }}
        >
          {emoji}
        </button>
      ))}

      {/* Bouton "+" */}
      <div
        className="plus-icon"
        onClick={() => setShowMoreEmojis(!showMoreEmojis)} // Toggle l'état
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, background-color 0.2s ease'
        }}
      >
        +
      </div>

      {/* Emojis supplémentaires */}
      {showMoreEmojis && (
        <div style={{ display: 'flex', gap: '15px', marginLeft: '15px' }}>
          {moreEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onSelect(emoji)}
              style={{
                fontSize: '2rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;
