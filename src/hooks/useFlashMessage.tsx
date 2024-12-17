import { useState, useCallback } from 'react';

export const useFlashMessage = () => {

  const [flashMessage, setFlashMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
  } | null>(null);

  const showFlashMessage = useCallback((message: string, type: 'success' | 'error' | 'info', duration = 5000) => {
    const id = Date.now(); // Identifiant unique basé sur l'heure
    console.log('Setting FlashMessage:', { id, message, type, duration });
    setFlashMessage({ message, type, duration });
  
    setTimeout(() => {
      console.log('Auto-closing FlashMessage');
      setFlashMessage(null);
    }, duration);
  }, []);
  

  return { flashMessage, showFlashMessage };
};