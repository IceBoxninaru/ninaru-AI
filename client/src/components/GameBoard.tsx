import React from 'react';
import { IPlayer } from '../../../shared/types/game';
import './GameBoard.css';

interface GameBoardProps {
  players: IPlayer[];
  currentPlayerId: string;
  onPlayerSelect: (targetId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentPlayerId,
  onPlayerSelect
}) => {
  return (
    <div className="game-board">
      {players.map(player => (
        <div
          key={player.id}
          className={`player ${player.id === currentPlayerId ? 'current' : ''}`}
          onClick={() => onPlayerSelect(player.id)}
        >
          <div className="player-name">{player.name}</div>
          <div className="player-stats">
            <div>HP: {player.hp}/{player.maxHp}</div>
            <div>MP: {player.mp}/{player.maxMp}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 