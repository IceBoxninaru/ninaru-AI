import React, { useEffect } from 'react';
import './GameMessage.css';

interface GameMessageProps {
  message: string;
  type: 'error' | 'info' | 'success';
  onClose: () => void;
  duration?: number;
}

export const GameMessage: React.FC<GameMessageProps> = ({
  message,
  type,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div className={`game-message ${type}`}>
      <div className="message-content">
        {message}
      </div>
      <button className="close-button" onClick={onClose}>
        ×
      </button>
    </div>
  );
}; 