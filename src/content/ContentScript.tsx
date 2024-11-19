import React from 'react';
import ReactDOM from 'react-dom/client';
import CaptureFeedbackFlow from '../components/captureFeedbackFlow/CaptureFeedbackFlow';
import html2canvas from 'html2canvas';
import DraggableFloatingMenu from '../components/DraggableFloatingMenu';

let clickCount = 0;
let startX = 0;
let startY = 0;
let selectionBox: HTMLDivElement | null = null;
let lensBubble: HTMLDivElement | null = null;
let selectionEnabled = false; // Indicateur pour activer la sélection après le deuxième clic
let menuOpen = false;
let centeredText: HTMLDivElement | null = null;

// Élément bulle avec icône pour le mode capture
let captureBubble: HTMLDivElement | null = null;
// Activer le mode Google Lens avec la bulle (premier clic)
function enableLensMode() {
  console.log("Enable Lens Mode called");
  createLensBubble(); // Afficher la bulle avec l'icône de caméra
  createCenteredText(); // Affiche le texte centré

  // Suivre le curseur avec la bulle sans activer la sélection
  document.addEventListener('mousemove', moveLensBubble);

  // Préparer pour un clic dans la bulle pour démarrer la sélection
  document.addEventListener('click', initiateSelection, { once: true });
}



function createCenteredText() {
  if (!centeredText) {
    centeredText = document.createElement("div");
    centeredText.style.position = "fixed";
    centeredText.style.top = "20px"; // Positionné en haut de la page
    centeredText.style.left = "50%"; // Centré horizontalement
    centeredText.style.transform = "translateX(-50%)"; // Correction pour centrer
    centeredText.style.padding = "10px 20px";
    centeredText.style.backgroundColor = "#333";
    centeredText.style.color = "#fff";
    centeredText.style.borderRadius = "20px";
    centeredText.style.fontSize = "16px";
    centeredText.style.fontWeight = "bold";
    centeredText.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    centeredText.style.zIndex = "10002";
    centeredText.style.pointerEvents = "none"; // Empêche les interactions
    centeredText.textContent = "Sélectionnez la zone du problème"; // Texte à afficher
    document.body.appendChild(centeredText);
  }
}

function removeCenteredText() {
  if (centeredText) {
    centeredText.remove();
    centeredText = null;
  }
}




// Créer et afficher la bulle avec la caméra pour suivre la souris
function createLensBubble() {
  if (!captureBubble) {
    captureBubble = document.createElement("div");
    captureBubble.style.position = "absolute";
    captureBubble.style.width = "50px";
    captureBubble.style.height = "50px";
    captureBubble.style.backgroundColor = "#F0F4FF";
    captureBubble.style.borderRadius = "50%";
    captureBubble.style.display = "flex";
    captureBubble.style.alignItems = "center";
    captureBubble.style.justifyContent = "center";
    captureBubble.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    captureBubble.style.cursor = "pointer";
    captureBubble.style.zIndex = "10001";
    captureBubble.style.pointerEvents = "none"; // Empêche l'interaction avec la bulle

    // Icône d'appareil photo dans la bulle
    const cameraIcon = document.createElement("span");
    cameraIcon.style.fontSize = "24px";
    cameraIcon.textContent = "📷"; // Emoji d'appareil photo
    captureBubble.appendChild(cameraIcon);

    document.body.appendChild(captureBubble);
    // Suivre le mouvement de la souris pour placer la bulle
    document.addEventListener("mousemove", updateCaptureBubblePosition);

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
function startSelection(event: MouseEvent) {
  if (!selectionEnabled) return;

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


// Fonction pour ouvrir le flux de feedback avec la sélection d'émoji
function openFeedbackWithEmojiSelection(screenshot: string) {
  const feedbackContainer = document.createElement('div');
  feedbackContainer.style.position = 'fixed';
  feedbackContainer.style.top = '0';
  feedbackContainer.style.left = '0';
  feedbackContainer.style.width = '100vw';
  feedbackContainer.style.height = '100vh';
  feedbackContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  feedbackContainer.style.zIndex = '9999';

  document.body.appendChild(feedbackContainer);

  const closeFeedback = () => {
    document.body.removeChild(feedbackContainer);
  };

  // Créer une racine React pour le flux de feedback avec sélection d'émoji
  const root = ReactDOM.createRoot(feedbackContainer);
  root.render(<CaptureFeedbackFlow screenshot={screenshot} onClose={closeFeedback} />);
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
            openFeedbackWithEmojiSelection(compressedDataUrl); // Appeler le formulaire de feedback
          })
          .catch((error) => {
            console.error('Erreur lors de la compression de l\'image:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la capture de la zone sélectionnée:', error);
    });
}


/* function captureSelectedArea(x: number, y: number, width: number, height: number) {
  const externalElements = document.querySelectorAll('img, iframe, video, [style*="background-image"]');

  // Masquer temporairement les éléments externes
  externalElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      //el.style.display = 'none';
    }
  });
  // Capture la page entière avec html2canvas
  html2canvas(document.body, { useCORS: true, allowTaint: false, backgroundColor: null }).then((canvas) => {
    // Rendre les éléments visibles après la capture
    externalElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        //el.style.display = '';
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
        x,              // Position X ajustée
        y,              // Position Y ajustée
        width,          // Largeur ajustée
        height,         // Hauteur ajustée
        0,              // Position X dans le canvas de destination
        0,              // Position Y dans le canvas de destination
        width,          // Largeur dans le canvas de destination
        height          // Hauteur dans le canvas de destination
      );

      const croppedDataUrl = croppedCanvas.toDataURL('image/png');
      openFeedbackWithEmojiSelection(croppedDataUrl); // Affiche l'image capturée dans le formulaire de feedback
    }
  }).catch((error) => {
    console.error('Erreur lors de la capture de la zone sélectionnée:', error);
  });
} */



// Désactiver le mode sélection et réinitialiser les indicateurs
function disableSelectionMode() {
  selectionEnabled = false; // Désactiver la sélection
  document.body.classList.remove('cursor-crosshair'); // Désactiver la croix
  if (captureBubble) {
    removeCaptureBubble();
    //document.body.removeChild(lensBubble);
    //lensBubble = null;
  }
  removeCenteredText(); // Supprime le texte
  document.removeEventListener('mousemove', moveLensBubble);
}

// Fonction pour afficher le flux de feedback avec sélection d'émoji et formulaire
function openFeedbackForm(screenshot: string) {
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
  root.render(<CaptureFeedbackFlow screenshot={screenshot} onClose={closeFeedback} />);
}

// Affichage du menu flottant après trois clics
function displayFloatingMenu(x: number, y: number) {
  menuOpen = true;

  const menuContainer = document.createElement('div');
  document.body.appendChild(menuContainer);

  const closeMenu = () => {
    console.log("close menu...")
    document.body.removeChild(menuContainer);
    menuOpen = false;
  };

  const root = ReactDOM.createRoot(menuContainer);
  root.render(
    <DraggableFloatingMenu
      x={x}
      y={y}
      onCommentClick={() => {
        closeMenu();
        openFeedbackForm('');
      } }
      onCaptureClick={() => {
        closeMenu();
        enableLensMode(); // Activer le mode Google Lens avec la bulle
      } } />
  );
}


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