import React from 'react'
import { Card as CardType } from '../../../shared/types/game'

interface HandAreaProps {
  cards: CardType[]
  onPlayCard: (index: number, targetId?: string) => void
  disabled?: boolean
}

export const HandArea: React.FC<HandAreaProps> = ({ cards, onPlayCard, disabled = false }) => {
  return (
    <div className="hand-area">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onPlayCard(index)}
        >
          <div className="card-name">{card.name}</div>
          <div className="card-type">{card.type}</div>
          {card.mpCost !== undefined && (
            <div className="card-cost">MP: {card.mpCost}</div>
          )}
          {card.power !== undefined && (
            <div className="card-power">Power: {card.power}</div>
          )}
          {card.shield !== undefined && (
            <div className="card-shield">Shield: {card.shield}</div>
          )}
          {card.element && (
            <div className="card-element">Element: {card.element}</div>
          )}
          {card.description && (
            <div className="card-description">{card.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default HandArea