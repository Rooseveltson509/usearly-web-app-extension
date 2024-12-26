import React from 'react';
import ReactDOM from 'react-dom/client';
import CaptureFeedbackFlow from '../components/captureFeedbackFlow/CaptureFeedbackFlow';
import html2canvas from 'html2canvas';
import DraggableFloatingMenu from '../components/DraggableFloatingMenu';
import { shouldBlockUrl } from "../utils/blockAdultSites";
import Warning from '../components/warning/Warning';
import { blurAllInappropriateMedia } from '../utils/blurAllInappropriateMedia';
import { unblurAllMedia } from '../utils/unblurAllMedia';
//import { handleAction } from '../components/handleAction';


let clickCount = 0;
let startX = 0;
let startY = 0;
let selectionBox: HTMLDivElement | null = null;
let lensBubble: HTMLDivElement | null = null;
let selectionEnabled = false; // Indicateur pour activer la sélection après le deuxième clic
let menuOpen = false;
let centeredText: HTMLDivElement | null = null;
let overlay: HTMLDivElement | null = null;

// Élément bulle avec icône pour le mode capture
let captureBubble: HTMLDivElement | null = null;
// Activer le mode Google Lens avec la bulle (premier clic)
// Mode de sélection activé
export function enableLensMode(onCaptureComplete?: (screenshot: string) => void): void {
  createLensBubble();
  createCenteredText();
  createOverlay();

  document.addEventListener('mousemove', updateCaptureBubblePosition);
  document.addEventListener('click', initiateSelection, { once: true });
}

function createCenteredText():void {
  if (!centeredText) {
    centeredText = document.createElement("div");
    centeredText.style.position = "fixed";
    centeredText.style.top = "100px"; // Positionné en haut de la page
    centeredText.style.left = "50%"; // Centré horizontalement
    centeredText.style.transform = "translateX(-50%)"; // Correction pour centrer
    centeredText.style.padding = "10px 20px";
    centeredText.style.backgroundColor = "rgba(5, 10, 21, 0.79)";
    centeredText.style.color = "#fff";
    centeredText.style.borderRadius = "53px";
    centeredText.style.fontSize = "16px";
    //centeredText.style.fontWeight = "400";
    centeredText.style.boxShadow = "0px 0px 37.7px 0px rgba(0, 0, 0, 0.25)";
    centeredText.style.zIndex = "10002";
    centeredText.style.pointerEvents = "none"; // Empêche les interactions
    // Contenu avec icône SVG
    centeredText.innerHTML = `
    <div class="d-flex">
    <div class="app-photo">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1 5V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H5M1 13V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H5M13 1H15C15.5304 1 16.0391 1.21071 16.4142 1.58579C16.7893 1.96086 17 2.46957 17 3V5M13 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V13M6 9C6 9.79565 6.31607 10.5587 6.87868 11.1213C7.44129 11.6839 8.20435 12 9 12C9.79565 12 10.5587 11.6839 11.1213 11.1213C11.6839 10.5587 12 9.79565 12 9C12 8.20435 11.6839 7.44129 11.1213 6.87868C10.5587 6.31607 9.79565 6 9 6C8.20435 6 7.44129 6.31607 6.87868 6.87868C6.31607 7.44129 6 8.20435 6 9Z" stroke="white" stroke-opacity="0.8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
        <span class="txt-problem">Sélectionnez la zone du problème</span>
    </div>
      `;

    document.body.appendChild(centeredText);
  }
}

function removeCenteredText(): void {
  if (centeredText) {
    centeredText.remove();
    centeredText = null;
  }
}

function createOverlay(): void {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.zIndex = '10000';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);
  }
}

function removeOverlay(): void {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}


