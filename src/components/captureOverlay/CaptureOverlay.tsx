import React, { useState } from 'react';
import './CaptureOverlay.css';

interface CaptureOverlayProps {
    onCancel: () => void;
}

const CaptureOverlay: React.FC<CaptureOverlayProps> = ({ onCancel }) => {
    const [selectionBox, setSelectionBox] = useState<HTMLDivElement | null>(null);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    // Commence la sélection
    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.clientX);
        setStartY(e.clientY);

        const box = document.createElement('div');
        box.className = 'selection-box';
        box.style.top = `${e.clientY}px`;
        box.style.left = `${e.clientX}px`;
        document.body.appendChild(box);
        setSelectionBox(box);
    };

    // Gère le redimensionnement de la boîte
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selectionBox) return;

        const width = e.clientX - startX;
        const height = e.clientY - startY;

        selectionBox.style.width = `${Math.abs(width)}px`;
        selectionBox.style.height = `${Math.abs(height)}px`;

        if (width < 0) {
            selectionBox.style.left = `${startX + width}px`;
        }
        if (height < 0) {
            selectionBox.style.top = `${startY + height}px`;
        }
    };

    // Terminer la sélection
    const handleMouseUp = () => {
        if (selectionBox) {
            const rect = selectionBox.getBoundingClientRect();
            console.log('Zone sélectionnée :', rect);
            document.body.removeChild(selectionBox);
            setSelectionBox(null);
        }
    };

    return (
        <div
            className="capture-overlay"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Texte flottant */}
            <div className="floating-bubble">
                <i className="camera-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 5V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H5M1 13V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H5M13 1H15C15.5304 1 16.0391 1.21071 16.4142 1.58579C16.7893 1.96086 17 2.46957 17 3V5M13 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V13M6 9C6 9.79565 6.31607 10.5587 6.87868 11.1213C7.44129 11.6839 8.20435 12 9 12C9.79565 12 10.5587 11.6839 11.1213 11.1213C11.6839 10.5587 12 9.79565 12 9C12 8.20435 11.6839 7.44129 11.1213 6.87868C10.5587 6.31607 9.79565 6 9 6C8.20435 6 7.44129 6.31607 6.87868 6.87868C6.31607 7.44129 6 8.20435 6 9Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg></i>
                <span>Sélectionnez la zone du problème</span>
            </div>
            {/* Bouton pour annuler */}
            <button className="cancel-button" onClick={onCancel}>
                Annuler
            </button>
        </div>
    );
};

export default CaptureOverlay;