import { getTokens, removeTokens, setTokens } from './utils/storageUtil';
import { shouldBlockUrl } from "./utils/blockAdultSites";

const API_URL = 'https://usearly-api.vercel.app/api/v1';
const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;



/* chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && shouldBlockUrl(tab.url)) {
    console.log("Site bloqué : désactivation de l'extension.");
    chrome.action.disable(tabId); // Désactive l'icône de l'extension
  } else {
    chrome.action.enable(tabId); // Active l'icône de l'extension
  }
}); */


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (shouldBlockUrl(tab.url)) {
            // Envoie un message au content script pour afficher le popup
            // Injecte le content script pour flouter les médias
            chrome.scripting.executeScript({
                target: { tabId },
                files: ["contentScript.js"], // Assurez-vous que le fichier est compilé en JS
            });

            // Ferme l'onglet après un délai de 3 secondes
            /* setTimeout(() => {
                chrome.tabs.remove(tabId, () => {
                    console.log(`Onglet fermé pour contenu inapproprié : ${tab.url}`);
                });
            }, 10000);  */// Délai de 3 secondes avant la fermeture
        }
    }
});



// Fonction de déconnexion
function handleLogout() {
    console.log("Déconnexion automatique ou manuelle de l'utilisateur.");
    removeTokens();
    chrome.storage.local.remove(['authToken', 'loginTime'], () => {
        console.log('Token et heure de connexion supprimés.');
    });
}

// Vérifie périodiquement si 5 heures se sont écoulées depuis la connexion
/* setInterval(async () => {
    chrome.storage.local.get(['loginTime'], (result) => {
        const loginTime = result.loginTime || null;

        if (loginTime) {
            const elapsedTime = Date.now() - loginTime;
            console.log(`Temps écoulé : ${elapsedTime / 1000} secondes`);
            if (elapsedTime >= FIVE_HOURS_IN_MS) {
                handleLogout(); // Appelle la fonction de déconnexion
            }
        }
    });
}, 300000);  */// Vérifie toutes les 5 minutes


chrome.action.onClicked.addListener((tab) => {
    console.log("Icône de l'extension cliquée.", tab);
    console.log("Envoi du message à content.js...");

    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "showFloatingMenu" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Erreur de communication avec content.js :", chrome.runtime.lastError.message);
            } else {
                console.log("Réponse de content.js :", response);
            }
        });
    } else {
        console.error("Aucun onglet actif trouvé !");
    }
});







// Gestion des messages entrants
chrome.runtime.onMessage.addListener(
    (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
        console.log("Message reçu dans le script de fond :", message);

        switch (message.action) {
            case "captureTab":
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

            case "login":
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
                        mode: 'cors',
                        body: JSON.stringify({ email, password }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("data: ", data);
                            clearTimeout(timeout); // Annule le timeout si la réponse arrive
                            if (data.token && data.refreshToken) {
                                setTokens(data.token, data.refreshToken);
                                chrome.storage.local.set({ loginTime: Date.now() }); // Enregistre l'heure de connexion
                                console.log("Connexion réussie. Tokens stockés.");
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

            case "logout":
                handleLogout(); // Appelle la fonction de déconnexion
                sendResponse({ success: true });
                return false;

            case "isAuthenticated":
                console.log("Vérification de l'authentification de l'utilisateur.");
                getTokens().then((tokens) => {
                    sendResponse({ isAuthenticated: !!tokens.accessToken });
                });
                return true; // Permet la réponse asynchrone

            case "test":
                console.log("Message de test reçu du script de contenu.");
                sendResponse({ success: true });
                return false;

            default:
                console.log("Action non reconnue :", message.action);
                sendResponse({ success: false, error: "Action non reconnue" });
                return false;
        }
    }
);
