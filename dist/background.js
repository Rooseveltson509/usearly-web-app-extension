/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/AuthService.ts":
/*!*************************************!*\
  !*** ./src/services/AuthService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLoginTime: () => (/* binding */ getLoginTime),
/* harmony export */   getValidToken: () => (/* binding */ getValidToken),
/* harmony export */   isUserAuthenticated: () => (/* binding */ isUserAuthenticated),
/* harmony export */   login: () => (/* binding */ login),
/* harmony export */   logout: () => (/* binding */ logout)
/* harmony export */ });
/* harmony import */ var _utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storageUtil */ "./src/utils/storageUtil.ts");
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
 // Mise à jour pour chrome.storage
//const API_URL = 'https://usearlyapi.fly.dev/api/v1';
var API_URL = 'http://localhost:3000/api/v1';
function login(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/user/login"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: email, password: password }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("\u00C9chec de la connexion (".concat(response.status, "):"), response.statusText);
                        // Optionnel : affiche un message utilisateur basé sur le code d'état HTTP
                        if (response.status === 401) {
                            //alert("Identifiants incorrects. Veuillez réessayer.");
                        }
                        else if (response.status >= 500) {
                            //alert("Erreur serveur. Veuillez réessayer plus tard.");
                        }
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.accessToken) {
                        (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.setTokens)(data.accessToken); // Stocke uniquement l'accessToken
                        console.log("Connexion réussie. Token stocké.");
                        (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.setLoginTime)(); // Met à jour l'heure de connexion
                        return [2 /*return*/, true];
                    }
                    console.error("Aucun accessToken reçu.");
                    alert("Une erreur inattendue est survenue. Veuillez réessayer.");
                    return [2 /*return*/, false];
                case 3:
                    error_1 = _a.sent();
                    console.error("Erreur lors de la connexion :", error_1);
                    alert("Impossible de se connecter. Veuillez vérifier votre connexion réseau.");
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function isUserAuthenticated() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        chrome.runtime.sendMessage({ action: 'isAuthenticated' }, function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var loginTime, elapsedTime, FIVE_HOURS_IN_MS;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!chrome.runtime.lastError) return [3 /*break*/, 1];
                                        console.error("Erreur de communication avec le script de fond :", chrome.runtime.lastError.message);
                                        resolve(false);
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, getLoginTime()];
                                    case 2:
                                        loginTime = _b.sent();
                                        if (loginTime) {
                                            elapsedTime = Date.now() - loginTime;
                                            FIVE_HOURS_IN_MS = 24 * 60 * 60 * 1000;
                                            //const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000; 
                                            if (elapsedTime >= FIVE_HOURS_IN_MS) {
                                                //console.log(`Temps écoulé ::: ${elapsedTime / 1000} secondes. Déconnexion.`);
                                                logout(); // Déconnectez si 20 secondes sont écoulées
                                                resolve(false);
                                            }
                                            else {
                                                console.log("Temps restant avant d\u00E9connexion ::: ".concat((FIVE_HOURS_IN_MS - elapsedTime) / 1000, " secondes."));
                                                resolve((_a = response === null || response === void 0 ? void 0 : response.isAuthenticated) !== null && _a !== void 0 ? _a : false);
                                            }
                                        }
                                        else {
                                            resolve(false); // Aucun login enregistré
                                        }
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
// Récupère l'heure de connexion
function getLoginTime() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    chrome.storage.local.get(['loginTime'], function (result) {
                        resolve(result.loginTime || null);
                    });
                })];
        });
    });
}
function logout() {
    chrome.storage.local.remove(["accessToken", "refreshToken", "loginTime"], function () {
        if (chrome.runtime.lastError) {
            console.error("Erreur lors de la déconnexion :", chrome.runtime.lastError.message);
        }
        else {
            console.log("Déconnexion réussie, données supprimées.");
        }
    });
}
// Récupère un token valide (soit l'Access Token actuel, soit un nouveau)
function getValidToken() {
    return __awaiter(this, void 0, void 0, function () {
        var tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.getTokens)()];
                case 1:
                    tokens = _a.sent();
                    // Vérifie si l'accessToken existe
                    if (tokens.accessToken) {
                        return [2 /*return*/, tokens.accessToken];
                    }
                    console.warn("Aucun accessToken valide trouvé.");
                    return [2 /*return*/, null];
            }
        });
    });
}


