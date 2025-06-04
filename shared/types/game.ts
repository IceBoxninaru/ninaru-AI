export type WeatherKind =
  | 'SUNNY'
  | 'RAINY'
  | 'CLOUDY'
  | 'STORMY'
  | 'WINDY'
  | 'FOGGY'
  | 'SNOWY'
  | 'SACRED'
  | 'CLEAR';
export type ElementKind = 'FIRE' | 'WATER' | 'EARTH' | 'WIND' | 'LIGHT' | 'DARK' | 'NEUTRAL';
export type CardType = 'ATTACK' | 'DEFENSE' | 'MAGIC' | 'SUPPORT' | 'SPECIAL';
export type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type GamePhase = 'WAIT' | 'DRAW' | 'MAIN' | 'END';
export type StatusEffectType =
  | 'SHIELD'
  | 'REGEN'
  | 'REGENERATION'
  | 'POISON'
  | 'BURN'
  | 'FREEZE'
  | 'STUN'
  | 'CURSE'
  | 'BLESS'
  | 'RAGE'
  | 'PURIFY'
  | 'PARALYZE'
  | 'STRENGTHEN'
  | 'WEAKEN';

export const ELEMENTS: ElementKind[] = ['FIRE', 'WATER', 'EARTH', 'WIND', 'LIGHT', 'DARK', 'NEUTRAL'];
export const CARD_TYPES: CardType[] = ['ATTACK', 'DEFENSE', 'MAGIC', 'SUPPORT', 'SPECIAL'];
export const CARD_RARITIES: CardRarity[] = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
export const STATUS_EFFECTS: StatusEffectType[] = [
  'SHIELD',
  'REGEN',
  'REGENERATION',
  'POISON',
  'BURN',
  'FREEZE',
  'STUN',
  'CURSE',
  'BLESS',
  'RAGE',
  'PURIFY',
  'PARALYZE',
  'STRENGTHEN',
  'WEAKEN'
];
export const WEATHER_TYPES: WeatherKind[] = [
  'SUNNY',
  'RAINY',
  'CLOUDY',
  'STORMY',
  'WINDY',
  'FOGGY',
  'SNOWY',
  'SACRED',
  'CLEAR'
];
export const GAME_PHASES: GamePhase[] = ['WAIT', 'DRAW', 'MAIN', 'END'];

export interface IWeather {
  type: WeatherKind;
  duration: number;
}

export interface ICardData {
  id: string;
  name: string;
  type: CardType;
  element: ElementType;
  mpCost: number;
  faithCost: number;
  comboValue: number;
  description: string;
  power?: number;
  shield?: number;
  effects?: string[];
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