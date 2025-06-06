import React from 'react';
import { IPlayer, IGameState } from '../../../shared/types/game.js';
import './GameBoard.css';

export interface GameBoardProps {
  gameState: IGameState;
  currentPlayerId: string;
  onPlayCard: (cardIndex: number, targetId: string) => void;
  onEndTurn: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPlayerId,
  onPlayCard,
  onEndTurn
}) => {
  const { players, weather, currentTurn } = gameState;
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isCurrentPlayerTurn = currentPlayerId === gameState.currentPlayerId;

  const handleCardClick = (cardIndex: number) => {
    if (!isCurrentPlayerTurn || !currentPlayer) return;
    const card = currentPlayer.hand[cardIndex];
    if (!card || currentPlayer.mp < card.mpCost) return;

    const opponent = players.find(p => p.id !== currentPlayerId);
    if (opponent) {
      onPlayCard(cardIndex, opponent.id);
    }
  };

  return (
    <div className="game-board">
      <div className="game-info">
        <div>ターン: {currentTurn}</div>
        <div>天候: {weather.type} ({weather.duration})</div>
      </div>

      <div className="weather-effects" data-testid="weather-effects">
        {weather.type === 'SUNNY' && <div>火属性: 1.2x</div>}
        {weather.type === 'RAINY' && <div>水属性: 1.2x</div>}
        {weather.type === 'WINDY' && <div>風属性: 1.2x</div>}
      </div>

      <div className="players">
        {players.map(player => (
          <div
            key={player.id}
            className={`player ${player.id === currentPlayerId ? 'current' : ''}`}
          >
            <div className="player-name">{player.name}</div>
            <div className="player-stats">
              <div>HP: {player.hp}/{player.maxHp}</div>
              <div>MP: {player.mp}/{player.maxMp}</div>
              <div>信仰: {player.faith}</div>
              <div>コンボ: {player.combo}</div>
            </div>
            {player.statusEffects.length > 0 && (
              <div className="status-effects" data-testid="status-effects">
                {player.statusEffects.map((effect, index) => (
                  <div key={index} className="status-effect">
                    {effect.type === 'BURN' && '火傷'}
                    {effect.type === 'POISON' && '毒'}
                    {effect.type === 'FREEZE' && '凍結'}
                    {effect.type === 'STUN' && '麻痺'}
                    {effect.type === 'SHIELD' && '防御'}
                    ({effect.duration})
                  </div>
                ))}
              </div>
            )}
            {player.id === currentPlayerId && (
              <div className="hand">
                {player.hand.map((card, index) => (
                  <div
                    key={card.id}
                    className={`card ${player.mp < card.mpCost ? 'disabled' : ''}`}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="card-name">{card.name}</div>
                    <div className="card-cost">MP: {card.mpCost}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="end-turn-button"
        onClick={onEndTurn}
        disabled={!isCurrentPlayerTurn}
      >
        ターン終了
      </button>
    </div>
  );
};

 