import React from 'react';
import { IGameState, WeatherKind } from '../../../shared/types/game.js';
import { convertToGameInfo, WEATHER_CONFIG } from '../../../shared/utils/gameUtils.js';
import './GameInfo.css';

interface GameInfoProps {
  gameState: IGameState;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  const { currentTurn, currentPlayer, weather, phase } = convertToGameInfo(
    gameState.currentTurn,
    gameState.players.find(p => p.id === gameState.currentPlayerId) || null,
    gameState.weather,
    gameState.phase
  );

  const weatherInfo = WEATHER_CONFIG[gameState.weather.type as WeatherKind];

  return (
    <div className="game-info">
      <div className="game-info__section">
        <h3>ゲーム情報</h3>
        <div className="game-info__row">
          <span className="game-info__label">ターン:</span>
          <span className="game-info__value">{currentTurn}</span>
        </div>
        <div className="game-info__row">
          <span className="game-info__label">フェーズ:</span>
          <span className="game-info__value">{phase}</span>
        </div>
      </div>

      <div className="game-info__section">
        <h3>天候</h3>
        <div className="game-info__weather">
          <span className="game-info__weather-icon">{weatherInfo?.icon}</span>
          <span className="game-info__weather-name">{weatherInfo?.name}</span>
          <span className="game-info__weather-duration">（残り{gameState.weather.duration}ターン）</span>
        </div>
        <p className="game-info__weather-description">{weatherInfo?.description}</p>
      </div>

      {currentPlayer && (
        <div className="game-info__section">
          <h3>現在のプレイヤー</h3>
          <div className="game-info__player">
            <span className="game-info__player-name">{currentPlayer.name}</span>
            <div className="game-info__player-stats">
              <div className="game-info__stat">
                <span>HP: {currentPlayer.hp}/{currentPlayer.maxHp}</span>
              </div>
              <div className="game-info__stat">
                <span>MP: {currentPlayer.mp}/{currentPlayer.maxMp}</span>
              </div>
              <div className="game-info__stat">
                <span>コンボ: {currentPlayer.combo}/{currentPlayer.maxCombo}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameInfo; 