/***/ }),

/***/ "./src/utils/blockAdultSites.ts":
/*!**************************************!*\
  !*** ./src/utils/blockAdultSites.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shouldBlockUrl: () => (/* binding */ shouldBlockUrl)
/* harmony export */ });
// Liste noire de domaines connus pour adultes
var forbiddenDomains = [
    "exampleporn.com",
    "violentsite.com",
    "adult-content.com",
    "badsites.net",
    "pornhub.com",
    "pornhub.com",
    "xvideos.com",
    "redtube.com",
    "xnxx.com",
    "youporn.com",
    "brazzers.com",
    "adultfriendfinder.com",
    "livejasmin.com",
    "airbnb.fr",
    "fr.pornhub.com",
    "nike.com",
    "fr.pornhub",
];
var forbiddenKeywords = [
    "porn",
    "violent",
    "xxx",
    "porn+hardcor+violent",
    "pornhub",
    "murder",
    "meurtre",
    "sexual",
    "assasin",
    "assassination",
    "pédophile",
    "pedophilia",
    "pedo",
    "tuer",
    "tuerie",
    "tue",
    "inappropriate",
    "nsfw",
    "sex",
    "erotic",
];
// https://www.airbnb.fr/rooms/52621429?adults=2&category_tag=Tag%3A4104&children=0&enable_m3_private_room=true&infants=0&pets=0&photo_id=1667039872&search_mode=flex_destinations_search&check_in=2025-01-03&check_out=2025-01-08&source_impression_id=p3_1732287557_P3IQ3z7DTBGIxxhx&previous_page_section_name=1000
// Liste de mots-clés sensibles dans les URLs
/**
 * Vérifie si le site actuel doit être bloqué.
 * @param url L'URL complète de la page web.
 * @returns true si le site est inapproprié, sinon false.
 */
function shouldBlockUrl(url) {
    try {
        // Créer une instance d'URL
        var parsedUrl = new URL(url);
        // Extraire le domaine (hostname)
        var domain_1 = parsedUrl.hostname.toLowerCase();
        // Vérifier si le domaine est dans la liste interdite
        if (forbiddenDomains.some(function (forbiddenDomain) {
            return domain_1.includes(forbiddenDomain);
        })) {
            console.log("URL bloqu\u00E9e : Domaine interdit (".concat(domain_1, ")"));
            return true;
        }
        // Extraire le chemin complet (path)
        var path_1 = parsedUrl.pathname.toLowerCase();
        // Vérifier si un mot-clé interdit est dans le chemin
        if (forbiddenKeywords.some(function (keyword) { return path_1.includes(keyword); })) {
            console.log("URL bloqu\u00E9e : Mot-cl\u00E9 interdit dans le chemin (".concat(path_1, ")"));
            return true;
        }
        // Extraire les paramètres de requête (query string)
        var query_1 = parsedUrl.search.toLowerCase();
        // Vérifier si un mot-clé interdit est dans les paramètres de requête
        if (forbiddenKeywords.some(function (keyword) { return query_1.includes(keyword); })) {
            console.log("URL bloqu\u00E9e : Mot-cl\u00E9 interdit dans les param\u00E8tres (".concat(query_1, ")"));
            return true;
        }
        // Si aucune condition de blocage n'est satisfaite, autoriser l'accès
        console.log("URL autoris\u00E9e : ".concat(url));
        return false;
    }
    catch (error) {
        console.error("Erreur lors de l'analyse de l'URL : ".concat(error));
        return true; // Bloquer par défaut en cas d'erreur
    }
}
/* export function isAdultSite(url: string): boolean {
    const domain = new URL(url).hostname.toLowerCase();

    // Vérifie si le domaine ou l'URL contient des contenus sensibles
    if (
        forbiddenDomains.some((blockedDomain) => domain.includes(blockedDomain)) ||
        forbiddenKeywords.some((keyword) => url.toLowerCase().includes(keyword))
    ) {
        return true;
    }

    return false;
} */


