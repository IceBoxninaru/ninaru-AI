import { v4 as uuidv4 } from 'uuid';
import {
  ICardData,
  ElementKind,
  CardKind,
  CardRarity,
  StatusEffectType
} from '../../shared/types/game';

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
    type: CardKind.ATTACK,
    element: ElementKind.FIRE,
    rarity: CardRarity.COMMON,
    mpCost: 2,
    power: 15,
    comboValue: 1
  },
  {
    name: '水流弾',
    description: '高圧の水弾を放つ',
    type: CardKind.ATTACK,
    element: ElementKind.WATER,
    rarity: CardRarity.COMMON,
    mpCost: 2,
    power: 12,
    effects: [StatusEffectType.FREEZE]
  },
  {
    name: '大地の槌',
    description: '大地の力を込めた一撃',
    type: CardKind.ATTACK,
    element: ElementKind.EARTH,
    rarity: CardRarity.COMMON,
    mpCost: 3,
    power: 18
  },
  {
    name: '風刃',
    description: '鋭い風の刃を放つ',
    type: CardKind.ATTACK,
    element: ElementKind.WIND,
    rarity: CardRarity.COMMON,
    mpCost: 1,
    power: 8,
    comboValue: 2
  },
  // 防御カード
  {
    name: '光の盾',
    description: '光の力で身を守る',
    type: CardKind.DEFENSE,
    element: ElementKind.LIGHT,
    rarity: CardRarity.COMMON,
    mpCost: 2,
    shield: 15,
    effects: [StatusEffectType.SHIELD]
  },
  {
    name: '闇の霧',
    description: '闇の力で攻撃を回避する',
    type: CardKind.DEFENSE,
    element: ElementKind.DARK,
    rarity: CardRarity.COMMON,
    mpCost: 2,
    shield: 10,
    effects: [StatusEffectType.SHIELD, StatusEffectType.POISON]
  },
  // サポートカード
  {
    name: '癒しの光',
    description: 'HPを回復する',
    type: CardKind.SUPPORT,
    element: ElementKind.LIGHT,
    rarity: CardRarity.UNCOMMON,
    mpCost: 3,
    faithCost: 1,
    effects: [StatusEffectType.REGENERATION]
  },
  {
    name: '加護の祈り',
    description: '信仰の力で味方を強化する',
    type: CardKind.SUPPORT,
    element: ElementKind.NEUTRAL,
    rarity: CardRarity.RARE,
    mpCost: 4,
    faithCost: 2,
    effects: [StatusEffectType.SHIELD, StatusEffectType.REGENERATION]
  }
];

// レアリティごとのカード枚数
export const DECK_COMPOSITION = {
  [CardRarity.COMMON]: 15,
  [CardRarity.UNCOMMON]: 10,
  [CardRarity.RARE]: 4,
  [CardRarity.LEGENDARY]: 1
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
