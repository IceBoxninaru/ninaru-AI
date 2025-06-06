import React, { useState, useEffect } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler.js';
import './ErrorAnalytics.css';

interface ErrorAnalyticsProps {
  onClose: () => void;
}

const ErrorAnalytics: React.FC<ErrorAnalyticsProps> = ({ onClose }) => {
  const { getErrorAnalytics, exportErrorLogs } = useErrorHandler('ErrorAnalytics');
  const [analytics, setAnalytics] = useState(getErrorAnalytics());

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getErrorAnalytics());
    }, 5000);

    return () => clearInterval(interval);
  }, [getErrorAnalytics]);

  const handleExport = () => {
    const logs = exportErrorLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="error-analytics">
      <div className="error-analytics-header">
        <h2>エラー分析</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="error-analytics-content">
        <div className="error-summary">
          <h3>概要</h3>
          <p>総エラー数: {analytics.totalErrors}</p>
          <div className="error-types">
            <h4>エラータイプ別集計:</h4>
            {Object.entries(analytics.errorsByType).map(([type, count]) => (
              <div key={type} className={`error-type ${type.toLowerCase()}`}>
                <span className="type-name">{type}</span>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="frequent-errors">
          <h3>頻出エラー</h3>
          <ul>
            {analytics.mostFrequentErrors.map((error, index) => (
              <li key={index}>
                <span className="error-message">{error.message}</span>
                <span className="error-count">({error.count}回)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-errors">
          <h3>最近のエラー</h3>
          <ul>
            {analytics.recentErrors.map((error, index) => (
              <li key={index} className={`error-item ${error.type.toLowerCase()}`}>
                <div className="error-time">
                  {new Date(error.timestamp).toLocaleString()}
                </div>
                <div className="error-details">
                  <div className="error-message">{error.message}</div>
                  {error.context && (
                    <div className="error-context">
                      {error.context.component && (
                        <span>コンポーネント: {error.context.component}</span>
                      )}
                      {error.context.action && (
                        <span>アクション: {error.context.action}</span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="error-actions">
          <button className="export-button" onClick={handleExport}>
            エラーログをエクスポート
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAnalytics; 