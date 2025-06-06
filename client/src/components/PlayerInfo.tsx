import React from 'react';
import { IPlayerData, StatusEffectType } from '../../../shared/types/game.js';
import { STATUS_EFFECT_CONFIG } from '../../../server/schema/weather.js';
import '../styles/PlayerInfo.css';

interface PlayerInfoProps {
  player: IPlayerData;
  isOpponent: boolean;
  isTargetable: boolean;
  onSelect?: (playerId: string) => void;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  isOpponent,
  isTargetable,
  onSelect
}) => {
  const playerClassNames = [
    'player-info',
    isOpponent && 'player-info--opponent',
    isTargetable && 'player-info--targetable'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={playerClassNames}
      onClick={() => isTargetable && onSelect && onSelect(player.id)}
    >
      <div className="player-info__header">
        <span className="player-info__name">{player.name}</span>
        <span className="player-info__faith">信仰: {player.faith}</span>
      </div>

      <div className="player-info__stats">
        <div className="player-info__stat">
          <span className="player-info__stat-label">HP:</span>
          <div className="player-info__stat-bar">
            <div
              className="player-info__stat-bar-fill player-info__stat-bar-fill--hp"
              style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
            />
            <span className="player-info__stat-value">{player.hp}/{player.maxHp}</span>
          </div>
        </div>

        <div className="player-info__stat">
          <span className="player-info__stat-label">MP:</span>
          <div className="player-info__stat-bar">
            <div
              className="player-info__stat-bar-fill player-info__stat-bar-fill--mp"
              style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
            />
            <span className="player-info__stat-value">{player.mp}/{player.maxMp}</span>
          </div>
        </div>

        <div className="player-info__stat">
          <span className="player-info__stat-label">コンボ:</span>
          <span className="player-info__stat-value">{player.combo}/{player.maxCombo}</span>
        </div>
      </div>

      <div className="player-info__status-effects">
        {Array.from(player.status.entries()).map(([effect, duration]) => (
          <div
            key={effect}
            className="player-info__status-effect"
            title={`${STATUS_EFFECT_CONFIG[effect].name}: 残り${duration}ターン\n${STATUS_EFFECT_CONFIG[effect].description}`}
          >
            {STATUS_EFFECT_CONFIG[effect].icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerInfo; 