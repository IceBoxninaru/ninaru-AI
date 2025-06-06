// ===== UNIFIED GAME TYPES =====
// 単一の型定義ファイルですべての型を統一管理

// 基本的なEnum定義
export enum ElementKind {
  FIRE = 'FIRE',
  WATER = 'WATER',
  EARTH = 'EARTH',
  WIND = 'WIND',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  NEUTRAL = 'NEUTRAL'
}

export enum WeatherKind {
  SUNNY = 'SUNNY',
  RAINY = 'RAINY',
  CLOUDY = 'CLOUDY',
  STORMY = 'STORMY',
  WINDY = 'WINDY',
  SNOWY = 'SNOWY',
  FOGGY = 'FOGGY',
  SACRED = 'SACRED',
  CLEAR = 'CLEAR'
}

export enum CardType {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
  MAGIC = 'MAGIC',
  SUPPORT = 'SUPPORT',
  SPECIAL = 'SPECIAL'
}

export enum CardRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export enum GamePhase {
  WAIT = 'WAIT',
  DRAW = 'DRAW',
  MAIN = 'MAIN',
  END = 'END'
}

export enum StatusEffectType {
  // 継続ダメージ
  BURN = 'BURN',
  POISON = 'POISON',
  
  // 行動制限
  FREEZE = 'FREEZE',
  STUN = 'STUN',
  PARALYZE = 'PARALYZE',
  
  // 防御・回復
  SHIELD = 'SHIELD',
  REGENERATION = 'REGENERATION',
  REGEN = 'REGEN',
  
  // 強化・弱体化
  RAGE = 'RAGE',
  CURSE = 'CURSE',
  BLESS = 'BLESS',
  PURIFY = 'PURIFY'
}

// ===== CORE INTERFACES =====

export interface IWeather {
  type: WeatherKind;
  duration: number;
}

export interface IStatusEffect {
  type: StatusEffectType;
  name?: string;
  duration: number;
  description?: string;
  value?: number;
  turnsLeft?: number;
}

export interface ICardData {
  id: string;
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
    weatherType?: WeatherKind;
    statusEffects?: StatusEffectType[];
  };
  isPlayable?: boolean;
}

export interface IPlayer {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  faith: number;
  maxFaith: number; // テストで要求されるプロパティ
  combo: number;
  maxCombo: number;
  gold: number;
  hand: ICardData[];
  deck: ICardData[];
  discardPile: ICardData[];
  statusEffects: IStatusEffect[];
  status: Map<StatusEffectType, number>;
  damageMultiplier: number;
  mpCostMultiplier: number;
  damageReceivedMultiplier: number;
  lastPlayedElement?: ElementKind;
  team?: number;

  // メソッド（テストで要求される全メソッドを含む）
  drawCard(): void;
  playCard(cardIndex: string): ICardData | null; // テストで要求されるメソッド
  canPlayCard(card: ICardData): boolean; // テストで要求されるメソッド
  takeDamage(amount: number): void;
  heal(amount: number): void;
  gainMp(amount: number): void;
  spendMp(amount: number): void;
  addFaith(amount: number): void;
  spendFaith(amount: number): void;
  addCombo(amount: number): void;
  resetCombo(): void;
  isCriticalHit(): boolean; // テストで要求されるメソッド
  addStatus(effect: StatusEffectType, duration: number): void;
  removeStatus(effect: StatusEffectType): void;
  hasStatusEffect(effect: StatusEffectType): boolean;
  updateStatuses(): void;
  isAlive(): boolean;
  resetForNewGame(): void;
}

export interface IGameState {
  id: string;
  players: IPlayer[];
  currentPlayerId: string;
  currentTurn: number;
  weather: IWeather;
  phase: GamePhase;
  winner?: string;
  turnTimer?: number;
  maxPlayers?: number;
  gameMode?: 'STANDARD' | 'TEAM' | 'TOURNAMENT';
}

