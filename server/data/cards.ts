import { Card, ElementType, CardType, StatusEffect, CardRarity } from '../../shared/types/game';
import { v4 as uuidv4 } from 'uuid';
import { ICardData, CardKind, ElementKind, StatusEffectType } from '../../shared/types/game';

interface CardTemplate {
  name: string;
  type: CardType;
  element?: ElementType;
  power?: number;
  shield?: number;
  mpCost?: number;
  effects?: StatusEffect[];
  description: string;
  rarity: CardRarity;
}

const RARITY_WEIGHTS = {
  COMMON: 0.4,    // 40%
  UNCOMMON: 0.3,  // 30%
  RARE: 0.2,      // 20%
  LEGENDARY: 0.1  // 10%
};

const cardTemplates: CardTemplate[] = [
  // コモンカード (40%)
  {
    name: '斬撃',
    type: 'ATTACK',
    power: 100,
    mpCost: 20,
    description: '基本的な斬撃攻撃',
    rarity: 'COMMON'
  },
  {
    name: '火球',
    type: 'MAGIC',
    element: 'FIRE',
    power: 120,
    mpCost: 30,
    effects: ['BURN'],
    description: '炎の球を放つ',
    rarity: 'COMMON'
  },
  {
    name: '水弾',
    type: 'MAGIC',
    element: 'WATER',
    power: 110,
    mpCost: 25,
    effects: ['FREEZE'],
    description: '水の弾を放つ',
    rarity: 'COMMON'
  },
  {
    name: '防御態勢',
    type: 'DEFENSE',
    shield: 80,
    mpCost: 15,
    description: '基本的な防御姿勢',
    rarity: 'COMMON'
  },
  {
    name: '土の壁',
    type: 'DEFENSE',
    element: 'EARTH',
    shield: 100,
    mpCost: 25,
    description: '土の壁を召喚',
    rarity: 'COMMON'
  },

  // アンコモンカード (30%)
  {
    name: '雷撃',
    type: 'MAGIC',
    element: 'WIND',
    power: 150,
    mpCost: 35,
    effects: ['STUN'],
    description: '雷を落とす',
    rarity: 'UNCOMMON'
  },
  {
    name: '光の矢',
    type: 'MAGIC',
    element: 'LIGHT',
    power: 140,
    mpCost: 35,
    description: '光の矢を放つ',
    rarity: 'UNCOMMON'
  },
  {
    name: '闇の波動',
    type: 'MAGIC',
    element: 'DARK',
    power: 140,
    mpCost: 35,
    effects: ['POISON'],
    description: '闇の波動を放つ',
    rarity: 'UNCOMMON'
  },
  {
    name: '強化防御',
    type: 'DEFENSE',
    shield: 150,
    mpCost: 30,
    effects: ['SHIELD'],
    description: '強化された防御態勢',
    rarity: 'UNCOMMON'
  },

  // レアカード (20%)
  {
    name: '神聖なる加護',
    type: 'SUPPORT',
    element: 'LIGHT',
    mpCost: 45,
    effects: ['REGEN', 'SHIELD'],
    description: '味方を回復し、防御力を上げる',
    rarity: 'RARE'
  },
  {
    name: '魔王の咆哮',
    type: 'MAGIC',
    element: 'DARK',
    power: 200,
    mpCost: 50,
    effects: ['POISON', 'STUN'],
    description: '強力な闇の力で攻撃',
    rarity: 'RARE'
  },
  {
    name: '炎龍撃',
    type: 'MAGIC',
    element: 'FIRE',
    power: 220,
    mpCost: 55,
    effects: ['BURN'],
    description: '炎の龍を召喚して攻撃',
    rarity: 'RARE'
  },

  // レジェンダリーカード (10%)
  {
    name: '究極の裁き',
    type: 'SPECIAL',
    element: 'LIGHT',
    power: 300,
    mpCost: 70,
    effects: ['SHIELD', 'REGEN'],
    description: '強力な光の力で攻撃し、自身を守る',
    rarity: 'LEGENDARY'
  },
  {
    name: '混沌の渦',
    type: 'SPECIAL',
    element: 'DARK',
    power: 350,
    mpCost: 80,
    effects: ['POISON', 'STUN', 'BURN'],
    description: '全ての負の効果を付与する強力な攻撃',
    rarity: 'LEGENDARY'
  },
  {
    name: '四元素の力',
    type: 'SPECIAL',
    power: 400,
    mpCost: 100,
    description: '四元素の力を集結させた究極の一撃',
    rarity: 'LEGENDARY'
  }
];

