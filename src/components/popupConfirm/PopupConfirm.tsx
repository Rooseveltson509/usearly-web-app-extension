import React, { useState } from 'react';
import AnimatedPoints from '../animationsPoint/AnimatedPoints';

interface PopupConfirm {
    onClose: () => void;
}
const PopupConfirm: React.FC<PopupConfirm> = ({ onClose }: { onClose: () => void }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);

        // Appeler l'API PUT avec la catégorie sélectionnée
        fetch('/api/update-category', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour de la catégorie');
                }
                console.log('Catégorie mise à jour avec succès :', category);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="category-popup-overlay">
            <div className="category-popup">
                <div className="popup-header">
                    <div className="popup-icon"><svg xmlns="http://www.w3.org/2000/svg" width="122" height="120" viewBox="0 0 122 120" fill="none">
                        <g filter="url(#filter0_d_400_2238)">
                            <rect x="34" y="30" width="53.0732" height="51.4146" rx="8" fill="url(#paint0_linear_400_2238)" />
                        </g>
                        <path d="M63.1231 41.6094H70.1059V60.282C70.1059 62.44 69.5923 64.32 68.5652 65.922C67.538 67.5146 66.1056 68.7491 64.268 69.6255C62.4304 70.4924 60.296 70.9259 57.8648 70.9259C55.4052 70.9259 53.2567 70.4924 51.4191 69.6255C49.5815 68.7491 48.1538 67.5146 47.1361 65.922C46.1184 64.32 45.6095 62.44 45.6095 60.282V41.6094H52.6064V59.6742C52.6064 60.6731 52.8232 61.5636 53.2567 62.3458C53.6996 63.1279 54.3168 63.7405 55.1084 64.1834C55.9 64.6263 56.8188 64.8477 57.8648 64.8477C58.9108 64.8477 59.8249 64.6263 60.607 64.1834C61.3986 63.7405 62.0158 63.1279 62.4587 62.3458C62.9016 61.5636 63.1231 60.6731 63.1231 59.6742V41.6094Z" fill="white" />
                        <path d="M77.018 70.9683C76.0003 70.9683 75.1286 70.6102 74.403 69.894C73.6868 69.1778 73.3334 68.3109 73.3429 67.2931C73.3334 66.2942 73.6868 65.4414 74.403 64.7347C75.1286 64.0185 76.0003 63.6604 77.018 63.6604C77.9792 63.6604 78.8273 64.0185 79.5624 64.7347C80.3068 65.4414 80.6838 66.2942 80.6932 67.2931C80.6838 67.9716 80.5047 68.5889 80.1561 69.1449C79.8168 69.7008 79.3692 70.1437 78.8132 70.4736C78.2666 70.8034 77.6683 70.9683 77.018 70.9683Z" fill="white" />
                        <defs>
                            <filter id="filter0_d_400_2238" x="0" y="0" width="121.073" height="119.415" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="17" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_400_2238" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_400_2238" result="shape" />
                            </filter>
                            <linearGradient id="paint0_linear_400_2238" x1="24.7699" y1="81.4146" x2="94.2894" y2="27.884" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#5A13A5" />
                                <stop offset="1" stopColor="#FE2190" />
                            </linearGradient>
                        </defs>
                    </svg></div>
                    <button className="popup-close" onClick={onClose}>
                        ✖
                    </button>
                </div>
                <div className="popup-content">
                    <h1 className='h1Title'>Signalement reçu, merci !</h1>
                    <div className="popup-points">
                        <span role="img" aria-label="thumbs-up">
                            👍
                        </span>{' '}
                        <AnimatedPoints startPoints={0} endPoints={10} duration={1000} />
                    </div>
                    <p>
                        Nous n'avons pas identifié la catégorie de votre signalement.
                        Pouvez-vous choisir ?{' '}
                        <span role="img" aria-label="smile">
                            😊
                        </span>
                    </p>
                    <div className="popup-categories">
                        {['Catégorie 1', 'Catégorie 2', 'Catégorie 3', 'Autre'].map((category, index) => (
                            <label key={index} className={`popup-category ${selectedCategory === category ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={selectedCategory === category}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>
                <button className="popup-close-button" onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default PopupConfirm;