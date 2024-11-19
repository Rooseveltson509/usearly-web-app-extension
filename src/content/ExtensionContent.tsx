import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import DraggableFloatingMenu from '../components/DraggableFloatingMenu';

const ExtensionContent: React.FC = () => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

  // Initialisation du shadow DOM
  useEffect(() => {
    if (shadowHostRef.current && !shadowRoot) {
      const newShadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });

      // Ajout de la feuille de style
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', chrome.runtime.getURL('dist/contentStyles.css'));
      newShadowRoot.appendChild(linkElem);

      setShadowRoot(newShadowRoot); // Mettre à jour le shadow root
    }
  }, [shadowRoot]);

  // Retourner le portail seulement si le shadow root est défini
  return shadowRoot ? (
    ReactDOM.createPortal(
      <DraggableFloatingMenu
        x={100}
        y={100}
        onCommentClick={() => console.log('Comment clicked')}
        onCaptureClick={() => console.log('Capture clicked')}
      />,
      shadowRoot
    )
  ) : (
    <div ref={shadowHostRef} style={{ position: 'fixed', top: '10px', right: '10px' }} />
  );
};

export default ExtensionContent;