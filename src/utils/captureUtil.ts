import html2canvas from 'html2canvas';

/**
 * Démarre une capture d'écran en permettant à l'utilisateur de sélectionner une zone.
 * @returns {Promise<string | null>} - L'URL de la capture ou null si la capture est annulée.
 */
export const initiateCapture = async (): Promise<string | null> => {
  try {
    // Appeler html2canvas pour capturer une capture d'écran complète
    const canvas = await html2canvas(document.body, { useCORS: true, allowTaint: false });
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  } catch (error) {
    console.error('Erreur lors de la capture :', error);
    return null;
  }
};
