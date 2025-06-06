import { Player, Card, GameState, CardType } from '../../shared/types/game.js';

interface AIStrategy {
  name: string;
  description: string;
  evaluateCard: (card: Card, player: Player, gameState: GameState) => number;
}

export class AIPlayerService {
  private readonly strategies: AIStrategy[] = [
    {
      name: 'アグレッシブ',
      description: '攻撃的な戦略',
      evaluateCard: (card: Card, player: Player, gameState: GameState) => {
        if (card.type === 'ATTACK') return 100 + (card.power || 0);
        if (card.type === 'MAGIC' && card.power) return 80 + card.power;
        if (card.type === 'DEFENSE') return 40 + (card.shield || 0);
        if (card.type === 'SPECIAL') return 30 + (card.shield || 0);
        return 20;
      }
    },
    {
      name: 'ディフェンシブ',
      description: '防御的な戦略',
      evaluateCard: (card: Card, player: Player, gameState: GameState) => {
        if (card.type === 'DEFENSE') return 100 + (card.shield || 0);
        if (card.type === 'SPECIAL') return 90 + (card.shield || 0);
        if (card.type === 'MAGIC' && !card.power) return 80;
        if (card.type === 'ATTACK') return 40 + (card.power || 0);
        return 20;
      }
    },
    {
      name: 'バランス',
      description: 'バランスの取れた戦略',
      evaluateCard: (card: Card, player: Player, gameState: GameState) => {
        let score = 60;

        if (player.hp < player.maxHp * 0.3) {
          if (card.type === 'DEFENSE' || card.type === 'SPECIAL') score += 40;
        }

        if (player.mp > player.maxMp * 0.7) {
          if (card.type === 'MAGIC') score += 30;
        }

        if (card.power) score += card.power * 0.5;
        if (card.shield) score += card.shield * 0.5;

        return score;
      }
    },
    {
      name: 'エコノミー',
      description: 'リソース管理重視の戦略',
      evaluateCard: (card: Card, player: Player, gameState: GameState) => {
        let score = 50;

        if (card.mpCost) {
          score -= card.mpCost * 2;
        }

        if (player.mp < player.maxMp * 0.3) {
          if (card.mpCost && card.mpCost > player.mp) {
            return 0;
          }
        }

        if (card.type === 'SUPPORT') {
          score += 30;
        }

        return Math.max(0, score);
      }
    }
  ];

  selectStrategy(player: Player, gameState: GameState): AIStrategy {
    if (player.status.has('STUN')) {
      return this.strategies[1]; // ディフェンシブ
    }

    if (player.hp < player.maxHp * 0.3) {
      return this.strategies[1]; // ディフェンシブ
    }

    if (player.mp > player.maxMp * 0.7) {
      return this.strategies[0]; // アグレッシブ
    }

    if (player.gold < 100) {
      return this.strategies[3]; // エコノミー
    }

    return this.strategies[2]; // バランス
  }

  selectCard(player: Player, gameState: GameState): Card | null {
    if (player.status.has('STUN')) return null;

    const strategy = this.selectStrategy(player, gameState);
    const playableCards = player.hand.filter(card => {
      if (card.mpCost && card.mpCost > player.mp) return false;
      if (player.status.has('STUN') && (card.type === 'DEFENSE' || card.type === 'SPECIAL')) return false;
      return true;
    });

    if (playableCards.length === 0) return null;

    const cardScores = playableCards.map(card => ({
      card,
      score: strategy.evaluateCard(card, player, gameState)
    }));

    cardScores.sort((a, b) => b.score - a.score);
    return cardScores[0].card;
  }

  selectTarget(player: Player, card: Card, gameState: GameState): Player {
    const otherPlayers = gameState.players.filter(p => p.id !== player.id);
    
    if (card.type === 'ATTACK' || (card.type === 'MAGIC' && card.power)) {
      // 最もHPが低い敵を選択
      const enemies = otherPlayers.filter(p => p.team !== player.team);
      if (enemies.length > 0) {
        return enemies.reduce((lowest, current) => 
          current.hp < lowest.hp ? current : lowest
        );
      }
    }

    if (card.type === 'DEFENSE' || card.type === 'SPECIAL' || (card.type === 'MAGIC' && !card.power)) {
      // 最もHPが低い味方を選択（チーム戦の場合）
      const allies = otherPlayers.filter(p => p.team === player.team);
      if (allies.length > 0) {
        return allies.reduce((lowest, current) => 
          current.hp < lowest.hp ? current : lowest
        );
      }
    }

    // デフォルトは自分を選択
    return player;
  }

  playTurn(player: Player, gameState: GameState): void {
    const card = this.selectCard(player, gameState);
    if (!card) return;

    const target = this.selectTarget(player, card, gameState);
    // ここでカードの使用をゲームロジックに通知する必要があります
  }
} 