/***/ }),

/***/ "./src/utils/storageUtil.ts":
/*!**********************************!*\
  !*** ./src/utils/storageUtil.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTokens: () => (/* binding */ getTokens),
/* harmony export */   isTokenExpired: () => (/* binding */ isTokenExpired),
/* harmony export */   removeTokens: () => (/* binding */ removeTokens),
/* harmony export */   setLoginTime: () => (/* binding */ setLoginTime),
/* harmony export */   setTokens: () => (/* binding */ setTokens)
/* harmony export */ });
// Enregistrement des tokens
/* export function setTokens(accessToken: string, refreshToken: string | null) {
  chrome.storage.local.set({ accessToken, refreshToken }, () => {
    console.log("Tokens enregistrés dans chrome.storage :", {
      accessToken,
      refreshToken,
    });
  });
}
 */
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
// Récupération des tokens
/* export function getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["accessToken", "refreshToken"], (result) => {
      console.log("Tokens récupérés depuis le stockage:", result);
      resolve({
        accessToken: result.accessToken || null,
        refreshToken: result.refreshToken || null,
      });
    });
  });
} */
/*   export function getTokens(): { accessToken: string | null; refreshToken: string | null } {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  } */
/*     export async function getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
      return new Promise((resolve) => {
        chrome.storage.local.get(["accessToken", "refreshToken"], (result) => {
          console.log("Tokens récupérés depuis chrome.storage :", result);
          resolve({
            accessToken: result.accessToken || null,
            refreshToken: result.refreshToken || null,
          });
        });
      });
    } */
var TWENTY_FIVE_HOURS_IN_MS = 24 * 60 * 60 * 1000;
var memoryCache = { accessToken: null };
// Stocke l'accessToken
function setTokens(accessToken) {
    memoryCache.accessToken = accessToken; // Cache en mémoire
    chrome.storage.local.set({ accessToken: accessToken }, function () {
        console.log("AccessToken enregistré dans chrome.storage :", accessToken);
    });
}
function getTokens() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (memoryCache.accessToken) {
                console.log("AccessToken récupéré depuis le cache mémoire :", memoryCache.accessToken);
                return [2 /*return*/, { accessToken: memoryCache.accessToken }];
            }
            return [2 /*return*/, new Promise(function (resolve) {
                    chrome.storage.local.get(['accessToken'], function (result) {
                        console.log("AccessToken récupéré depuis chrome.storage :", result.accessToken);
                        resolve({ accessToken: result.accessToken || null });
                    });
                })];
        });
    });
}
// Supprime les tokens
function removeTokens() {
    chrome.storage.local.remove(["accessToken", "refreshToken"], function () {
        if (chrome.runtime.lastError) {
            console.error("Erreur lors de la suppression des tokens :", chrome.runtime.lastError.message);
        }
        else {
            console.log("Tokens supprimés de chrome.storage");
        }
    });
}
// Stocke l'heure de connexion
function setLoginTime() {
    var currentTime = Date.now();
    chrome.storage.local.set({ loginTime: currentTime }, function () {
        if (chrome.runtime.lastError) {
            console.error("Erreur lors de l'enregistrement de l'heure de connexion :", chrome.runtime.lastError.message);
        }
        else {
            console.log("Heure de connexion enregistrée :", currentTime);
        }
    });
}
function isTokenExpired() {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, loginTime, currentTime, elapsedTime, tokenLifetime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTokens()];
                case 1:
                    accessToken = (_a.sent()).accessToken;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            chrome.storage.local.get(['loginTime'], function (result) {
                                resolve({ loginTime: result.loginTime || null });
                            });
                        })];
                case 2:
                    loginTime = (_a.sent()).loginTime;
                    if (!accessToken || !loginTime) {
                        return [2 /*return*/, true]; // Pas de token ou pas d'heure de connexion
                    }
                    currentTime = Date.now();
                    elapsedTime = currentTime - loginTime;
                    tokenLifetime = 3600000;
                    return [2 /*return*/, elapsedTime > tokenLifetime];
            }
        });
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
/* harmony import */ var _utils_blockAdultSites__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/blockAdultSites */ "./src/utils/blockAdultSites.ts");
/* harmony import */ var _services_AuthService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/AuthService */ "./src/services/AuthService.ts");



