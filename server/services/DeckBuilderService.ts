import { Card, ElementType } from '../../shared/types/game';

interface DeckTemplate {
  id: string;
  name: string;
  description: string;
  cards: string[]; // カードID配列
  author: string;
  rating: number;
  votes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeckValidationRule {
  name: string;
  validate: (cards: Card[]) => boolean;
  errorMessage: string;
}

export class DeckBuilderService {
  private readonly MIN_DECK_SIZE = 40;
  private readonly MAX_DECK_SIZE = 60;
  private readonly MAX_COPIES = 3;
  private readonly MAX_LEGENDARY = 1;

  private readonly validationRules: DeckValidationRule[] = [
    {
      name: 'デッキサイズ',
      validate: (cards) => 
        cards.length >= this.MIN_DECK_SIZE && cards.length <= this.MAX_DECK_SIZE,
      errorMessage: `デッキは${this.MIN_DECK_SIZE}枚以上${this.MAX_DECK_SIZE}枚以下である必要があります`
    },
    {
      name: 'カードの重複',
      validate: (cards) => {
        const counts = new Map<string, number>();
        for (const card of cards) {
          counts.set(card.id, (counts.get(card.id) || 0) + 1);
          if (counts.get(card.id)! > this.MAX_COPIES) return false;
        }
        return true;
      },
      errorMessage: `同じカードは${this.MAX_COPIES}枚までしか入れられません`
    },
    {
      name: 'レジェンドカード制限',
      validate: (cards) => {
        const legendaryCount = cards.filter(card => 
          card.id.startsWith('leg_')
        ).length;
        return legendaryCount <= this.MAX_LEGENDARY;
      },
      errorMessage: `レジェンドカードは${this.MAX_LEGENDARY}枚までしか入れられません`
    }
  ];

  private deckTemplates: DeckTemplate[] = [
    {
      id: 'tmp001',
      name: '呪いの制圧',
      description: '呪い属性を主体とした制圧デッキ',
      cards: ['atk_001', 'def_001', 'mag_001', 'fld_001'],
      author: 'system',
      rating: 4.5,
      votes: 100,
      tags: ['curse', 'control'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  validateDeck(cards: Card[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of this.validationRules) {
      if (!rule.validate(cards)) {
        errors.push(rule.errorMessage);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateManaDistribution(cards: Card[]): Map<number, number> {
    const distribution = new Map<number, number>();
    
    for (const card of cards) {
      if (card.mpCost) {
        distribution.set(
          card.mpCost,
          (distribution.get(card.mpCost) || 0) + 1
        );
      }
    }

    return distribution;
  }

  calculateElementDistribution(cards: Card[]): Map<ElementType, number> {
    const distribution = new Map<ElementType, number>();
    
    for (const card of cards) {
      if (card.element) {
        distribution.set(
          card.element,
          (distribution.get(card.element) || 0) + 1
        );
      }
    }

    return distribution;
  }

  saveDeckTemplate(template: DeckTemplate): void {
    const existing = this.deckTemplates.findIndex(t => t.id === template.id);
    if (existing >= 0) {
      this.deckTemplates[existing] = {
        ...template,
        updatedAt: new Date()
      };
    } else {
      this.deckTemplates.push({
        ...template,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  getDeckTemplates(filters?: {
    author?: string;
    tags?: string[];
    minRating?: number;
  }): DeckTemplate[] {
    let templates = this.deckTemplates;

    if (filters) {
      if (filters.author) {
        templates = templates.filter(t => t.author === filters.author);
      }
      if (filters.tags) {
        templates = templates.filter(t => 
          filters.tags!.every(tag => t.tags.includes(tag))
        );
      }
      if (filters.minRating !== undefined) {
        templates = templates.filter(t => t.rating >= filters.minRating!);
      }
    }

    return templates.sort((a, b) => b.rating - a.rating);
  }

  rateDeckTemplate(templateId: string, rating: number): void {
    const template = this.deckTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newRating = (template.rating * template.votes + rating) / (template.votes + 1);
    template.rating = Number(newRating.toFixed(1));
    template.votes += 1;
    template.updatedAt = new Date();
  }
} 