const CARD_TEMPLATES: Partial<ICardData>[] = [
  // 攻撃カード
  {
    type: 'ATTACK',
    element: 'FIRE',
    name: '炎の剣',
    cost: 2,
    power: 3,
    description: '炎属性の攻撃を行う'
  },
  {
    type: 'ATTACK',
    element: 'WATER',
    name: '水流斬',
    cost: 2,
    power: 2,
    effects: ['FREEZE'],
    description: '水属性の攻撃を行い、対象を凍結させる可能性がある'
  },
  {
    type: 'ATTACK',
    element: 'EARTH',
    name: '大地の拳',
    cost: 3,
    power: 4,
    description: '地属性の強力な攻撃を行う'
  },
  {
    type: 'ATTACK',
    element: 'WIND',
    name: '疾風刃',
    cost: 1,
    power: 2,
    description: '風属性の素早い攻撃を行う'
  },
  
  // 魔法カード
  {
    type: 'MAGIC',
    element: 'FIRE',
    name: '炎の波動',
    cost: 3,
    effects: ['BURN'],
    description: '対象に炎上効果を付与する'
  },
  {
    type: 'MAGIC',
    element: 'WATER',
    name: '氷の結界',
    cost: 3,
    effects: ['FREEZE'],
    description: '対象を凍結させる'
  },
  
  // 防御カード
  {
    type: 'DEFENSE',
    element: 'EARTH',
    name: '岩壁の盾',
    cost: 2,
    shield: 3,
    description: '防御力を上昇させる'
  },
  {
    type: 'DEFENSE',
    element: 'LIGHT',
    name: '神聖なる加護',
    cost: 2,
    shield: 2,
    effects: ['SHIELD'],
    description: '防御力を上昇させ、防御効果を付与する'
  },
  
  // サポートカード
  {
    type: 'SUPPORT',
    element: 'LIGHT',
    name: '祝福',
    cost: 2,
    effects: ['STRENGTHEN'],
    description: '味方を強化する'
  },
  {
    type: 'SUPPORT',
    element: 'DARK',
    name: '呪縛',
    cost: 2,
    effects: ['WEAKEN'],
    description: '敵を弱体化させる'
  }
];

export const generateRandomCard = (): ICardData => {
  const template = CARD_TEMPLATES[Math.floor(Math.random() * CARD_TEMPLATES.length)];
  return {
    id: uuidv4(),
    name: template.name || '',
    type: template.type as CardKind,
    element: template.element as ElementKind,
    cost: template.cost || 0,
    power: template.power,
    shield: template.shield,
    effects: template.effects || [],
    description: template.description || ''
  };
};

export const generateInitialDeck = (): ICardData[] => {
  const deck: ICardData[] = [];
  for (let i = 0; i < 30; i++) {  // 30枚のデッキを生成
    deck.push(generateRandomCard());
  }
  return deck;
};

