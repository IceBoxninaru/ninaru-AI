import React from 'react';
import { ICardData } from '../../../shared/types/game.js';
import './CardDetail.css';

interface CardDetailProps {
  card: ICardData;
  onClose: () => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({ card, onClose }) => {
  return (
    <div className="card-detail-overlay" onClick={onClose}>
      <div className="card-detail" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="card-name">{card.name}</h2>
        <div className="card-type">{card.type} - {card.element}</div>
        <div className="card-rarity">{card.rarity}</div>
        <div className="card-description">{card.description}</div>
        <div className="card-stats">
          <div>MP消費: {card.mpCost}</div>
          {card.power && <div>威力: {card.power}</div>}
          {card.shield && <div>防御: {card.shield}</div>}
          {card.faithCost && <div>信仰値消費: {card.faithCost}</div>}
          {card.comboValue && <div>コンボ値: {card.comboValue}</div>}
        </div>
        {card.effects && card.effects.length > 0 && (
          <div className="card-effects">
            <h3>効果:</h3>
            <ul>
              {card.effects.map(effect => (
                <li key={effect}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 