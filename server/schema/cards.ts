import { v4 as uuidv4 } from 'uuid';
import { ICardData, ElementKind, CardType, CardRarity, StatusEffectType } from '../../shared/types/game';

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

const CARD_TEMPLATES: CardTemplate[] = [
  // 攻撃カード
  {
    name: '炎の剣',
    description: '炎の力を纏った一撃を放つ',
    type: 'ATTACK',
    element: 'FIRE',
    rarity: 'COMMON',
    mpCost: 2,
    power: 15,
    comboValue: 1
  },
  {
    name: '水流弾',
    description: '高圧の水弾を放つ',
    type: 'ATTACK',
    element: 'WATER',
    rarity: 'COMMON',
    mpCost: 2,
    power: 12,
    effects: ['FREEZE']
  },
  {
    name: '大地の槌',
    description: '大地の力を込めた一撃',
    type: 'ATTACK',
    element: 'EARTH',
    rarity: 'COMMON',
    mpCost: 3,
    power: 18
  },
  {
    name: '風刃',
    description: '鋭い風の刃を放つ',
    type: 'ATTACK',
    element: 'WIND',
    rarity: 'COMMON',
    mpCost: 1,
    power: 8,
    comboValue: 2
  },
  // 防御カード
  {
    name: '光の盾',
    description: '光の力で身を守る',
    type: 'DEFENSE',
    element: 'LIGHT',
    rarity: 'COMMON',
    mpCost: 2,
    shield: 15,
    effects: ['SHIELD']
  },
  {
    name: '闇の霧',
    description: '闇の力で攻撃を回避する',
    type: 'DEFENSE',
    element: 'DARK',
    rarity: 'COMMON',
    mpCost: 2,
    shield: 10,
    effects: ['SHIELD', 'POISON']
  },
  // サポートカード
  {
    name: '癒しの光',
    description: 'HPを回復する',
    type: 'SUPPORT',
    element: 'LIGHT',
    rarity: 'UNCOMMON',
    mpCost: 3,
    faithCost: 1,
    effects: ['REGENERATION']
  },
  {
    name: '加護の祈り',
    description: '信仰の力で味方を強化する',
    type: 'SUPPORT',
    element: 'NEUTRAL',
    rarity: 'RARE',
    mpCost: 4,
    faithCost: 2,
    effects: ['SHIELD', 'REGENERATION']
  }
];

// レアリティごとのカード枚数
export const DECK_COMPOSITION = {
  COMMON: 15,
  UNCOMMON: 10,
  RARE: 4,
  LEGENDARY: 1
};

// 初期デッキ生成関数
export function generateInitialDeck(): ICardData[] {
  const deck: ICardData[] = [];
  
  // 各テンプレートから3枚ずつカードを生成
  CARD_TEMPLATES.forEach(template => {
    for (let i = 0; i < 3; i++) {
      deck.push({
        ...template,
        id: uuidv4()
      });
    }
  });

  // デッキをシャッフル
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
} 