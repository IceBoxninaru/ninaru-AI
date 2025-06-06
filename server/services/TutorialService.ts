import { GameState, Player, Card } from '../../shared/types/game.js';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'action' | 'battle';
  condition?: (state: GameState) => boolean;
  hint?: string;
  position?: { x: number; y: number };
  highlightElement?: string;
  requiredAction?: {
    type: string;
    cardType?: string;
    targetType?: string;
  };
}

interface TutorialChapter {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  reward: {
    type: 'gold' | 'card' | 'deck';
    amount?: number;
    itemId?: string;
  };
}

export class TutorialService {
  private chapters: TutorialChapter[] = [
    {
      id: 'basic',
      title: 'ゲームの基本',
      description: '基本的なゲームの流れを学びましょう',
      steps: [
        {
          id: 'basic_1',
          title: 'ようこそ',
          description: '呪われた王国へようこそ！このチュートリアルでは、ゲームの基本的な遊び方を説明します。',
          type: 'info'
        },
        {
          id: 'basic_2',
          title: 'カードを引く',
          description: 'まずはカードを引いてみましょう。デッキからカードを1枚引きます。',
          type: 'action',
          requiredAction: {
            type: 'draw'
          },
          hint: '画面右下のデッキをクリックしてください'
        },
        {
          id: 'basic_3',
          title: 'カードを使う',
          description: '手札のカードを使ってみましょう。攻撃カードを選んで敵を攻撃します。',
          type: 'action',
          requiredAction: {
            type: 'play',
            cardType: 'attack',
            targetType: 'enemy'
          },
          hint: '手札の攻撃カードを選び、敵キャラクターをクリックしてください'
        }
      ],
      reward: {
        type: 'deck',
        itemId: 'starter_deck'
      }
    },
    {
      id: 'advanced',
      title: '応用テクニック',
      description: 'より高度な戦術を学びましょう',
      steps: [
        {
          id: 'advanced_1',
          title: 'コンボの基本',
          description: '複数のカードを組み合わせてコンボを決めましょう。',
          type: 'battle',
          condition: (state) => {
            const player = state.players[0];
            return player.combo >= 3;
          },
          hint: '同じ属性のカードを連続で使うとコンボになります'
        },
        {
          id: 'advanced_2',
          title: 'フィールドカード',
          description: 'フィールドカードを使って戦場を有利に変えましょう。',
          type: 'action',
          requiredAction: {
            type: 'play',
            cardType: 'field'
          },
          hint: 'フィールドカードは場全体に効果を及ぼします'
        }
      ],
      reward: {
        type: 'card',
        itemId: 'rare_card'
      }
    }
  ];

  private userProgress: Map<string, Set<string>> = new Map(); // userId -> completedStepIds

  getCurrentStep(userId: string, chapterId: string): TutorialStep | null {
    if (!userId || !chapterId) return null;
    
    const chapter = this.chapters.find(c => c.id === chapterId);
    if (!chapter) return null;

    const completedSteps = this.userProgress.get(userId) || new Set();
    return chapter.steps.find(step => !completedSteps.has(step.id)) || null;
  }

  completeStep(userId: string, stepId: string): void {
    if (!userId || !stepId) return;
    
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, new Set());
    }
    const userSteps = this.userProgress.get(userId);
    if (userSteps) {
      userSteps.add(stepId);
    }
  }

  isChapterComplete(userId: string, chapterId: string): boolean {
    const chapter = this.chapters.find(c => c.id === chapterId);
    if (!chapter) return false;

    const completedSteps = this.userProgress.get(userId) || new Set();
    return chapter.steps.every(step => completedSteps.has(step.id));
  }

  getChapterReward(chapterId: string): TutorialChapter['reward'] | null {
    const chapter = this.chapters.find(c => c.id === chapterId);
    return chapter ? chapter.reward : null;
  }

  checkStepCondition(step: TutorialStep, state: GameState): boolean {
    if (!step || !state) return false;
    if (!step.condition) return true;
    return step.condition(state);
  }

  validateAction(
    step: TutorialStep,
    action: { type: string; cardType?: string; targetType?: string }
  ): boolean {
    if (!step || !action) return false;
    if (!step.requiredAction) return true;

    if (step.requiredAction.type !== action.type) return false;
    if (step.requiredAction.cardType && 
        step.requiredAction.cardType !== action.cardType) return false;
    if (step.requiredAction.targetType && 
        step.requiredAction.targetType !== action.targetType) return false;

    return true;
  }

  getAvailableChapters(userId: string): TutorialChapter[] {
    const completedSteps = this.userProgress.get(userId) || new Set();
    
    return this.chapters.filter(chapter => {
      // 基本チャプターは常に利用可能
      if (chapter.id === 'basic') return true;

      // 前のチャプターが完了している場合のみ利用可能
      const prevChapterIndex = this.chapters.findIndex(c => c.id === chapter.id) - 1;
      if (prevChapterIndex < 0) return true;

      const prevChapter = this.chapters[prevChapterIndex];
      return prevChapter.steps.every(step => completedSteps.has(step.id));
    });
  }

  resetProgress(userId: string): void {
    this.userProgress.delete(userId);
  }

  getProgress(userId: string): {
    completedSteps: number;
    totalSteps: number;
    completedChapters: number;
    totalChapters: number;
  } {
    if (!userId) {
      return {
        completedSteps: 0,
        totalSteps: 0,
        completedChapters: 0,
        totalChapters: 0
      };
    }

    const completedSteps = this.userProgress.get(userId) || new Set();
    const totalSteps = this.chapters.reduce((sum, chapter) => 
      sum + chapter.steps.length, 0
    );
    const completedChapters = this.chapters.filter(chapter =>
      chapter.steps.every(step => completedSteps.has(step.id))
    ).length;

    return {
      completedSteps: completedSteps.size,
      totalSteps,
      completedChapters,
      totalChapters: this.chapters.length
    };
  }
} 