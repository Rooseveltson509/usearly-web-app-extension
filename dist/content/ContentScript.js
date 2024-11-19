import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import FloatingMenu from '../components/FloatingMenu';
import FeedbackForm from '../components/FeedbackForm';
var clickCount = 0;
var startX = 0;
var startY = 0;
var selectionBox = null;
var menuOpen = false;
// Fonction pour démarrer la capture de la zone de sélection
function startSelection(event) {
    startX = event.clientX;
    startY = event.clientY;
    selectionBox = document.createElement('div');
    selectionBox.style.position = 'fixed';
    selectionBox.style.border = '2px dashed #007bff';
    selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
    selectionBox.style.top = "".concat(startY, "px");
    selectionBox.style.left = "".concat(startX, "px");
    selectionBox.style.zIndex = '9999';
    document.body.appendChild(selectionBox);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}
function handleMouseMove(event) {
    if (!selectionBox)
        return;
    var width = event.clientX - startX;
    var height = event.clientY - startY;
    selectionBox.style.width = "".concat(Math.abs(width), "px");
    selectionBox.style.height = "".concat(Math.abs(height), "px");
    selectionBox.style.left = "".concat(width < 0 ? event.clientX : startX, "px");
    selectionBox.style.top = "".concat(height < 0 ? event.clientY : startY, "px");
}
function handleMouseUp() {
    if (!selectionBox)
        return;
    var rect = selectionBox.getBoundingClientRect();
    captureVisibleTab(rect.left, rect.top, rect.width, rect.height);
    document.body.removeChild(selectionBox);
    selectionBox = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}
// Capture de l’onglet visible et recadrage
function captureVisibleTab(x, y, width, height) {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
        if (chrome.runtime.lastError) {
            console.error("Erreur lors de la capture de l'onglet:", chrome.runtime.lastError);
            return;
        }
        if (dataUrl) {
            cropScreenshot(dataUrl, x, y, width, height);
        }
    });
}
// Fonction de recadrage de la capture
function cropScreenshot(dataUrl, x, y, width, height) {
    var image = new Image();
    image.src = dataUrl;
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
            var croppedDataUrl = canvas.toDataURL('image/png');
            openFeedbackForm(croppedDataUrl); // Passe la capture d’écran recadrée au formulaire de feedback
        }
    };
}
// Fonction pour afficher le formulaire de feedback avec l'image capturée
function openFeedbackForm(screenshot) {
    var feedbackContainer = document.createElement('div');
    document.body.appendChild(feedbackContainer);
    var closeFeedback = function () {
        document.body.removeChild(feedbackContainer);
    };
    var root = ReactDOM.createRoot(feedbackContainer);
    root.render(_jsx(FeedbackForm, { screenshot: screenshot, onClose: closeFeedback }));
}
// Détection des trois clics pour afficher le menu flottant
function handleClick(event) {
    if (menuOpen)
        return;
    clickCount++;
    if (clickCount === 3) {
        displayFloatingMenu(event.clientX, event.clientY);
        clickCount = 0;
    }
    setTimeout(function () { return (clickCount = 0); }, 1000);
}
// Affichage du menu flottant après trois clics
function displayFloatingMenu(x, y) {
    menuOpen = true;
    var menuContainer = document.createElement('div');
    document.body.appendChild(menuContainer);
    var closeMenu = function () {
        document.body.removeChild(menuContainer);
        menuOpen = false;
    };
    var root = ReactDOM.createRoot(menuContainer);
    root.render(_jsx(FloatingMenu, { x: x, y: y, onCommentClick: function () {
            closeMenu();
            openFeedbackForm(''); // Placeholder sans capture si aucun aperçu n'est disponible
        }, onCaptureClick: function () {
            closeMenu();
            startSelection(new MouseEvent('mousedown', { clientX: x, clientY: y }));
        } }));
}
// Écouteurs d'événements pour les clics
window.addEventListener('click', handleClick);
