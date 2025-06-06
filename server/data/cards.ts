import * as uuid from 'uuid';
import {
  ICardData,
  ElementKind,
  CardType,
  CardRarity,
  StatusEffectType
} from '../../shared/types/game.js';

// ===== CARD TEMPLATES =====
// 統一されたカードテンプレート定義

interface CardTemplate {
  name: string;
  type: CardType;
  element?: ElementKind;
  mpCost: number;
  faithCost?: number;
  description: string;
  rarity: CardRarity;
  power?: number;
  shield?: number;
  effects?: StatusEffectType[];
  requirements?: {
    minCombo?: number;
    minFaith?: number;
  };
}

// レアリティ別の分布設定
export const RARITY_DISTRIBUTION = {
  [CardRarity.COMMON]: 0.5,      // 50%
  [CardRarity.UNCOMMON]: 0.3,    // 30%
  [CardRarity.RARE]: 0.15,       // 15%
  [CardRarity.EPIC]: 0.04,       // 4%
  [CardRarity.LEGENDARY]: 0.01   // 1%
};

// デッキ構成の設定（テスト対応）
export const DECK_COMPOSITION = {
  [CardRarity.COMMON]: 15,       // 50% (15/30)
  [CardRarity.UNCOMMON]: 8,      // 27% (8/30)
  [CardRarity.RARE]: 5,          // 17% (5/30)
  [CardRarity.EPIC]: 2,          // 6% (2/30)
  [CardRarity.LEGENDARY]: 0      // 0% (初期デッキには含めない)
};

// ===== CARD TEMPLATES DATABASE =====

