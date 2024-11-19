// DraggableMenu.tsx
import React, { useState } from 'react';

interface DraggableMenuProps {
  onClose?: () => void;
}

const DraggableMenu: React.FC<DraggableMenuProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'move',
        zIndex: 10000,
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Draggable Menu</span>
        {onClose && (
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            ✖️
          </button>
        )}
      </div>
      <div style={{ marginTop: '10px' }}>
        {/* Ajoutez ici le contenu du menu */}
        <button style={{ margin: '5px' }}>Option 1</button>
        <button style={{ margin: '5px' }}>Option 2</button>
      </div>
    </div>
  );
};

export default DraggableMenu;
