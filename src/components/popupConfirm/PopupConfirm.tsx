import React, { useState } from 'react';

interface PopupConfirm {
    onClose: () => void;
}
const PopupConfirm: React.FC<PopupConfirm> = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className='popup-confirm'>
            <div className='close-button' onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                    <path d="M11.2502 3.49982L4.25024 10.4998" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M11.3376 10.4108L4.25034 3.50029" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
            </div>
            <div className='fusee'>🚀</div>
            <h1 className='h1Title'>Signalement reçu, merci !
                On plonge dedans illico 🚀</h1>
            <p className='popupParaph'>Bravo pour votre 22e signalement</p>
            <button className='btn-ptn'>+10 points</button>
            <div style={{ marginTop: '15px' }}>
                <input type="checkbox" />
                <label className="noDisplay">Tenez-moi au jus quand c'est réglé !</label>
            </div>
            <button className='closeBtn' onClick={onClose}>Fermer</button>
        </div>
    );
};

export default PopupConfirm;