const CARD_TEMPLATES: CardTemplate[] = [
  // ===== COMMON CARDS (50%) =====
  
  // 基本攻撃カード
  {
    name: '斬撃',
    type: CardType.ATTACK,
    mpCost: 15,
    power: 80,
    description: '基本的な物理攻撃',
    rarity: CardRarity.COMMON
  },
  {
    name: '炎の矢',
    type: CardType.ATTACK,
    element: ElementKind.FIRE,
    mpCost: 20,
    power: 90,
    description: '炎属性の遠距離攻撃',
    rarity: CardRarity.COMMON
  },
  {
    name: '水弾',
    type: CardType.ATTACK,
    element: ElementKind.WATER,
    mpCost: 18,
    power: 75,
    effects: [StatusEffectType.FREEZE],
    description: '水属性攻撃。対象を凍結させる可能性がある',
    rarity: CardRarity.COMMON
  },
  {
    name: '土の拳',
    type: CardType.ATTACK,
    element: ElementKind.EARTH,
    mpCost: 25,
    power: 110,
    description: '地属性の重い一撃',
    rarity: CardRarity.COMMON
  },
  {
    name: '風刃',
    type: CardType.ATTACK,
    element: ElementKind.WIND,
    mpCost: 12,
    power: 60,
    description: '風属性の素早い攻撃',
    rarity: CardRarity.COMMON
  },
  
  // 基本防御カード
  {
    name: '防御姿勢',
    type: CardType.DEFENSE,
    mpCost: 10,
    shield: 50,
    description: '基本的な防御',
    rarity: CardRarity.COMMON
  },
  {
    name: '光の盾',
    type: CardType.DEFENSE,
    element: ElementKind.LIGHT,
    mpCost: 15,
    shield: 70,
    description: '光属性の防御',
    rarity: CardRarity.COMMON
  },
  {
    name: '闇の霧',
    type: CardType.DEFENSE,
    element: ElementKind.DARK,
    mpCost: 12,
    shield: 45,
    effects: [StatusEffectType.POISON],
    description: '闇属性の防御。攻撃者に毒を付与する可能性がある',
    rarity: CardRarity.COMMON
  },
  
  // 基本魔法カード
  {
    name: '小癒し',
    type: CardType.MAGIC,
    element: ElementKind.LIGHT,
    mpCost: 20,
    effects: [StatusEffectType.REGENERATION],
    description: 'HPを少し回復する',
    rarity: CardRarity.COMMON
  },
  {
    name: '毒霧',
    type: CardType.MAGIC,
    element: ElementKind.DARK,
    mpCost: 25,
    effects: [StatusEffectType.POISON],
    description: '対象に毒を付与する',
    rarity: CardRarity.COMMON
  },

  // ===== UNCOMMON CARDS (30%) =====
  
  {
    name: '炎の剣',
    type: CardType.ATTACK,
    element: ElementKind.FIRE,
    mpCost: 30,
    power: 130,
    effects: [StatusEffectType.BURN],
    description: '炎属性攻撃。対象を炎上させる',
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '氷の槍',
    type: CardType.ATTACK,
    element: ElementKind.WATER,
    mpCost: 35,
    power: 120,
    effects: [StatusEffectType.FREEZE],
    description: '水属性攻撃。対象の行動を制限する',
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '雷撃',
    type: CardType.ATTACK,
    element: ElementKind.WIND,
    mpCost: 40,
    power: 150,
    effects: [StatusEffectType.STUN],
    description: '風属性攻撃。対象を麻痺させる',
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '光の矢',
    type: CardType.ATTACK,
    element: ElementKind.LIGHT,
    mpCost: 35,
    power: 140,
    description: '光属性の強力な遠距離攻撃',
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '闇の波動',
    type: CardType.ATTACK,
    element: ElementKind.DARK,
    mpCost: 38,
    power: 125,
    effects: [StatusEffectType.CURSE],
    description: '闇属性攻撃。対象の攻撃力を下げる',
    rarity: CardRarity.UNCOMMON
  },
  
  // 強化防御カード
  {
    name: '強化の盾',
    type: CardType.DEFENSE,
    mpCost: 25,
    shield: 100,
    effects: [StatusEffectType.SHIELD],
    description: '強力な防御とシールド効果',
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '神聖なる守り',
    type: CardType.DEFENSE,
    element: ElementKind.LIGHT,
    mpCost: 30,
    shield: 90,
    effects: [StatusEffectType.BLESS],
    description: '光属性防御。祝福効果を得る',
    rarity: CardRarity.UNCOMMON
  },
  
  // 中級魔法カード
  {
    name: '中癒し',
    type: CardType.MAGIC,
    element: ElementKind.LIGHT,
    mpCost: 35,
    effects: [StatusEffectType.REGENERATION],
    description: 'HPを中程度回復する',
    rarity: CardRarity.UNCOMMON
  },
  {
    name: '強化魔法',
    type: CardType.SUPPORT,
    mpCost: 30,
    effects: [StatusEffectType.RAGE],
    description: '自身の攻撃力を上昇させる',
    rarity: CardRarity.UNCOMMON
  },

  // ===== RARE CARDS (15%) =====
  
  {
    name: '炎龍の息吹',
    type: CardType.ATTACK,
    element: ElementKind.FIRE,
    mpCost: 50,
    power: 200,
    effects: [StatusEffectType.BURN],
    description: '強力な炎属性攻撃。高確率で炎上付与',
    rarity: CardRarity.RARE
  },
  {
    name: '氷河の刃',
    type: CardType.ATTACK,
    element: ElementKind.WATER,
    mpCost: 55,
    power: 180,
    effects: [StatusEffectType.FREEZE, StatusEffectType.STUN],
    description: '氷属性攻撃。凍結と麻痺を付与',
    rarity: CardRarity.RARE
  },
  {
    name: '神聖なる裁き',
    type: CardType.ATTACK,
    element: ElementKind.LIGHT,
    mpCost: 60,
    power: 220,
    effects: [StatusEffectType.PURIFY],
    description: '光属性の神聖な攻撃',
    rarity: CardRarity.RARE
  },
  {
    name: '闇の呪縛',
    type: CardType.MAGIC,
    element: ElementKind.DARK,
    mpCost: 45,
    effects: [StatusEffectType.CURSE, StatusEffectType.POISON],
    description: '強力な呪い魔法。複数の負の効果を付与',
    rarity: CardRarity.RARE
  },
  {
    name: '完全なる守護',
    type: CardType.DEFENSE,
    element: ElementKind.LIGHT,
    mpCost: 40,
    shield: 150,
    effects: [StatusEffectType.SHIELD, StatusEffectType.REGENERATION],
    description: '最強クラスの防御魔法',
    rarity: CardRarity.RARE
  },
  {
    name: '大治癒術',
    type: CardType.MAGIC,
    element: ElementKind.LIGHT,
    mpCost: 50,
    faithCost: 20,
    effects: [StatusEffectType.REGENERATION, StatusEffectType.BLESS],
    description: '強力な回復魔法。信仰値が必要',
    rarity: CardRarity.RARE,
    requirements: { minFaith: 20 }
  },

  // ===== EPIC CARDS (4%) =====
  
  {
    name: '元素の融合',
    type: CardType.SPECIAL,
    mpCost: 70,
    power: 250,
    description: '全ての元素の力を集約した究極攻撃',
    rarity: CardRarity.EPIC,
    requirements: { minCombo: 3 }
  },
  {
    name: '時空の歪み',
    type: CardType.SPECIAL,
    mpCost: 80,
    effects: [StatusEffectType.STUN],
    description: '相手の時間を操作する禁断の魔法',
    rarity: CardRarity.EPIC,
    requirements: { minFaith: 50 }
  },

  // ===== LEGENDARY CARDS (1%) =====
  
  {
    name: '創世の力',
    type: CardType.SPECIAL,
    element: ElementKind.LIGHT,
    mpCost: 100,
    faithCost: 80,
    power: 400,
    effects: [StatusEffectType.REGENERATION, StatusEffectType.SHIELD, StatusEffectType.BLESS],
    description: '創造神の力を借りた究極の技',
    rarity: CardRarity.LEGENDARY,
    requirements: { minFaith: 80, minCombo: 5 }
  },
  {
    name: '終末の審判',
    type: CardType.SPECIAL,
    element: ElementKind.DARK,
    mpCost: 120,
    faithCost: 100,
    power: 500,
    effects: [StatusEffectType.BURN, StatusEffectType.POISON, StatusEffectType.CURSE],
    description: '破壊神の力を借りた禁断の技',
    rarity: CardRarity.LEGENDARY,
    requirements: { minFaith: 100, minCombo: 5 }
  }
];

