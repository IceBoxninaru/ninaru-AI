import React from 'react'
import { ICardData, ElementKind, CardKind, StatusEffectType } from '../../../shared/types/game'
import { STATUS_EFFECT_CONFIG } from '../../../server/schema/weather'
import '../styles/Card.css'

interface ICardProps {
  card: ICardData
  isPlayable: boolean
  isSelected: boolean
  onClick?: () => void
  index?: number
}

const ELEMENT_ICONS: Record<ElementKind, string> = {
  FIRE: '🔥',
  WATER: '💧',
  EARTH: '🌍',
  WIND: '🌪️',
  LIGHT: '✨',
  DARK: '🌑',
  NEUTRAL: '⚪'
}

const CARD_TYPE_ICONS: Record<CardKind, string> = {
  ATTACK: '⚔️',
  DEFENSE: '🛡️',
  MAGIC: '🔮',
  SUPPORT: '💫',
  SPECIAL: '⭐'
}

const RARITY_COLORS = {
  COMMON: '#B8B8B8',
  UNCOMMON: '#4CAF50',
  RARE: '#2196F3',
  LEGENDARY: '#FFC107'
}

export const Card: React.FC<ICardProps> = ({ card, isPlayable, isSelected, onClick, index = 0 }) => {
  const elementIcon = card.element ? ELEMENT_ICONS[card.element] : ''
  const typeIcon = CARD_TYPE_ICONS[card.type]
  const rarityColor = RARITY_COLORS[card.rarity]

  const cardClassNames = [
    'card',
    `card--${card.type.toLowerCase()}`,
    `card--${card.element.toLowerCase()}`,
    isPlayable && 'card--playable',
    isSelected && 'card--selected'
  ].filter(Boolean).join(' ')

  const renderEffects = (effects: StatusEffectType[]) => {
    return effects.map((effect, index) => (
      <div key={index} className="card__effect" title={STATUS_EFFECT_CONFIG[effect].description}>
        {STATUS_EFFECT_CONFIG[effect].icon}
        {STATUS_EFFECT_CONFIG[effect].name}
      </div>
    ))
  }

  return (
    <div
      className={cardClassNames}
      onClick={isPlayable ? onClick : undefined}
      style={{ borderColor: rarityColor }}
    >
      <div className="card__header">
        <span className="card__name">{card.name}</span>
        <span className="card__cost">{card.mpCost || 0}MP</span>
      </div>
      <div className="card__type">
        {typeIcon} {elementIcon}
      </div>
      <div className="card__image">
        {/* カードイラストがある場合はここに表示 */}
      </div>
      <div className="card__stats">
        {card.power && <div className="card__power">攻撃力: {card.power}</div>}
        {card.shield && <div className="card__shield">防御力: {card.shield}</div>}
      </div>
      <div className="card__description">{card.description}</div>
      {card.effects && (
        <div className="card__effects">
          {renderEffects(card.effects)}
        </div>
      )}
    </div>
  )
}

export default Card