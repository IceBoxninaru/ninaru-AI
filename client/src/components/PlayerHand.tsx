import React from 'react';
import { ICardData } from '../../../shared/types/game';
import './PlayerHand.css';

interface PlayerHandProps {
  hand: ICardData[];
  onCardSelect: (cardIndex: number, targetId?: string) => void;
  isCurrentTurn: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  onCardSelect,
  isCurrentTurn
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (!isCurrentTurn) return;
    
    if (selectedIndex === index) {
      onCardSelect(index);
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="player-hand">
      {hand.map((card, index) => (
        <div
          key={card.id}
          className={`card ${selectedIndex === index ? 'selected' : ''} ${!isCurrentTurn ? 'disabled' : ''}`}
          onClick={() => handleCardClick(index)}
        >
          <div className="card-header">
            <span className="card-name">{card.name}</span>
            <span className="card-cost">MP: {card.mpCost}</span>
          </div>
          <div className="card-type">{card.type}</div>
          <div className="card-element">{card.element}</div>
          <div className="card-description">{card.description}</div>
          {card.power && <div className="card-power">威力: {card.power}</div>}
          {card.shield && <div className="card-shield">防御: {card.shield}</div>}
          {card.effects && (
            <div className="card-effects">
              効果: {card.effects.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerHand; 