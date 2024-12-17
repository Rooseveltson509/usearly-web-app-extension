import React, { useState, useEffect } from 'react';

interface FlashMessageProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  type = 'info',
  duration = 10000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return '#333';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - (100 / (duration / 100)), 0));
    }, 100);

    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: getBackgroundColor(),
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 10005,
      width: '300px',
      animation: `fadeIn 0.5s ease-in, fadeOut 0.5s ease-out ${duration - 500}ms`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>
      <div style={{
        height: '5px',
        backgroundColor: '#555',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '8px',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#fff',
          transition: 'width 0.1s linear',
        }} />
      </div>
    </div>
  );
};

export default FlashMessage;