var API_URL = 'https://usearlyapi.fly.dev/api/v1';
//const TWENTY_FIVE_HOURS_IN_MS = 20 * 1000; // 20 secondes pour le test
//const TWENTY_FIVE_HOURS_IN_MS = 24 * 60 * 60 * 1000;
/* chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && shouldBlockUrl(tab.url)) {
    console.log("Site bloqué : désactivation de l'extension.");
    chrome.action.disable(tabId); // Désactive l'icône de l'extension
  } else {
    chrome.action.enable(tabId); // Active l'icône de l'extension
  }
}); */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        if ((0,_utils_blockAdultSites__WEBPACK_IMPORTED_MODULE_1__.shouldBlockUrl)(tab.url)) {
            // Envoie un message au content script pour afficher le popup
            // Injecte le content script pour flouter les médias
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["contentScript.js"], // Assurez-vous que le fichier est compilé en JS
            });
            // Ferme l'onglet après un délai de 3 secondes
            /* setTimeout(() => {
                chrome.tabs.remove(tabId, () => {
                    console.log(`Onglet fermé pour contenu inapproprié : ${tab.url}`);
                });
            }, 10000);  */ // Délai de 3 secondes avant la fermeture
        }
    }
});
// Temps avant déconnexion automatique (en ms)
var AUTO_LOGOUT_TIME = 24 * 60 * 60 * 1000; // 24h
var CHECK_INTERVAL = 5000; // Vérifie toutes les 5 secondes
// Fonction pour déconnecter automatiquement l'utilisateur
function handleAutoLogout() {
    console.log("Déconnexion automatique en cours...");
    (0,_services_AuthService__WEBPACK_IMPORTED_MODULE_2__.logout)();
    // Notification de déconnexion
    chrome.notifications.create({
        type: "basic",
        iconUrl: "/assets/icons/logout-icon.png",
        title: "Déconnexion",
        message: "Vous avez été automatiquement déconnecté.",
    });
    // Envoi d'un message aux scripts de contenu pour gérer l'interface utilisateur
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { type: "USER_LOGGED_OUT" });
            }
        });
    });
}
// Vérifie périodiquement si l'utilisateur doit être déconnecté
setInterval(function () {
    chrome.storage.local.get(["loginTime"], function (result) {
        var loginTime = result.loginTime;
        if (loginTime) {
            var elapsedTime = Date.now() - loginTime;
            console.log("Temps \u00E9coul\u00E9 : ".concat(elapsedTime / 1000, " secondes"));
            if (elapsedTime >= AUTO_LOGOUT_TIME) {
                handleAutoLogout();
            }
        }
        else {
            console.log("Aucune donnée de connexion trouvée.");
        }
    });
}, CHECK_INTERVAL);
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
                    if (data.accessToken) {
                        (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.setTokens)(data.accessToken);
                        chrome.storage.local.set({ loginTime: Date.now() }); // Enregistre l'heure de connexion
                        console.log("Connexion réussie. Tokens stockés.");
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
        case "USER_LOGGED_OUT":
            handleAutoLogout(); // Appelle la fonction de déconnexion
            sendResponse({ success: true });
            return false;
        case "isAuthenticated":
            console.log("Vérification de l'authentification de l'utilisateur.");
            (0,_utils_storageUtil__WEBPACK_IMPORTED_MODULE_0__.getTokens)().then(function (tokens) {
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
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map