// カード生成ヘルパー関数
const createCardFromTemplate = (template: CardTemplate): ICardData => {
  return {
    id: uuid.v4(),
    ...template,
  };
};

// カードデータベースをエクスポート
export const cards = CARD_TEMPLATES.map(template => createCardFromTemplate(template));

// ===== CARD GENERATION FUNCTIONS =====

/**
 * ランダムなカードを生成する
 */
export const generateRandomCard = (): ICardData => {
  // レアリティを確率に基づいて選択
  const rand = Math.random();
  let cumulativeProbability = 0;
  let selectedRarity = CardRarity.COMMON;
  
  for (const [rarity, probability] of Object.entries(RARITY_DISTRIBUTION)) {
    cumulativeProbability += probability;
    if (rand <= cumulativeProbability) {
      selectedRarity = rarity as CardRarity;
      break;
    }
  }
  
  // 選択されたレアリティのカードテンプレートから選択
  const cardsOfRarity = CARD_TEMPLATES.filter(template => template.rarity === selectedRarity);
  const template = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
  
  return createCardFromTemplate(template);
};

/**
 * 特定のレアリティのカードを生成する
 */
export const generateCardByRarity = (rarity: CardRarity): ICardData => {
  const cardsOfRarity = CARD_TEMPLATES.filter(template => template.rarity === rarity);
  if (cardsOfRarity.length === 0) {
    throw new Error(`No cards found for rarity: ${rarity}`);
  }
  
  const template = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
  return createCardFromTemplate(template);
};

/**
 * 特定の属性のカードを生成する
 */
export const generateCardByElement = (element: ElementKind): ICardData => {
  const cardsOfElement = CARD_TEMPLATES.filter(template => template.element === element);
  if (cardsOfElement.length === 0) {
    throw new Error(`No cards found for element: ${element}`);
  }
  
  const template = cardsOfElement[Math.floor(Math.random() * cardsOfElement.length)];
  return createCardFromTemplate(template);
};

/**
 * 初期デッキを生成する（バランス調整済み）
 */
export const generateInitialDeck = (): ICardData[] => {
  const deck: ICardData[] = [];
  const totalCards = 30;
  
  // レアリティ別にカードを追加
  for (const [rarity, count] of Object.entries(DECK_COMPOSITION)) {
    for (let i = 0; i < count; i++) {
      try {
        deck.push(generateCardByRarity(rarity as CardRarity));
      } catch (error) {
        // レアリティのカードが足りない場合はコモンで補完
        deck.push(generateCardByRarity(CardRarity.COMMON));
      }
    }
  }
  
  // デッキサイズが30枚になるまでコモンカードで埋める
  while (deck.length < totalCards) {
    deck.push(generateCardByRarity(CardRarity.COMMON));
  }
  
  // デッキをシャッフル
  return shuffleDeck(deck);
};

/**
 * バランス調整されたデッキを生成する
 */
export const generateBalancedDeck = (focusElement?: ElementKind): ICardData[] => {
  const deck: ICardData[] = [];
  const totalCards = 30;
  
  // 攻撃:防御:魔法:サポート = 40%:30%:20%:10%
  const typeDistribution = {
    [CardType.ATTACK]: 12,
    [CardType.DEFENSE]: 9,
    [CardType.MAGIC]: 6,
    [CardType.SUPPORT]: 3
  };
  
  for (const [type, count] of Object.entries(typeDistribution)) {
    for (let i = 0; i < count; i++) {
      const cardsOfType = CARD_TEMPLATES.filter(template => 
        template.type === type &&
        (!focusElement || !template.element || template.element === focusElement)
      );
      
      if (cardsOfType.length > 0) {
        const template = cardsOfType[Math.floor(Math.random() * cardsOfType.length)];
        deck.push(createCardFromTemplate(template));
      } else {
        // タイプのカードが足りない場合はランダムで補完
        deck.push(generateRandomCard());
      }
    }
  }
  
  return shuffleDeck(deck);
};

/**
 * デッキをシャッフルする
 */
export const shuffleDeck = (deck: ICardData[]): ICardData[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 全てのカードテンプレートを取得する（デバッグ用）
 */
export const getAllCardTemplates = (): CardTemplate[] => {
  return [...CARD_TEMPLATES];
};

/**
 * レアリティ別のカードテンプレート数を取得する
 */
export const getCardCountByRarity = (): Record<CardRarity, number> => {
  const counts = {} as Record<CardRarity, number>;
  for (const rarity of Object.values(CardRarity)) {
    counts[rarity] = CARD_TEMPLATES.filter(template => template.rarity === rarity).length;
  }
  return counts;
};