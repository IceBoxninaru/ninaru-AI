import { Player, StatusEffect, StatusEffectType, CardKind } from '../../shared/types/game';

interface StatusEffectData {
  name: string;
  description: string;
  duration: number;
  onApply?: (player: Player) => void;
  onTurnStart?: (player: Player) => void;
  onTurnEnd?: (player: Player) => void;
  onRemove?: (player: Player) => void;
}

export class StatusEffectService {
  private readonly statusEffects: Record<StatusEffectType, StatusEffectData> = {
    BURN: {
      name: '炎上',
      description: 'ターン終了時にダメージを受ける',
      duration: 3,
      onTurnEnd: (player) => {
        player.hp = Math.max(0, player.hp - 100);
      }
    },
    FREEZE: {
      name: '凍結',
      description: 'MPの消費が2倍になる',
      duration: 2,
      onApply: (player) => {
        player.mpCostMultiplier = 2;
      },
      onRemove: (player) => {
        player.mpCostMultiplier = 1;
      }
    },
    POISON: {
      name: '毒',
      description: 'ターン終了時に最大HPの10%のダメージを受ける',
      duration: 4,
      onTurnEnd: (player) => {
        const damage = Math.floor(player.maxHp * 0.1);
        player.hp = Math.max(0, player.hp - damage);
      }
    },
    CURSE: {
      name: '呪い',
      description: '与えるダメージが半減する',
      duration: 3,
      onApply: (player) => {
        player.damageMultiplier = 0.5;
      },
      onRemove: (player) => {
        player.damageMultiplier = 1;
      }
    },
    BLESS: {
      name: '祝福',
      description: 'ターン開始時にHPとMPが回復する',
      duration: 2,
      onTurnStart: (player) => {
        player.hp = Math.min(player.maxHp, player.hp + 200);
        player.mp = Math.min(player.maxMp, player.mp + 50);
      }
    },
    STUN: {
      name: '気絶',
      description: 'カードを使用できない',
      duration: 1
    },
    RAGE: {
      name: '激怒',
      description: '与えるダメージが2倍になるが、受けるダメージも2倍になる',
      duration: 2,
      onApply: (player) => {
        player.damageMultiplier = 2;
        player.damageReceivedMultiplier = 2;
      },
      onRemove: (player) => {
        player.damageMultiplier = 1;
        player.damageReceivedMultiplier = 1;
      }
    },
    SHIELD: {
      name: '防御',
      description: '受けるダメージが半減する',
      duration: 1,
      onApply: (player) => {
        player.damageReceivedMultiplier = 0.5;
      },
      onRemove: (player) => {
        player.damageReceivedMultiplier = 1;
      }
    },
    PURIFY: {
      name: '浄化',
      description: '回復効果が30%減少する',
      duration: 3,
      onApply: (player) => {
        player.damageReceivedMultiplier = 0.7;
      },
      onRemove: (player) => {
        player.damageReceivedMultiplier = 1;
      }
    },
    PARALYZE: {
      name: '麻痺',
      description: '防御カードを使用できない',
      duration: 1
    },
    REGEN: {
      name: '再生',
      description: 'ターン開始時にHPが少量回復する',
      duration: 3,
      onTurnStart: (player) => {
        player.hp = Math.min(player.maxHp, player.hp + 50);
      }
    },
    REGENERATION: {
      name: '大再生',
      description: 'ターン開始時にHPが回復する',
      duration: 3,
      onTurnStart: (player) => {
        player.hp = Math.min(player.maxHp, player.hp + 150);
      }
    }
  };

  applyStatusEffect(player: Player, effect: StatusEffectType): void {
    if (!player) return;
    
    const effectData = this.statusEffects[effect];
    if (!effectData) return;

    player.status.set(effect, effectData.duration);
    if (effectData.onApply) {
      effectData.onApply(player);
    }
  }

  removeStatusEffect(player: Player, effect: StatusEffectType): void {
    if (!player) return;
    
    const effectData = this.statusEffects[effect];
    if (!effectData) return;

    player.status.delete(effect);
    if (effectData.onRemove) {
      effectData.onRemove(player);
    }
  }

  updateStatusEffects(player: Player, phase: 'start' | 'end'): void {
    if (!player || !player.status) return;

    for (const [effect, turnsLeft] of player.status.entries()) {
      const effectData = this.statusEffects[effect as StatusEffectType];
      if (!effectData) continue;

      if (phase === 'start' && effectData.onTurnStart) {
        effectData.onTurnStart(player);
      } else if (phase === 'end' && effectData.onTurnEnd) {
        effectData.onTurnEnd(player);
      }

      if (phase === 'end') {
        const newTurnsLeft = turnsLeft - 1;
        if (newTurnsLeft <= 0) {
          this.removeStatusEffect(player, effect as StatusEffectType);
        } else {
          player.status.set(effect as StatusEffectType, newTurnsLeft);
        }
      }
    }
  }

  getStatusEffectData(effect: StatusEffectType): StatusEffectData {
    return this.statusEffects[effect];
  }

  canUseCards(player: Player, cardType?: CardKind): boolean {
    if (player.status.has('STUN' as StatusEffectType)) return false;
    if (cardType === ('DEFENSE' as CardKind) && player.status.has('PARALYZE' as StatusEffectType)) return false;
    return true;
  }
} 