import { z } from 'zod';
import { CardType, ElementType, StatusEffect, CardRarity } from '../../shared/types/game.js';

export const cardSchema = z.object({
  id: z.string(),
  name: z.string().max(32),
  type: z.enum(['ATTACK', 'DEFENSE', 'MAGIC', 'SUPPORT', 'SPECIAL']),
  rarity: z.enum(['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY']),
  element: z.enum(['FIRE', 'WATER', 'EARTH', 'WIND', 'LIGHT', 'DARK', 'NEUTRAL']).optional(),
  power: z.number().int().min(0).optional(),
  shield: z.number().int().min(0).optional(),
  mpCost: z.number().int().min(0).optional(),
  effects: z.array(z.enum(['BURN', 'FREEZE', 'POISON', 'STUN', 'SHIELD', 'REGEN'])).optional(),
  description: z.string()
});

export type Card = z.infer<typeof cardSchema>;

export const sampleCards: Card[] = [
  {
    id: 'ATK_CURSE_01',
    type: 'ATTACK',
    name: '呪いの刃',
    power: 150,
    element: 'DARK',
    rarity: 'RARE',
    description: '闇属性の力で敵を切り裂く'
  },
  {
    id: 'MAG_FIRE_01',
    type: 'MAGIC',
    name: '火炎の嵐',
    power: 200,
    mpCost: 80,
    element: 'FIRE',
    rarity: 'RARE',
    description: '広範囲に炎のダメージを与える'
  },
  {
    id: 'SUP_NULL_01',
    type: 'SUPPORT',
    name: '天候無効化',
    rarity: 'UNCOMMON',
    description: '天候の効果を一時的に無効化する',
    effects: ['SHIELD']
  }
];