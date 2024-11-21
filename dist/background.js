/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/storageUtil.ts":
/*!**********************************!*\
  !*** ./src/utils/storageUtil.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getToken: () => (/* binding */ getToken),
/* harmony export */   removeToken: () => (/* binding */ removeToken),
/* harmony export */   setToken: () => (/* binding */ setToken)
/* harmony export */ });
// Enregistrement du token
function setToken(token) {
    chrome.storage.local.set({ token: token }, function () {
        console.log("Token enregistré dans chrome.storage");
    });
}
// Récupération du token
function getToken() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(["token"], function (result) {
            console.log("Token récupéré depuis le stockage:", result.token);
            resolve(result.token || null);
        });
    });
}
// Suppression du token
function removeToken() {
    chrome.storage.local.remove("token", function () {
        console.log("Token supprimé de chrome.storage");
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/storageUtil */ "./src/utils/storageUtil.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var API_URL = 'https://usearly-api.vercel.app/api/v1';
var FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;
// Fonction de déconnexion
function handleLogout() {
    console.log("Déconnexion automatique ou manuelle de l'utilisateur.");
    (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.removeToken)();
    chrome.storage.local.remove(['authToken', 'loginTime'], function () {
        console.log('Token et heure de connexion supprimés.');
    });
}
console.log("Service worker de l'extension démarré !");
// Vérifie périodiquement si 5 heures se sont écoulées depuis la connexion
setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        chrome.storage.local.get(['loginTime'], function (result) {
            var loginTime = result.loginTime || null;
            if (loginTime) {
                var elapsedTime = Date.now() - loginTime;
                console.log("Temps \u00E9coul\u00E9 : ".concat(elapsedTime / 1000, " secondes"));
                if (elapsedTime >= FIVE_HOURS_IN_MS) {
                    handleLogout(); // Appelle la fonction de déconnexion
                }
            }
        });
        return [2 /*return*/];
    });
}); }, 300000); // Vérifie toutes les 5 minutes
chrome.action.onClicked.addListener(function (tab) {
    console.log("Icône de l'extension cliquée.", tab);
    console.log("Envoi du message à content.js...");
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "showFloatingMenu" }, function (response) {
            if (chrome.runtime.lastError) {
                console.error("Erreur de communication avec content.js :", chrome.runtime.lastError.message);
            }
            else {
                console.log("Réponse de content.js :", response);
            }
        });
    }
    else {
        console.error("Aucun onglet actif trouvé !");
    }
});
// Gestion des messages entrants
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Message reçu dans le script de fond :", message);
    switch (message.action) {
        case "captureTab":
            chrome.windows.getCurrent({ populate: false }, function (window) {
                var windowId = window === null || window === void 0 ? void 0 : window.id;
                if (typeof windowId === "number") {
                    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, function (dataUrl) {
                        if (chrome.runtime.lastError) {
                            console.log("Erreur de capture d'onglet :", chrome.runtime.lastError.message);
                            sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        }
                        else {
                            sendResponse({ success: true, dataUrl: dataUrl });
                        }
                    });
                }
                else {
                    sendResponse({ success: false, error: "ID de fenêtre non valide." });
                }
            });
            return true; // Assurez-vous de retourner `true` pour les réponses asynchrones
        case "login":
            var email = message.email, password = message.password;
            console.log("Tentative de connexion pour l'utilisateur :", email);
            try {
                var timeout_1 = setTimeout(function () {
                    console.log("Timeout pour la requête de connexion.");
                    sendResponse({ success: false, error: 'Request timeout' });
                }, 5000); // Timeout de 5 secondes
                fetch("".concat(API_URL, "/user/login"), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors',
                    body: JSON.stringify({ email: email, password: password }),
                })
                    .then(function (response) { return response.json(); })
                    .then(function (data) {
                    console.log("data: ", data);
                    clearTimeout(timeout_1); // Annule le timeout si la réponse arrive
                    if (data.token) {
                        (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.setToken)(data.token);
                        chrome.storage.local.set({ loginTime: Date.now() }); // Enregistre l'heure de connexion
                        console.log("Connexion réussie. Token stocké.");
                        sendResponse({ success: true });
                    }
                    else {
                        console.log("Échec de l'authentification : aucun token reçu.");
                        sendResponse({ success: false, error: 'Authentification échouée' });
                    }
                })
                    .catch(function (error) {
                    clearTimeout(timeout_1);
                    console.log("Erreur de connexion :", error);
                    sendResponse({ success: false, error: error.message });
                });
            }
            catch (error) {
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
            (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.getToken)().then(function (token) {
                sendResponse({ isAuthenticated: !!token });
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
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map