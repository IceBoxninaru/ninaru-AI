import { socket } from '../socket';
import { 
  IGameState, 
  IPlayer, 
  ICardData, 
  GamePhase,
  WeatherKind,
  StatusEffectType
} from '../../../shared/types/game';
import { ErrorMessageManager } from '../utils/errorMessageManager';

export class GameService {
  private static instance: GameService;
  private gameState: IGameState | null = null;
  private errorManager: ErrorMessageManager;

  private constructor() {
    this.errorManager = ErrorMessageManager.getInstance();
    this.setupSocketListeners();
  }

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  private setupSocketListeners(): void {
    socket.on('gameState', (state: IGameState) => {
      this.gameState = state;
    });

    socket.on('error', (error: string) => {
      this.errorManager.getErrorMessage(error);
    });
  }

  public getGameState(): IGameState | null {
    return this.gameState;
  }

  public getCurrentPlayer(): IPlayer | null {
    if (!this.gameState) return null;
    return this.gameState.players.find(p => p.id === socket.id) || null;
  }

  public playCard(cardIndex: number, targetId?: string): void {
    if (!this.gameState) {
      this.errorManager.getErrorMessage('GAME_NOT_INITIALIZED');
      return;
    }

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) {
      this.errorManager.getErrorMessage('PLAYER_NOT_FOUND');
      return;
    }

    const card = currentPlayer.hand[cardIndex];
    if (!card) {
      this.errorManager.getErrorMessage('CARD_NOT_FOUND');
      return;
    }

    if (!this.canPlayCard(card, currentPlayer)) {
      this.errorManager.getErrorMessage('CANNOT_PLAY_CARD');
      return;
    }

    socket.emit('playCard', {
      gameId: this.gameState.id,
      cardIndex,
      targetId
    });
  }

  public endTurn(): void {
    if (!this.gameState) {
      this.errorManager.getErrorMessage('GAME_NOT_INITIALIZED');
      return;
    }

    socket.emit('endTurn', {
      gameId: this.gameState.id
    });
  }

  private canPlayCard(card: ICardData, player: IPlayer): boolean {
    if (!card.isPlayable) return false;
    if (player.mp < card.mpCost) return false;
    if (player.faith < card.faithCost) return false;
    
    const requirements = card.requirements;
    if (requirements) {
      if (requirements.minCombo && player.combo < requirements.minCombo) return false;
      if (requirements.minFaith && player.faith < requirements.minFaith) return false;
      if (requirements.weatherType && this.gameState?.weather.type !== requirements.weatherType) return false;
      if (requirements.statusEffects) {
        for (const effect of requirements.statusEffects) {
          if (!player.statusEffects.some(s => s.type === effect)) return false;
        }
      }
    }
    
    return true;
  }

  public getCardPlayability(cardIndex: number): boolean {
    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) return false;

    const card = currentPlayer.hand[cardIndex];
    if (!card) return false;

    return this.canPlayCard(card, currentPlayer);
  }

  public getPlayerStatus(playerId: string): {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    faith: number;
    combo: number;
    gold: number;
    statusEffects: StatusEffectType[];
  } | null {
    if (!this.gameState) return null;

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) return null;

    return {
      hp: player.hp,
      maxHp: player.maxHp,
      mp: player.mp,
      maxMp: player.maxMp,
      faith: player.faith,
      combo: player.combo,
      gold: player.gold,
      statusEffects: player.statusEffects.map(effect => effect.type)
    };
  }
} 