// Créer et afficher la bulle avec la caméra pour suivre la souris
function createLensBubble(): void {
  if (!captureBubble) {
    captureBubble = document.createElement("div");
    captureBubble.className = "capture-bubble"; // Classe CSS pour appliquer le style principal

    // Ajouter le SVG directement dans la bulle
    captureBubble.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="61" height="62" viewBox="0 0 61 62" fill="none">
          <g filter="url(#filter0_d_397_1906)">
          <path d="M30 7C42.1503 7 52 16.8497 52 29L52 29.5C52 41.3741 42.3741 51 30.5 51C18.6259 51 9 41.3741 9 29.5L9 7L30 7Z" fill="url(#paint0_linear_397_1906)"/>
          <path d="M30 8C41.598 8 51 17.402 51 29L51 29.5C51 40.8218 41.8218 50 30.5 50C19.1782 50 10 40.8218 10 29.5L10 8L30 8Z" stroke="white" stroke-width="2"/>
          </g>
          <path d="M34 21L36 21C36.5304 21 37.0391 21.2107 37.4142 21.5858C37.7893 21.9609 38 22.4696 38 23L38 25M26 21L24 21C23.4696 21 22.9609 21.2107 22.5858 21.5858C22.2107 21.9609 22 22.4696 22 23L22 25M38 33L38 35C38 35.5304 37.7893 36.0391 37.4142 36.4142C37.0391 36.7893 36.5304 37 36 37L34 37M22 33L22 35C22 35.5304 22.2107 36.0391 22.5858 36.4142C22.9609 36.7893 23.4696 37 24 37L26 37M30 26C29.2044 26 28.4413 26.3161 27.8787 26.8787C27.3161 27.4413 27 28.2044 27 29C27 29.7956 27.3161 30.5587 27.8787 31.1213C28.4413 31.6839 29.2044 32 30 32C30.7956 32 31.5587 31.6839 32.1213 31.1213C32.6839 30.5587 33 29.7956 33 29C33 28.2044 32.6839 27.4413 32.1213 26.8787C31.5587 26.3161 30.7956 26 30 26Z" stroke="white" stroke-opacity="0.8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <g filter="url(#filter1_d_397_1906)">
          <path d="M30 7C42.1503 7 52 16.8497 52 29L52 29.5C52 41.3741 42.3741 51 30.5 51V51C18.6259 51 9 41.3741 9 29.5L9 9C9 7.89543 9.89543 7 11 7L30 7Z" fill="url(#paint1_linear_397_1906)"/>
          <path d="M51 29L51 29.5C51 40.8218 41.8218 50 30.5 50C19.1782 50 10 40.8218 10 29.5L10 9C10 8.44771 10.4477 8 11 8L30 8C41.598 8 51 17.402 51 29Z" stroke="white" stroke-width="2"/>
          </g>
          <path d="M32.4831 21H36.6628V31.8122C36.6628 33.0618 36.3554 34.1504 35.7405 35.078C35.1257 36.0002 34.2683 36.715 33.1684 37.2224C32.0685 37.7244 30.7909 37.9754 29.3356 37.9754C27.8634 37.9754 26.5774 37.7244 25.4774 37.2224C24.3775 36.715 23.523 36.0002 22.9138 35.078C22.3046 34.1504 22 33.0618 22 31.8122V21H26.1882V31.4603C26.1882 32.0387 26.3179 32.5543 26.5774 33.0072C26.8425 33.4601 27.2119 33.8148 27.6857 34.0713C28.1595 34.3277 28.7095 34.4559 29.3356 34.4559C29.9617 34.4559 30.5089 34.3277 30.977 34.0713C31.4508 33.8148 31.8203 33.4601 32.0854 33.0072C32.3505 32.5543 32.4831 32.0387 32.4831 31.4603V21Z" fill="white"/>
          <path d="M40.8002 38C40.191 38 39.6692 37.7926 39.2349 37.3779C38.8062 36.9632 38.5947 36.4612 38.6003 35.8719C38.5947 35.2935 38.8062 34.7997 39.2349 34.3905C39.6692 33.9758 40.191 33.7684 40.8002 33.7684C41.3755 33.7684 41.8832 33.9758 42.3231 34.3905C42.7687 34.7997 42.9944 35.2935 43 35.8719C42.9944 36.2648 42.8872 36.6222 42.6785 36.9441C42.4754 37.2661 42.2075 37.5225 41.8747 37.7135C41.5475 37.9045 41.1894 38 40.8002 38Z" fill="white"/>
          <defs>
          <filter id="filter0_d_397_1906" x="0.8" y="0.8" width="59.4" height="60.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="4.1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_397_1906"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_397_1906" result="shape"/>
          </filter>
          <filter id="filter1_d_397_1906" x="0.8" y="0.8" width="59.4" height="60.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="4.1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_397_1906"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_397_1906" result="shape"/>
          </filter>
          <linearGradient id="paint0_linear_397_1906" x1="9" y1="-0.652177" x2="53.2784" y2="57.3575" gradientUnits="userSpaceOnUse">
          <stop stop-color="#5A13A5"/>
          <stop offset="1" stop-color="#FE2190"/>
          </linearGradient>
          <linearGradient id="paint1_linear_397_1906" x1="9" y1="-0.652177" x2="53.2784" y2="57.3575" gradientUnits="userSpaceOnUse">
          <stop stop-color="#5A13A5"/>
          <stop offset="1" stop-color="#FE2190"/>
          </linearGradient>
          </defs>
</svg>
    `;

    document.body.appendChild(captureBubble);
    document.addEventListener("mousemove", updateCaptureBubblePosition); // Suivre le mouvement de la souris
  }
}




// Mettre à jour la position de la bulle de capture pour suivre la souris
function updateCaptureBubblePosition(event: MouseEvent) {
  if (captureBubble) {
    // Place la bulle un peu en dessous de la souris pour qu'elle ne la cache pas
    captureBubble.style.left = `${event.pageX + 15}px`;
    captureBubble.style.top = `${event.pageY + 15}px`;
  }
}

// Fonction pour enlever la bulle de capture et arrêter de suivre la souris
function removeCaptureBubble() {
  if (captureBubble) {
    captureBubble.remove();
    captureBubble = null;
  }
  document.removeEventListener("mousemove", updateCaptureBubblePosition);
}


// Faire bouger la bulle avec la souris
function moveLensBubble(event: MouseEvent) {
  if (lensBubble) {
    lensBubble.style.left = `${event.clientX - 25}px`;
    lensBubble.style.top = `${event.clientY - 25}px`;
  }
}

// Préparer la sélection (désactiver la bulle et activer la sélection après le deuxième clic)
function initiateSelection(event: MouseEvent) {
  startX = event.clientX;
  startY = event.clientY;
  createLensBubble();
  // Désactiver la bulle et arrêter le suivi de la souris
  /*   if (lensBubble) {
      document.body.removeChild(lensBubble);
      lensBubble = null;
    }
    document.removeEventListener('mousemove', moveLensBubble); */

  // Activer la sélection
  selectionEnabled = true;
  document.body.classList.add('cursor-crosshair'); // Activer la croix

  // Attendre un clic pour démarrer la sélection
  document.addEventListener('mousedown', startSelection, { once: true });
}

// Démarrer la sélection après le deuxième clic
/**
 * Initiates the selection process for capturing a screen area.
 * This function creates a selection box and sets up event listeners for resizing and finalizing the selection.
 * 
 * @param event - The MouseEvent that triggered the selection start.
 * @returns void
 */
function startSelection(event: MouseEvent): void {
  if (!selectionEnabled) return;
  removeOverlay(); // Supprime l'overlay semi-transparent
  console.log('Vous êtes en train de sélectionner une zone à capturer...'); //
  startX = event.clientX;
  startY = event.clientY;

  // Créer la boîte de sélection
  selectionBox = document.createElement('div');
  selectionBox.style.position = 'fixed';
  selectionBox.style.border = '2px dashed #007bff';
  selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.zIndex = '9999';
  document.body.appendChild(selectionBox);

  // Activer le redimensionnement de la sélection
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp, { once: true });
}

// Redimensionner la zone de sélection avec la souris
function handleMouseMove(event: MouseEvent) {
  if (!selectionBox) return;

  const width = event.clientX - startX;
  const height = event.clientY - startY;
  selectionBox.style.width = `${Math.abs(width)}px`;
  selectionBox.style.height = `${Math.abs(height)}px`;

  selectionBox.style.left = `${width < 0 ? event.clientX : startX}px`;
  selectionBox.style.top = `${height < 0 ? event.clientY : startY}px`;
}

// Terminer la sélection et capturer
function handleMouseUp() {
  if (!selectionBox) return;

  // Obtenir les dimensions exactes de la zone sélectionnée avec getBoundingClientRect
  const rect = selectionBox.getBoundingClientRect();

  // Appliquer le ratio de mise à l'échelle
  const scale = window.devicePixelRatio;
  const adjustedX = (rect.left + window.scrollX) * scale;
  const adjustedY = (rect.top + window.scrollY) * scale;
  const adjustedWidth = rect.width * scale;
  const adjustedHeight = rect.height * scale;

  // Supprimer la boîte de sélection temporaire
  document.body.removeChild(selectionBox);
  selectionBox = null;

  // Capture de la zone ajustée
  captureSelectedArea(adjustedX, adjustedY, adjustedWidth, adjustedHeight);

  disableSelectionMode(); // Désactiver le mode de sélection
}

  export function openFeedbackWithEmojiSelection(
    screenshot: string | null,
    action: string,
    extraData?: {
      initialFormData?: {
        alertDescription: string;
        sentiment: string;
        tips: string;
        isBlocked: "yes" | "no";
        screenshot: string | null;
      };
      initialStep?: "emoji" | "form" | "capture";
    },
    initialStep?: "emoji" | "form" | "capture", // initialStep est inclus ici
  ): void {
    const feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'feedback-container';
    feedbackContainer.style.position = 'fixed';
    feedbackContainer.style.top = '0';
    feedbackContainer.style.left = '0';
    feedbackContainer.style.width = '100vw';
    feedbackContainer.style.height = '100vh';
    feedbackContainer.style.zIndex = '10004';
    document.body.appendChild(feedbackContainer);
  
    const closeFeedback = (): void => {
      feedbackContainer.remove();
    };
  
    const root = ReactDOM.createRoot(feedbackContainer);
    root.render(
      <CaptureFeedbackFlow
        screenshot={screenshot}
        action={action}
        onClose={closeFeedback}
        onCaptureClick={(formData, selectedAction) => {
          closeFeedback();
          enableLensMode();
        }}
        selectedAction={action}
        initialFormData={extraData?.initialFormData || {
          alertDescription: '',
          sentiment: '😐',
          tips: '',
          isBlocked: 'no',
          screenshot: null,
        }}
        initialStep={initialStep || 'emoji'}  // Passer initialStep ici
      />
    );
  }

// Fonction pour redimensionner et compresser l'image
function resizeAndCompressImage(dataUrl: string, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calcul des nouvelles dimensions tout en respectant le ratio d'aspect
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en Data URL avec compression
      resolve(canvas.toDataURL('image/jpeg', quality)); // Qualité entre 0.0 et 1.0
    };
    img.src = dataUrl;
  });
}

// Méthode de capture mise à jour
function captureSelectedArea(x: number, y: number, width: number, height: number) {
  const externalElements = document.querySelectorAll('img, iframe, video, [style*="background-image"]');

  // Vérifier si la zone sélectionnée est trop petite ou inexistante
  if (width < 5 || height < 5) {
    console.log('Zone trop petite ou inexistante. Continuation sans capture.');
    openFeedbackWithEmojiSelection(null, 'capture'); // Appeler le formulaire sans capture
    return; // Arrêter l'exécution
  }

  // Masquer temporairement les éléments externes
  externalElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      // el.style.display = 'none'; // Désactivé dans cet exemple
    }
  });

  // Capture la page entière avec html2canvas
  html2canvas(document.body, { useCORS: true, allowTaint: false, backgroundColor: null })
    .then((canvas) => {
      // Rendre les éléments visibles après la capture
      externalElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          // el.style.display = ''; // Désactivé dans cet exemple
        }
      });

      // Créer un canvas temporaire pour recadrer la zone sélectionnée
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');

      if (croppedCtx) {
        // Utiliser les coordonnées ajustées en fonction de la mise à l'échelle
        croppedCtx.drawImage(
          canvas,
          x, // Position X ajustée
          y, // Position Y ajustée
          width, // Largeur ajustée
          height, // Hauteur ajustée
          0, // Position X dans le canvas de destination
          0, // Position Y dans le canvas de destination
          width, // Largeur dans le canvas de destination
          height // Hauteur dans le canvas de destination
        );

        const croppedDataUrl = croppedCanvas.toDataURL('image/png');

        // Redimensionner et compresser l'image capturée
        resizeAndCompressImage(croppedDataUrl, 800, 800, 0.7) // Dimensions max et qualité
          .then((compressedDataUrl) => {
            openFeedbackWithEmojiSelection(compressedDataUrl, 'capture'); // Appeler le formulaire de feedback
          })
          .catch((error) => {
            console.error('Erreur lors de la compression de l\'image:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la capture de la zone sélectionnée:', error);
      openFeedbackWithEmojiSelection(null, 'capture'); // Continuer même en cas d'erreur
    });
}


// Désactiver le mode sélection et réinitialiser les indicateurs
function disableSelectionMode() {
  selectionEnabled = false; // Désactiver la sélection
  document.body.classList.remove('cursor-crosshair'); // Désactiver la croix
  if (captureBubble) {
    removeCaptureBubble();
    //document.body.removeChild(lensBubble);
    //lensBubble = null;
  }
  removeOverlay(); // Supprime l'overlay semi-transparent
  removeCenteredText(); // Supprime le texte
  document.removeEventListener('mousemove', moveLensBubble);
}

// Fonction pour afficher le flux de feedback avec sélection d'émoji et formulaire
export function openFeedbackForm(screenshot: string, action: string) {
  // Créer un conteneur pour le feedback
  const feedbackContainer = document.createElement('div');
  feedbackContainer.style.position = 'fixed';
  feedbackContainer.style.top = '0';
  feedbackContainer.style.left = '0';
  feedbackContainer.style.width = '100vw';
  feedbackContainer.style.height = '100vh';
  feedbackContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  feedbackContainer.style.zIndex = '9999';

  document.body.appendChild(feedbackContainer);

  // Fonction pour fermer le formulaire de feedback et supprimer le conteneur
  const closeFeedback = () => {
    document.body.removeChild(feedbackContainer);
  };

  // Créer une racine React pour le formulaire de feedback
  const root = ReactDOM.createRoot(feedbackContainer);
  root.render(<CaptureFeedbackFlow action={action} screenshot={screenshot} onClose={closeFeedback} onCaptureClick={(formData, selectedAction) => {
    closeFeedback();
    enableLensMode();
    console.log('Action sélectionnée :', selectedAction);
  }} selectedAction={action} />);
}




// Affichage du menu flottant après trois clics
function displayFloatingMenu(x: number, y: number): void {
  const currentURL = window.location.href;

  // Vérifie si le site est bloqué
  if (shouldBlockUrl(currentURL)) {
    const containerId = "warning-container";
    console.log("Site inapproprié détecté, application du flou...");
    blurAllInappropriateMedia(); // Flouter les médias

    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }

    if (container) {
      const root = ReactDOM.createRoot(container);

      // Affiche le popup
      root.render(
        <Warning
          onClose={() => {
            root.unmount();
            container?.remove(); // Supprime le popup lorsqu'il est fermé
            unblurAllMedia(); // Déflouter les médias
          }}
          onLoginSuccess={() => {
            console.log("Action après connexion réussie");
          }}
        />
      );

      return; // Arrête l'exécution si le site est bloqué
    }
  }

  // Logique pour afficher le menu flottant si le site n'est pas bloqué
  if (menuOpen) {
    console.log("Le menu flottant est déjà ouvert !");
    return; // Si le menu est déjà ouvert, ne rien faire
  }
  menuOpen = true;

  const menuContainer = document.createElement('div');
  document.body.appendChild(menuContainer);

  const closeMenu = (): void => {
    console.log("Fermeture du menu...");
    document.body.removeChild(menuContainer);
    menuOpen = false;
  };

  const root = ReactDOM.createRoot(menuContainer);
  root.render(
    <DraggableFloatingMenu
      x={x}
      y={y}
      onActionClick={(action: string) => {
        if (action === 'capture') {
          closeMenu();
          enableLensMode((screenshot: string) => {
            openFeedbackWithEmojiSelection(screenshot, 'capture', {
              initialFormData: undefined,
              initialStep: 'emoji', // Inclus correctement ici
            });
          });
        } else if (action === 'cheart') {
          closeMenu();
          openFeedbackWithEmojiSelection(null, 'cheart', {
            initialFormData: undefined,
            initialStep: 'emoji', // Inclus correctement ici
          });
        } else if (action === 'suggestion') {
          closeMenu();
          openFeedbackForm('', 'suggestion');
/*           openFeedbackWithEmojiSelection(null, 'suggestion', {
            initialFormData: undefined,
            initialStep: 'form', // Inclus correctement ici
          }); */
        }
      }}

/*       onActionClick={(action) => handleAction(action, () => {
        if (action === 'cheart') {
          closeMenu();
          openFeedbackForm('', 'default');
        } else if (action === 'capture') {
          closeMenu();
          enableLensMode();
        } else if (action === 'signal') {
          console.log('Signalement action déclenchée');
        }
      })} */
    /*       onCommentClick={() => {
            closeMenu();
            openFeedbackForm('');
          }}
          onCaptureClick={() => {
            closeMenu();
            enableLensMode(); // Activer le mode Google Lens avec la bulle
          }} */
    />
  );
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showWarningPopup") {
    // Créer un conteneur pour afficher le popup
    const containerId = "warning-popup-container";
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }

    const root = ReactDOM.createRoot(container);

    // Afficher le popup d'avertissement
    root.render(
      <Warning
        onClose={() => {
          root.unmount();
          container?.remove(); // Supprime le popup du DOM
        }}
        onLoginSuccess={() => {
          console.log("Action après confirmation");
        }}
      />
    );

    sendResponse({ success: true });
  }
});


// Gestion du message envoyé par le background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message reçu dans content.js :", message);

  if (message.action === "showFloatingMenu") {
    console.log("Affichage du menu flottant...");
    displayFloatingMenu(window.innerWidth / 2, window.innerHeight / 2);
    sendResponse({ success: true });
  } else {
    console.log("Action non reconnue :", message.action);
    sendResponse({ success: false });
  }
});

// Détection des trois clics pour afficher le menu flottant
function handleClick(event: MouseEvent) {
  if (menuOpen) return;

  clickCount++;
  if (clickCount === 3) {
    displayFloatingMenu(event.clientX, event.clientY);
    clickCount = 0;

    // Ajoutez un listener pour détecter la fermeture du menu
    document.addEventListener('menuClosed', () => {
      menuOpen = false; // Permet de réouvrir le menu après fermeture
    });
  }

  // Remet à zéro `clickCount` après une seconde d'inactivité
  setTimeout(() => {
    clickCount = 0;
  }, 1000);
}

// Écouteur d'événements pour les clics
window.addEventListener('click', handleClick);


// Écoute les messages du background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "USER_LOGGED_OUT") {
    console.log("Déconnexion détectée côté contenu.");
    //alert("Vous avez été déconnecté automatiquement.");
  }

  sendResponse({ success: true });
});
