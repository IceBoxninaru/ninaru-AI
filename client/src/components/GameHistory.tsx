import React from 'react';
import './GameHistory.css';

interface GameAction {
  type: 'PLAY_CARD' | 'END_TURN' | 'WEATHER_CHANGE' | 'STATUS_EFFECT';
  timestamp: number;
  details: any;
}

interface GameHistoryProps {
  history: GameAction[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  const formatAction = (action: GameAction) => {
    switch (action.type) {
      case 'PLAY_CARD':
        return `${action.details.playerName}が${action.details.cardName}を${action.details.targetName}に使用しました。`;
      case 'END_TURN':
        return `${action.details.playerName}がターンを終了しました。`;
      case 'WEATHER_CHANGE':
        return `天候が${action.details.newWeather}に変化しました。`;
      case 'STATUS_EFFECT':
        return `${action.details.targetName}に${action.details.effectName}の効果が発生しました。`;
      default:
        return '不明なアクション';
    }
  };

  return (
    <div className="game-history">
      <h3>ゲーム履歴</h3>
      <div className="history-list">
        {history.map((action, index) => (
          <div key={index} className="history-item">
            <span className="timestamp">
              {new Date(action.timestamp).toLocaleTimeString()}
            </span>
            <span className="action-text">{formatAction(action)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory; 