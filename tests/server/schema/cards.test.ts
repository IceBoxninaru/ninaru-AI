import { BASIC_CARDS, generateInitialDeck, DECK_COMPOSITION } from '../../../server/schema/cards';
import { CardRarity, CardType } from '../../../shared/types/game';

describe('カードシステム', () => {
  describe('基本カードセット', () => {
    it('すべての基本カードが正しい属性を持っている', () => {
      BASIC_CARDS.forEach(card => {
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('element');
        expect(card).toHaveProperty('type');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('mpCost');
      });
    });

    it('各カードタイプが適切な追加属性を持っている', () => {
      const attackCards = BASIC_CARDS.filter(card => card.type === CardType.ATTACK);
      const defenseCards = BASIC_CARDS.filter(card => card.type === CardType.DEFENSE);
      const supportCards = BASIC_CARDS.filter(card => card.type === CardType.SUPPORT);
      const specialCards = BASIC_CARDS.filter(card => card.type === CardType.SPECIAL);

      attackCards.forEach(card => {
        expect(card).toHaveProperty('power');
      });

      defenseCards.forEach(card => {
        expect(card).toHaveProperty('shield');
      });

      supportCards.forEach(card => {
        expect(card).toHaveProperty('effects');
      });

      specialCards.forEach(card => {
        expect(card).toHaveProperty('faithCost');
      });
    });
  });

  describe('デッキ生成', () => {
    let deck: ReturnType<typeof generateInitialDeck>;

    beforeEach(() => {
      deck = generateInitialDeck();
    });

    it('デッキが正しい枚数のカードを含んでいる', () => {
      const totalCards = Object.values(DECK_COMPOSITION).reduce((sum, count) => sum + count, 0);
      expect(deck.length).toBe(totalCards);
    });

    it('各レアリティのカードが正しい枚数含まれている', () => {
      const cardCounts = deck.reduce((counts, card) => {
        if (card.rarity) {
          counts[card.rarity] = (counts[card.rarity] || 0) + 1;
        }
        return counts;
      }, {} as Partial<Record<CardRarity, number>>);

      Object.entries(DECK_COMPOSITION).forEach(([rarity, expectedCount]) => {
        expect(cardCounts[rarity as CardRarity]).toBe(expectedCount);
      });
    });

    it('生成されたデッキの各カードが一意のIDを持っている', () => {
      const ids = new Set(deck.map(card => card.id));
      expect(ids.size).toBe(deck.length);
    });

    it('デッキがシャッフルされている', () => {
      const deck1 = generateInitialDeck();
      const deck2 = generateInitialDeck();
      
      // IDを除外して比較（IDは毎回異なる）
      const cardsEqual = deck1.every((card, index) => {
        const card2 = deck2[index];
        return card.name === card2.name &&
               card.element === card2.element &&
               card.type === card2.type;
      });

      // 2つのデッキが完全に同じ順序である可能性は非常に低い
      expect(cardsEqual).toBe(false);
    });
  });
}); 