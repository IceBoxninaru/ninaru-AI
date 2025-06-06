import { v4 as uuidv4 } from 'uuid';
import { ICardData, ElementKind, CardType, CardRarity, StatusEffectType } from '../../shared/types/game.js';

interface CardTemplate {
  name: string;
  description: string;
  type: CardType;
  element: ElementKind;
  rarity: CardRarity;
  mpCost: number;
  power?: number;
  shield?: number;
  faithCost?: number;
  comboValue?: number;
  effects?: StatusEffectType[];
}

export const BASIC_CARDS: CardTemplate[] = [
  // 攻撃カード
  {
    name: '炎の剣',
    description: '炎の力を纏った一撃を放つ',
    type: CardType.ATTACK,
    element: ElementKind.FIRE,
    mpCost: 2,
    power: 15,
    comboValue: 1,
    rarity: CardRarity.COMMON
  },
  {
    name: '水流弾',
    description: '高圧の水弾を放つ',
    type: CardType.ATTACK,
    element: ElementKind.WATER,
    mpCost: 2,
    power: 12,
    effects: [StatusEffectType.FREEZE],
    rarity: CardRarity.COMMON
  },
  {
    name: '風刃',
    description: '鋭い風の刃を放つ',
    type: CardType.ATTACK,
    element: ElementKind.WIND,
    mpCost: 1,
    power: 8,
    comboValue: 2,
    rarity: CardRarity.COMMON
  },
  // 防御カード
  {
    name: '光の盾',
    description: '光の力で身を守る',
    type: CardType.DEFENSE,
    element: ElementKind.LIGHT,
    mpCost: 2,
    shield: 15,
    effects: [StatusEffectType.SHIELD],
    rarity: CardRarity.COMMON
  },
  {
    name: '闇の霧',
    description: '闇の力で攻撃を回避する',
    type: CardType.DEFENSE,
    element: ElementKind.DARK,
    mpCost: 2,
    shield: 10,
    effects: [StatusEffectType.SHIELD, StatusEffectType.POISON],
    rarity: CardRarity.COMMON
  },
  // サポートカード
  {
    name: '癒しの光',
    description: 'HPを回復する',
    type: CardType.SUPPORT,
    element: ElementKind.LIGHT,
    mpCost: 3,
    faithCost: 1,
    effects: [StatusEffectType.REGENERATION],
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '加護の祈り',
    description: '信仰の力で味方を強化する',
    type: CardType.SUPPORT,
    element: ElementKind.NEUTRAL,
    mpCost: 4,
    faithCost: 2,
    effects: [StatusEffectType.SHIELD, StatusEffectType.REGENERATION],
    rarity: CardRarity.RARE
  }
];

// レアリティごとのカード枚数
export const DECK_COMPOSITION = {
  [CardRarity.COMMON]: 20,
  [CardRarity.UNCOMMON]: 7,
  [CardRarity.RARE]: 3
};

export function generateInitialDeck(): ICardData[] {
  const deck: ICardData[] = [];
  const DECK_SIZE = 30;

  // レアリティごとにカードを追加
  Object.entries(DECK_COMPOSITION).forEach(([rarity, count]) => {
    const cardsOfRarity = BASIC_CARDS.filter(card => card.rarity === rarity);
    if (cardsOfRarity.length > 0) {
      for (let i = 0; i < count; i++) {
        const template = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
        deck.push({
          ...template,
          id: uuidv4(),
          isPlayable: true
        });
      }
    }
  });

  // デッキをシャッフル
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function drawInitialHand(deck: ICardData[]): ICardData[] {
  const hand: ICardData[] = [];
  const INITIAL_HAND_SIZE = 5;

  for (let i = 0; i < INITIAL_HAND_SIZE && deck.length > 0; i++) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    hand.push(deck[cardIndex]);
    deck.splice(cardIndex, 1);
  }

  return hand;
} 