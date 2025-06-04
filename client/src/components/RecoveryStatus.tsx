import React from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import './RecoveryStatus.css';

interface RecoveryStatusProps {
  onClose: () => void;
}

const RecoveryStatus: React.FC<RecoveryStatusProps> = ({ onClose }) => {
  const { isRecovering, getRecoveryStats } = useErrorHandler('RecoveryStatus');
  const stats = getRecoveryStats();

  return (
    <div className="recovery-status">
      <div className="recovery-status-header">
        <h2>リカバリー状態</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="recovery-status-content">
        {isRecovering && (
          <div className="recovery-in-progress">
            <div className="spinner"></div>
            <p>エラーからの回復を試みています...</p>
          </div>
        )}

        <div className="recovery-stats">
          <div className="stat-item">
            <span className="stat-label">総試行回数:</span>
            <span className="stat-value">{stats.totalAttempts}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">成功回数:</span>
            <span className="stat-value">{stats.successfulRecoveries}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">成功率:</span>
            <span className="stat-value">
              {stats.recoveryRate.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="recovery-legend">
          <div className="legend-item">
            <span className="legend-color success"></span>
            <span className="legend-label">成功</span>
          </div>
          <div className="legend-item">
            <span className="legend-color failure"></span>
            <span className="legend-label">失敗</span>
          </div>
          <div className="legend-item">
            <span className="legend-color in-progress"></span>
            <span className="legend-label">実行中</span>
          </div>
        </div>

        <div className="recovery-chart">
          <div 
            className="success-bar"
            style={{ 
              width: `${stats.recoveryRate}%`,
              backgroundColor: 'var(--success-color)'
            }}
          />
          <div 
            className="failure-bar"
            style={{ 
              width: `${100 - stats.recoveryRate}%`,
              backgroundColor: 'var(--failure-color)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecoveryStatus; 