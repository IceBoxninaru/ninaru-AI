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

export enum ElementKind {
  FIRE = 'FIRE',
  WATER = 'WATER',
  EARTH = 'EARTH',
  WIND = 'WIND',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  NEUTRAL = 'NEUTRAL'
}

export enum CardType {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
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
  SHIELD = 'SHIELD',
  REGENERATION = 'REGENERATION',
  POISON = 'POISON',
  BURN = 'BURN',
  FREEZE = 'FREEZE',
  STUN = 'STUN',
  REGEN = 'REGEN',
  CURSE = 'CURSE',
  BLESS = 'BLESS',
  RAGE = 'RAGE',
  PURIFY = 'PURIFY',
  PARALYZE = 'PARALYZE'
}

export const ELEMENTS = Object.values(ElementKind);
export const CARD_TYPES = Object.values(CardType);
export const CARD_RARITIES = Object.values(CardRarity);
export const STATUS_EFFECTS = Object.values(StatusEffectType);
export const WEATHER_TYPES = Object.values(WeatherKind);
export const GAME_PHASES = Object.values(GamePhase);

export interface IWeather {
  type: WeatherKind;
  duration: number;
  turnsLeft?: number;
}

export interface ICardData {
  id: string;
  name: string;
  type: CardType;
  element: ElementKind;
  mpCost: number;
  faithCost?: number;
  comboValue?: number;
  description: string;
  power?: number;
  shield?: number;
  effects?: StatusEffectType[];
  rarity?: CardRarity;
  isPlayable?: boolean;
  requirements?: {
    minCombo?: number;
    minFaith?: number;
    weatherType?: WeatherKind;
    statusEffects?: StatusEffectType[];
  };
}

export interface IPlayer {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  faith: number;
  combo: number;
  maxCombo: number;
  gold: number;
  hand: ICardData[];
  deck: ICardData[];
  discardPile: ICardData[];
  status: Map<StatusEffectType, number>;
  damageMultiplier: number;
  mpCostMultiplier: number;
  damageReceivedMultiplier: number;
  lastPlayedElement?: ElementKind;
  statusEffects: IStatusEffect[];

  drawCard(): void;
  addStatus(effect: StatusEffectType, duration: number): void;
  removeStatus(effect: StatusEffectType): void;
  updateStatuses(): void;
  takeDamage(amount: number): void;
  heal(amount: number): void;
  spendMp(amount: number): void;
  gainMp(amount: number): void;
  spendFaith(amount: number): void;
  addFaith(amount: number): void;
  addCombo(amount: number): void;
  resetCombo(): void;
}

export interface IDamageEvent {
  sourceId: string;
  targetId: string;
  amount: number;
  element: ElementKind;
  isCritical: boolean;
  isBlocked?: boolean;
}

export interface IGameState {
  id: string;
  currentTurn: number;
  currentPlayerId: string;
  players: IPlayer[];
  weather: IWeather;
  phase: GamePhase;
  turn: number;
  winner?: string;
}

export interface IStatusEffect {
  type: StatusEffectType;
  name: string;
  duration: number;
  description: string;
  value: number;
  turnsLeft?: number;
}

export interface IGameEvent {
  type: 'DAMAGE' | 'HEAL' | 'STATUS' | 'WEATHER' | 'FIELD';
  data: IDamageEvent | any;
}

export interface IWeatherData {
  name: string;
  description: string;
  effect?: StatusEffectType;
  duration: number;
}

export type Card = ICardData;
export type Player = IPlayer;
export type GameState = IGameState;
export type ElementType = ElementKind;
export type WeatherType = WeatherKind;
export type StatusEffect = StatusEffectType;
export type PlayerData = IPlayer; 