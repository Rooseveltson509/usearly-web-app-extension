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

var API_URL = 'https://usearly-api.vercel.app/api/v1';
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Message reçu dans le script de fond :", message);
    if (message.action === "captureTab") {
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
    }
    else if (message.action === "login") {
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
    }
    else if (message.action === "logout") {
        console.log("Déconnexion de l'utilisateur.");
        (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.removeToken)();
        sendResponse({ success: true });
        return false;
    }
    else if (message.action === "isAuthenticated") {
        console.log("Vérification de l'authentification de l'utilisateur.");
        (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.getToken)().then(function (token) {
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
            .then(function (response) { return response.json(); })
            .then(function (data) {
            console.log("Requête test réussie :", data);
            sendResponse({ success: true });
        })
            .catch(function (error) {
            console.error("Erreur dans la requête test :", error);
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
    console.log("Action non reconnue :", message.action);
    return false; // Retourner `false` pour indiquer qu'il n'y a pas de réponse asynchrone
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map