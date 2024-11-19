import { setToken, removeToken, getToken } from './utils/storageUtil';

const API_URL = 'https://usearly-api.vercel.app/api/v1';

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    console.log("Message reçu dans le script de fond :", message);

    if (message.action === "captureTab") {
        chrome.windows.getCurrent({ populate: false }, (window) => {
            const windowId = window?.id;
            if (typeof windowId === "number") {
                chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
                    if (chrome.runtime.lastError) {
                        console.log("Erreur de capture d'onglet :", chrome.runtime.lastError.message);
                        sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    } else {
                        sendResponse({ success: true, dataUrl: dataUrl });
                    }
                });
            } else {
                sendResponse({ success: false, error: "ID de fenêtre non valide." });
            }
        });
        return true; // Assurez-vous de retourner `true` pour les réponses asynchrones
    }

    else if (message.action === "login") {
        const { email, password } = message;
        console.log("Tentative de connexion pour l'utilisateur :", email);

        try {
            const timeout = setTimeout(() => {
                console.log("Timeout pour la requête de connexion.");
                sendResponse({ success: false, error: 'Request timeout' });
            }, 5000); // Timeout de 5 secondes

            fetch(`${API_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode:'cors',
                body: JSON.stringify({ email, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("data: ", data)
                    clearTimeout(timeout); // Annule le timeout si la réponse arrive
                    if (data.token) {
                        setToken(data.token);
                        console.log("Connexion réussie. Token stocké.");
                        sendResponse({ success: true });
                    } else {
                        console.log("Échec de l'authentification : aucun token reçu.");
                        sendResponse({ success: false, error: 'Authentification échouée' });
                    }
                })
                .catch((error) => {
                    clearTimeout(timeout);
                    console.log("Erreur de connexion :", error);
                    sendResponse({ success: false, error: error.message });
                });
        } catch (error) {
            console.log("Erreur inattendue :", error);
            sendResponse({ success: false, error: 'Erreur interne' });
        }

        return true; // Retourner `true` pour les opérations asynchrones
    }

    else if (message.action === "logout") {
        console.log("Déconnexion de l'utilisateur.");
        removeToken();
        sendResponse({ success: true });
        return false;
    }

    else if (message.action === "isAuthenticated") {
        console.log("Vérification de l'authentification de l'utilisateur.");
        getToken().then((token) => {
            sendResponse({ isAuthenticated: !!token });
        });
        return true; // Permet la réponse asynchrone
    }
    else if (message.action === "test") {
        console.log("Message de test reçu du script de contenu.");
        sendResponse({ success: true });
        return false;
    }

    else if (message.action === "testLogin") {
        fetch("https://jsonplaceholder.typicode.com/todos/1")
            .then(response => response.json())
            .then(data => {
                console.log("Requête test réussie :", data);
                sendResponse({ success: true });
            })
            .catch(error => {
                console.error("Erreur dans la requête test :", error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
    console.log("Action non reconnue :", message.action);
    return false; // Retourner `false` pour indiquer qu'il n'y a pas de réponse asynchrone
});
