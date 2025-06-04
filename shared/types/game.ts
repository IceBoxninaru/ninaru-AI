export enum WeatherKind {
  SUNNY = 'SUNNY',
  RAINY = 'RAINY',
  CLOUDY = 'CLOUDY',
  STORMY = 'STORMY',
  WINDY = 'WINDY',
  FOGGY = 'FOGGY',
  SNOWY = 'SNOWY',
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

export enum CardKind {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
  MAGIC = 'MAGIC',
  SUPPORT = 'SUPPORT',
  SPECIAL = 'SPECIAL'
}
export type CardType = CardKind;

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
  REGEN = 'REGEN',
  REGENERATION = 'REGENERATION',
  POISON = 'POISON',
  BURN = 'BURN',
  FREEZE = 'FREEZE',
  STUN = 'STUN',
  CURSE = 'CURSE',
  BLESS = 'BLESS',
  RAGE = 'RAGE',
  PURIFY = 'PURIFY',
  PARALYZE = 'PARALYZE',
  STRENGTHEN = 'STRENGTHEN',
  WEAKEN = 'WEAKEN'
}

export const ELEMENTS: ElementKind[] = Object.values(ElementKind);
export const CARD_TYPES: CardType[] = Object.values(CardKind);
export const CARD_RARITIES: CardRarity[] = Object.values(CardRarity);
export const STATUS_EFFECTS: StatusEffectType[] = Object.values(StatusEffectType);
export const WEATHER_TYPES: WeatherKind[] = Object.values(WeatherKind);
export const GAME_PHASES: GamePhase[] = Object.values(GamePhase);

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