export interface IDamageEvent {
  sourceId: string;
  targetId: string;
  amount: number;
  element: ElementKind;
  isCritical: boolean;
  isBlocked?: boolean;
  timestamp: number;
}

export interface IGameEvent {
  id: string;
  type: 'DAMAGE' | 'HEAL' | 'STATUS' | 'WEATHER' | 'CARD_PLAY' | 'TURN_END' | 'GAME_START' | 'GAME_END' | 'PLAYER_JOIN' | 'PLAYER_LEAVE' | 'TURN_START';
  sourcePlayerId?: string;
  targetPlayerId?: string;
  data: any;
  timestamp: number;
}

// ===== CONFIGURATION INTERFACES =====

export interface IWeatherConfig {
  name: string;
  description: string;
  duration: number;
  effect?: StatusEffectType;
  effectChance?: number;
  bonus: Record<ElementKind, boolean>; // 完全な定義に変更
  penalty: Record<ElementKind, boolean>; // 完全な定義に変更
}

export interface IStatusEffectConfig {
  name: string;
  description: string;
  icon: string;
  duration: number;
  color?: string;
}

export interface IElementConfig {
  name: string;
  icon: string;
  color: string;
}

export interface IWeatherData {
  name: string;
  description: string;
  effect?: StatusEffectType;
  duration: number;
}

// UI用インターフェース
export interface IPlayerInfo {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  gold: number;
  faith: number;
  combo: number;
  maxCombo: number;
  statusEffects: StatusEffectType[];
  isCurrentPlayer: boolean;
}

export interface ICardInfo {
  id: string;
  name: string;
  description: string;
  element?: ElementKind;
  power?: number;
  shield?: number;
  mpCost: number;
  isPlayable: boolean;
}

export interface IGameInfo {
  currentTurn: number;
  currentPlayer: IPlayer | null;
  weather: string;
  phase: string;
}

// ===== UTILITY TYPES =====

export type GameConfig = {
  maxPlayers: number;
  turnTimeLimit: number;
  deckSize: number;
  initialHandSize: number;
  initialHP: number;
  initialMP: number;
  maxFaith: number;
  maxCombo: number;
};

export type PlayableCard = ICardData & { isPlayable: true };

export type PlayerAction = {
  type: 'PLAY_CARD' | 'END_TURN' | 'FORFEIT';
  playerId: string;
  data?: any;
};

// ===== TYPE ALIASES (後方互換性) =====

export type ElementType = ElementKind;
export type WeatherType = WeatherKind;
export type StatusEffect = StatusEffectType;
export type CardKind = CardType;
export type Player = IPlayer;
export type PlayerData = IPlayer;
export type Card = ICardData;
export type GameState = IGameState;
export type WeatherData = IWeatherData;

// ===== CONSTANTS =====

export const DEFAULT_GAME_CONFIG: GameConfig = {
  maxPlayers: 4,
  turnTimeLimit: 60000,
  deckSize: 30,
  initialHandSize: 5,
  initialHP: 2000,
  initialMP: 150,
  maxFaith: 100,
  maxCombo: 10
};

export const ELEMENTS = Object.values(ElementKind);
export const WEATHER_TYPES = Object.values(WeatherKind);
export const CARD_TYPES = Object.values(CardType);
export const CARD_RARITIES = Object.values(CardRarity);
export const STATUS_EFFECTS = Object.values(StatusEffectType);
export const GAME_PHASES = Object.values(GamePhase);

// ===== VALIDATION HELPERS =====

export const isValidElement = (element: string): element is ElementKind => {
  return Object.values(ElementKind).includes(element as ElementKind);
};

export const isValidWeather = (weather: string): weather is WeatherKind => {
  return Object.values(WeatherKind).includes(weather as WeatherKind);
};

export const isValidCardType = (type: string): type is CardType => {
  return Object.values(CardType).includes(type as CardType);
};

export const isValidStatusEffect = (effect: string): effect is StatusEffectType => {
  return Object.values(StatusEffectType).includes(effect as StatusEffectType);
};