export interface Alert {
    marque: string; // Nom de la marque
    blocking: 'yes' | 'no'; // "yes" ou "no" pour indiquer si le problème est bloquant
    description: string; // Description du bug
    bugLocation: string; // Emplacement du bug
    emojis: string; // Émojis associés
    capture?: string; // Capture d'écran (optionnelle)
    tips?: string; // Astuce proposée (optionnelle)
  }
  