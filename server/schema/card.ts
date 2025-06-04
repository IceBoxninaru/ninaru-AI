import { z } from 'zod';
import { CardType, ElementType, StatusEffect, CardRarity } from '../../shared/types/game';

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
    type: 'attack',
    name: '呪いの刃',
    power: 150,
    element: 'curse',
    isPlus: false
  },
  {
    id: 'MAG_FIRE_01',
    type: 'magic',
    name: '火炎の嵐',
    power: 200,
    mpCost: 80,
    element: 'fire',
    aoe: true
  },
  {
    id: 'FLD_NULL_01',
    type: 'field',
    name: '天候無効化',
    nullifyWeather: true,
    duration: 0
  }
];