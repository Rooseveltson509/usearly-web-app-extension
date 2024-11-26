import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import DraggableFloatingMenu from '../components/DraggableFloatingMenu';

const ExtensionContent: React.FC = () => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

  useEffect(() => {
    console.log('Je suis le shadowHostRef ...')
    if (shadowHostRef.current && !shadowRoot) {
      const newShadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });

      const styleElem = document.createElement('style');
      fetch(chrome.runtime.getURL('dist/contentStyles.css'))
        .then((response) => response.text())
        .then((css) => {
          styleElem.textContent = css;
          newShadowRoot.appendChild(styleElem);
        });

      setShadowRoot(newShadowRoot);
    }
  }, [shadowRoot]);

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