// カードデータベースの一部（実際は800枚）
export const cards: Card[] = [
  // 攻撃カード
  {
    id: 'atk_001',
    name: '呪いの一撃',
    type: 'ATTACK',
    power: 100,
    element: 'DARK',
    mpCost: 20,
    description: '呪いの力で敵を攻撃する',
    rarity: 'COMMON'
  },
  {
    id: 'atk_002',
    name: '神聖なる裁き',
    type: 'ATTACK',
    power: 120,
    element: 'LIGHT',
    mpCost: 25,
    description: '神聖な力で敵を浄化する',
    rarity: 'UNCOMMON'
  },
  {
    id: 'atk_003',
    name: '雷鳴の槍',
    type: 'ATTACK',
    power: 150,
    element: 'WIND',
    mpCost: 30,
    description: '全ての敵に雷ダメージを与える',
    rarity: 'RARE'
  },
  {
    id: 'atk_004',
    name: '炎の剣',
    type: 'ATTACK',
    power: 130,
    element: 'FIRE',
    mpCost: 25,
    description: '敵に炎ダメージを与え、炎上効果を付与する',
    rarity: 'UNCOMMON'
  },
  {
    id: 'atk_005',
    name: '氷の矢',
    type: 'ATTACK',
    power: 110,
    element: 'WATER',
    mpCost: 20,
    description: '敵に氷ダメージを与え、凍結効果を付与する',
    rarity: 'COMMON'
  },

  // 防御カード
  {
    id: 'def_001',
    name: '呪いの盾',
    type: 'DEFENSE',
    shield: 50,
    element: 'DARK',
    mpCost: 15,
    description: '呪いの力で自身を守る',
    rarity: 'COMMON'
  },
  {
    id: 'def_002',
    name: '神聖バリア',
    type: 'DEFENSE',
    shield: 70,
    element: 'LIGHT',
    mpCost: 20,
    description: '神聖な力で味方を守る',
    rarity: 'UNCOMMON'
  },
  {
    id: 'def_003',
    name: '氷の壁',
    type: 'DEFENSE',
    shield: 90,
    element: 'WATER',
    mpCost: 25,
    description: '氷の壁で防御し、凍結効果を得る',
    rarity: 'UNCOMMON'
  },

  // 確率防御カード
  {
    id: 'cdef_001',
    name: '運命の盾',
    type: 'DEFENSE',
    shield: 100,
    mpCost: 15,
    description: '70%の確率で大きな防御力を得る',
    rarity: 'RARE'
  },
  {
    id: 'cdef_002',
    name: '神秘の障壁',
    type: 'DEFENSE',
    shield: 150,
    mpCost: 20,
    description: '50%の確率で非常に強力な防御力を得る',
    rarity: 'RARE'
  },

  // 魔法カード
  {
    id: 'mag_001',
    name: '呪いの嵐',
    type: 'MAGIC',
    power: 80,
    element: 'DARK',
    mpCost: 40,
    description: '全ての敵に呪いダメージを与える',
    rarity: 'UNCOMMON'
  },
  {
    id: 'mag_002',
    name: '神聖なる浄化',
    type: 'MAGIC',
    power: 0,
    shield: 100,
    element: 'LIGHT',
    mpCost: 30,
    description: '味方を回復し、浄化効果を付与する',
    rarity: 'RARE'
  },
  {
    id: 'mag_003',
    name: '毒の霧',
    type: 'MAGIC',
    power: 60,
    element: 'DARK',
    mpCost: 35,
    description: '全ての敵に毒ダメージを与え、毒効果を付与する',
    rarity: 'UNCOMMON'
  },

  // サポートカード
  {
    id: 'fld_001',
    name: '呪いの大地',
    type: 'SUPPORT',
    element: 'DARK',
    description: 'フィールドを呪いの力で満たす',
    rarity: 'RARE'
  },
  {
    id: 'fld_002',
    name: '神聖なる領域',
    type: 'SUPPORT',
    element: 'LIGHT',
    description: 'フィールドを神聖な力で満たす',
    rarity: 'RARE'
  },

  // 特殊カード
  {
    id: 'spc_001',
    name: '運命の賭け',
    type: 'SPECIAL',
    description: '10-100ゴールドを賭けて運試しができる',
    rarity: 'LEGENDARY'
  }
];

// デッキテンプレート
export const defaultDeck = cards.filter(card => 
  ['ATTACK', 'DEFENSE', 'MAGIC'].includes(card.type)
).slice(0, 40);

// チーム戦用デッキ
export const teamDeck = cards.filter(card => 
  card.type === 'SUPPORT' || card.type === 'SPECIAL'
).slice(0, 40);

// 属性別デッキ
export const elementalDecks: Record<ElementType, Card[]> = {
  FIRE: cards.filter(card => card.element === 'FIRE').slice(0, 40),
  WATER: cards.filter(card => card.element === 'WATER').slice(0, 40),
  EARTH: cards.filter(card => card.element === 'EARTH').slice(0, 40),
  WIND: cards.filter(card => card.element === 'WIND').slice(0, 40),
  LIGHT: cards.filter(card => card.element === 'LIGHT').slice(0, 40),
  DARK: cards.filter(card => card.element === 'DARK').slice(0, 40),
  NEUTRAL: cards.filter(card => !card.element).slice(0, 40)
}; 