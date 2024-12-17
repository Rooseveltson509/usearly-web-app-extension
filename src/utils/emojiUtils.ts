export const emojiSentiments = [
    { emoji: '😐', title: "Qu'est-ce qui pourrait être amélioré ?" },
    { emoji: '😤', title: "Qu'est-ce qui vous agace ?" },
    { emoji: '😡', title: "Qu'est-ce qui vous met en colère ?" },
    { emoji: '🤔', title: "Quel problème rencontrez-vous ?" },
    { emoji: '😭', title: "Qu’est-ce qui vous déçoit ?" },
    { emoji: '😖', title: "Qu’est-ce qui vous frustre ?" },
    { emoji: '😵', title: "Qu’est-ce qui vous choque ?" },
    { emoji: '🤣', title: "Qu’est-ce qui vous fait marrer ?" },
];

// Définition des émojis pour l’action `cheart`
export const heartEmojis = [
    { emoji: '👏', title: "Qu’est-ce que vous applaudissez ?" },
    { emoji: '👍', title: "Qu’est-ce que vous aimez ?" },
    { emoji: '❤️', title: "Qu’est-ce que vous adorez ?" },
    { emoji: '🤩', title: "Qu’est-ce qui vous impressionne ?" },
    { emoji: '🤣', title: "Qu’est-ce qui rend joyeux ?" },
];

// Fonction pour obtenir les émojis selon l’action
export const getEmojisForAction = (action: string) => {
    if (action === 'cheart') {
        return heartEmojis;
    }
    return emojiSentiments;
};


// Fonction pour obtenir le titre d’un emoji
export const getTitleForEmoji = (emoji: string, action: string): string => {
    const emojis = getEmojisForAction(action); // Obtenir les émojis pour l'action
    const match = emojis.find((item) => item.emoji === emoji);
    return match?.title || "Donnez votre avis";
};

