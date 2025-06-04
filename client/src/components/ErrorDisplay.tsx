import React from 'react';
import { ErrorTemplate } from '../types/error';
import { ErrorMessageManager } from '../utils/errorMessageManager';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  key?: number;
  errorKey: string;
  context?: {
    component?: string;
    action?: string;
    data?: any;
  };
  timestamp: number;
  onClose: (timestamp: number) => void;
}

const ErrorDisplay = ({
  errorKey,
  context,
  timestamp,
  onClose
}: ErrorDisplayProps): React.ReactElement => {
  const errorManager = ErrorMessageManager.getInstance();
  const template = errorManager.getErrorTemplate(errorKey, context);
  const styles = errorManager.getSeverityStyle(template.severity);

  return (
    <div 
      className="error-display"
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor
      }}
    >
      <div className="error-header">
        <span className="error-code" style={{ color: styles.color }}>
          {template.code}
        </span>
        <h3 className="error-title" style={{ color: styles.color }}>
          {template.message.ja}
        </h3>
        <button 
          className="close-button"
          onClick={() => onClose(timestamp)}
          style={{ color: styles.color }}
        >
          ✕
        </button>
      </div>

      <div className="error-content">
        <p className="error-message" style={{ color: styles.color }}>
          {template.message.ja}
        </p>
        {(context?.component || context?.action) && (
          <p className="error-context" style={{ color: styles.color }}>
            発生箇所: {context.component || '不明'} ({context.action || '不明'})
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay; 