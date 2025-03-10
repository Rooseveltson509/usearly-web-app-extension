import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import { isUserAuthenticated, logout } from '../services/AuthService';
import CaptureOverlay from './captureOverlay/CaptureOverlay';
import { getTokens } from '../utils/storageUtil';

interface FloatingMenuProps {
    x: number;
    y: number;
    /*     onCommentClick: () => void;
        onCaptureClick: () => void; */
    onActionClick: (action: string) => void; // Prop pour capturer les actions
    onClose?: () => void; // Optionnel pour fermer le menu
}

const DraggableFloatingMenu: React.FC<FloatingMenuProps> = ({ x, y, onActionClick, onClose }) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [domain, setDomain] = useState<string>('');
    const [showMenu, setShowMenu] = useState(true); // État pour contrôler l'affichage du menu
    const [isCaptureMode, setIsCaptureMode] = useState(false);


    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // L'URL complète
        const currentUrl = window.location.href;

        try {
            // Créer un objet URL
            const urlObj = new URL(currentUrl);

            // Extraire uniquement le domaine sans www
            const cleanDomain = urlObj.hostname.replace(/^www\./, '');
            setDomain(cleanDomain);
            console.log("Le nom du site sur lequel tu te trouve c'est: ", cleanDomain)
        } catch (error) {
            console.error('Erreur lors de la récupération du domaine:', error);
        }
    }, []);


    const handleStartCapture = () => {
        setIsCaptureMode(true);
    };

    const handleCancelCapture = () => {
        setIsCaptureMode(false);
    };

    const handleButtonClick = async (action: () => void) => {
        //const isAuthenticated = await isUserAuthenticated(); // Attendre que la promesse se résolve
        const isAuthenticated = await getTokens();
        const accessToken = isAuthenticated.accessToken;
        if (accessToken) {
            console.log("isUserAuthenticated: ", accessToken)
            action(); // Si l'utilisateur est connecté, exécute l'action
        } else {
            setPendingAction(() => action); // Enregistre l'action en attente
            setShowLoginForm(true); // Affiche le formulaire de connexion
        }
    };


    const handleLoginSuccess = () => {
        setShowLoginForm(false); // Ferme le formulaire de connexion
        if (pendingAction) {
            pendingAction(); // Exécute l'action en attente
            setPendingAction(null); // Réinitialise l'action en attente
        }
    };

    const handleLogout = () => {
        logout(); // Appelle la fonction de déconnexion
        setShowLoginForm(true); // Affiche le formulaire de connexion
    };

    const handleCloseMenu = () => {
        setShowMenu(false); // Masque le menu lorsqu'on clique sur le bouton de fermeture
        if (onClose) onClose(); // Appel de la fonction onClose s'il est passé en props
        const event = new CustomEvent('menuClosed'); // Crée un événement personnalisé
        document.dispatchEvent(event); // Émet l'événement pour informer que le menu est fermé
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 200));
            const newY = Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 100));
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, offset]);
    if (!showMenu) return null; // Retourner `null` au lieu de `false`

    return (

        <div className='floating-menu my-extension-floating-menu' id="close-floating-menu"
            onMouseDown={handleMouseDown}
            style={{
                position: "fixed",
                /* inset-inline-start: `${position.x}px`,
                inset-block-start: `${position.y}px`, */
                /*         inline-size: '200px',
                        padding: '10px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '8px', */
                cursor: 'move',
                zIndex: 1000,
            }}
        >

            <div className="tooltip-container">
                <svg className='svg-icon' onClick={() => handleButtonClick(() => console.log('Action Commenter: '))} id="uIcon" width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.56 0H14.77V11.26C14.77 12.56 14.46 13.69 13.84 14.66C13.22 15.62 12.36 16.36 11.25 16.89C10.14 17.41 8.86 17.67 7.39 17.67C5.92 17.67 4.61 17.41 3.5 16.89C2.39 16.36 1.53 15.62 0.92 14.66C0.31 13.69 0 12.56 0 11.26V0H4.22V10.89C4.22 11.49 4.35 12.03 4.61 12.5C4.88 12.97 5.25 13.34 5.73 13.61C6.21 13.88 6.76 14.01 7.39 14.01C8.02 14.01 8.57 13.88 9.04 13.61C9.52 13.34 9.89 12.97 10.16 12.5C10.43 12.03 10.56 11.49 10.56 10.89V0Z" fill="#D9D9D9" />
                    <path d="M18.9402 17.7C18.3302 17.7 17.8002 17.48 17.3602 17.05C16.9302 16.62 16.7202 16.1 16.7202 15.48C16.7202 14.88 16.9302 14.36 17.3602 13.94C17.8002 13.51 18.3202 13.29 18.9402 13.29C19.5202 13.29 20.0302 13.51 20.4702 13.94C20.9202 14.37 21.1502 14.88 21.1502 15.48C21.1502 15.89 21.0402 16.26 20.8302 16.6C20.6302 16.94 20.3602 17.2 20.0202 17.4C19.6902 17.6 19.3302 17.7 18.9402 17.7Z" fill="#D9D9D9" />
                </svg>
                <div className="tooltip-text" id='u'>
                    Feedback
                    <span className="tooltip-arrow"></span>
                </div>
            </div>
            <div className="tooltip-container">
                <svg className='svg-icon' onClick={() => onActionClick('capture')} id="commentIcon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 5.86C13.26 5.86 13.51 5.96 13.69 6.15C13.87 6.33 13.98 6.58 13.98 6.84V14.96C13.98 15.22 13.88 15.47 13.69 15.65C13.51 15.83 13.26 15.94 13 15.94C12.74 15.94 12.49 15.84 12.31 15.65C12.13 15.47 12.02 15.22 12.02 14.96V6.84C12.02 6.58 12.12 6.33 12.31 6.15C12.49 5.97 12.74 5.86 13 5.86ZM13 20.15C13.34 20.15 13.68 20.01 13.92 19.77C14.16 19.53 14.3 19.2 14.3 18.85C14.3 18.5 14.16 18.17 13.92 17.93C13.68 17.69 13.35 17.55 13 17.55C12.65 17.55 12.32 17.69 12.08 17.93C11.84 18.17 11.7 18.5 11.7 18.85C11.7 19.2 11.84 19.53 12.08 19.77C12.32 20.01 12.65 20.15 13 20.15ZM13 0.00999975C20.18 0.00999975 26 5.83 26 13.01C26 20.19 20.18 26.01 13 26.01C10.93 26.01 8.88 25.52 7.04 24.56L2.07 25.95C1.79 26.03 1.5 26.03 1.22 25.95C0.939997 25.88 0.69 25.73 0.48 25.53C0.28 25.33 0.129998 25.07 0.0599976 24.79C-0.0100024 24.51 -0.0100024 24.22 0.0599976 23.94L1.45 18.97C0.489997 17.13 0 15.08 0 13C0 5.82 5.82 0 13 0V0.00999975ZM13 1.96C10.07 1.96 7.26 3.12 5.19 5.2C3.12 7.27 1.95 10.08 1.95 13.01C1.95 14.92 2.43 16.76 3.34 18.39L3.54 18.74L2.09 23.92L7.27 22.47L7.62 22.67C9.09 23.49 10.74 23.96 12.42 24.05C14.11 24.14 15.79 23.84 17.34 23.17C18.89 22.51 20.27 21.49 21.37 20.22C22.47 18.94 23.26 17.43 23.69 15.79C24.11 14.16 24.16 12.45 23.82 10.8C23.48 9.15 22.77 7.59 21.74 6.26C20.71 4.93 19.38 3.85 17.87 3.1C16.36 2.36 14.69 1.97 13 1.97V1.96Z" fill="#D9D9D9" />
                </svg>
                <div className="tooltip-text" id='comment'>
                    Signalement
                    <span className="tooltip-arrow"></span>
                </div>
            </div>
            <div className="tooltip-container">
                <svg className='svg-icon' onClick={() => onActionClick('cheart')} id="heartIcon" width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.41 4.81C26.01 3.86 25.44 3.01 24.7 2.29C23.21 0.820001 21.24 0.0100021 19.13 0.0100021C17.05 0.0100021 15.08 0.810003 13.58 2.28L13.51 2.35L13.44 2.28C11.95 0.810003 9.98 0 7.87 0C5.79 0 3.82 0.800002 2.33 2.26C1.59 2.98 1.02 3.83 0.610001 4.78C0.210001 5.73 0.01 6.74 0 7.77C0 8.8 0.199998 9.81 0.599998 10.76C0.999998 11.71 1.57 12.56 2.3 13.28L12.87 23.72C13.04 23.89 13.26 23.98 13.5 23.98C13.74 23.98 13.96 23.89 14.13 23.72L24.68 13.32C25.42 12.6 25.99 11.76 26.39 10.8C26.79 9.85 26.99 8.85 27 7.81C27 6.78 26.8 5.77 26.4 4.82L26.41 4.81ZM7.88 1.79C9.49 1.79 11.02 2.42 12.17 3.55L12.87 4.25C13.22 4.59 13.78 4.59 14.13 4.25L14.83 3.56C15.99 2.43 17.51 1.81 19.13 1.81C20.75 1.81 22.27 2.44 23.43 3.58C23.99 4.13 24.43 4.78 24.74 5.51C25.05 6.24 25.2 7.01 25.2 7.8C25.2 8.59 25.04 9.36 24.73 10.09C24.42 10.82 23.98 11.47 23.41 12.02L13.49 21.8L3.55 11.98C2.99 11.43 2.55 10.78 2.24 10.05C1.93 9.32 1.78 8.55 1.78 7.76C1.78 6.97 1.94 6.2 2.25 5.47C2.56 4.74 3 4.09 3.56 3.54C4.72 2.41 6.24 1.79 7.85 1.79" fill="#D9D9D9" />
                </svg>
                <div className="tooltip-text" id='heartI'>
                    Coup de coeur
                    <span className="tooltip-arrow"></span>
                </div>
            </div>

            <div>
                <div className="tooltip-container">
                    <svg className='svg-icon' onClick={() => onActionClick('suggestion')} id="magicIcon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.6025 12.0643L25.7325 7.74426L27.1625 2.72426C27.2525 2.41426 27.1625 2.07426 26.9325 1.84426C26.7025 1.61426 26.3625 1.52426 26.0525 1.61426L21.0625 3.07426L16.7325 0.154257C16.4625 -0.0257434 16.1125 -0.0557434 15.8225 0.104257C15.5325 0.254257 15.3425 0.554257 15.3325 0.874257L15.1825 6.09426L11.0825 9.31426C10.8225 9.51426 10.7025 9.84426 10.7525 10.1643C10.8025 10.4843 11.0225 10.7543 11.3325 10.8643L15.1725 12.2443C15.1725 12.2443 15.1225 12.2843 15.0925 12.3043L0.2625 27.2243C-0.0875 27.5743 -0.0875 28.1443 0.2625 28.4943C0.4325 28.6743 0.6625 28.7543 0.8925 28.7543C1.1225 28.7543 1.3525 28.6643 1.5225 28.4943L16.3625 13.5943C16.4225 13.5343 16.4625 13.4743 16.5025 13.4043L18.0025 17.5443C18.0625 17.6943 18.1525 17.8243 18.2725 17.9343C18.3925 18.0343 18.5425 18.1043 18.7025 18.1243C18.7525 18.1243 18.7925 18.1343 18.8425 18.1343C18.9825 18.1343 19.1125 18.1043 19.2325 18.0443C19.3525 17.9843 19.4625 17.8943 19.5425 17.7843L22.7225 13.6543L27.8625 13.4743C28.1925 13.4643 28.4825 13.2743 28.6325 12.9843C28.7825 12.6943 28.7525 12.3443 28.5725 12.0743L28.6025 12.0643ZM22.2625 11.8643C21.9925 11.8643 21.7525 12.0043 21.5825 12.2143L19.1325 15.3943L17.7625 11.6243C17.6725 11.3743 17.4725 11.1743 17.2225 11.0843L13.4625 9.72426L16.6125 7.25426C16.8225 7.09426 16.9425 6.84426 16.9525 6.57426L17.0725 2.56426L20.3925 4.80426C20.5025 4.87426 20.6225 4.92426 20.7525 4.94426C20.8825 4.96426 21.0125 4.95426 21.1425 4.92426L24.9825 3.79426L23.8825 7.65426C23.8425 7.78426 23.8425 7.91426 23.8625 8.04426C23.8825 8.17426 23.9325 8.29426 24.0025 8.40426L26.2525 11.7243L22.2525 11.8643H22.2625Z" fill="#D9D9D9" />
                    </svg>
                    <div className="tooltip-text" id='magicI'>
                        Suggestion
                        <span className="tooltip-arrow"></span>
                    </div>
                </div>
            </div>
            {showLoginForm && (
                <LoginForm
                    onClose={() => setShowLoginForm(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
            {/* <button onClick={handleLogout}>Logout</button> */}
            <div className='close-button' onClick={handleCloseMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                    <path d="M11.2502 3.49982L4.25024 10.4998" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M11.3376 10.4108L4.25034 3.50029" stroke="#D2D7E0" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
};

export default DraggableFloatingMenu;