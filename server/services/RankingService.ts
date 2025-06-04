interface RankingEntry {
  userId: string;
  username: string;
  rank: number;
  rating: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestWinStreak: number;
  seasonPoints: number;
  lastPlayed: Date;
}

interface SeasonInfo {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  rewards: {
    rank: number;
    rewards: {
      type: 'gold' | 'card' | 'title' | 'icon';
      id?: string;
      amount?: number;
    }[];
  }[];
}

export class RankingService {
  private rankings: Map<string, RankingEntry> = new Map();
  private seasonHistory: Map<number, Map<string, RankingEntry>> = new Map();
  
  private currentSeason: SeasonInfo = {
    id: 1,
    name: '呪われし王国の夜明け',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30'),
    rewards: [
      {
        rank: 1,
        rewards: [
          { type: 'gold', amount: 100000 },
          { type: 'card', id: 'leg_001' },
          { type: 'title', id: 'title_champion' },
          { type: 'icon', id: 'icon_crown' }
        ]
      },
      {
        rank: 2,
        rewards: [
          { type: 'gold', amount: 50000 },
          { type: 'card', id: 'rare_001' },
          { type: 'title', id: 'title_runner' }
        ]
      },
      {
        rank: 3,
        rewards: [
          { type: 'gold', amount: 30000 },
          { type: 'card', id: 'rare_002' }
        ]
      }
    ]
  };

  private readonly RATING_K_FACTOR = 32;
  private readonly INITIAL_RATING = 1500;
  private readonly RANKS = [
    { name: 'ブロンズ', threshold: 0 },
    { name: 'シルバー', threshold: 1200 },
    { name: 'ゴールド', threshold: 1500 },
    { name: 'プラチナ', threshold: 1800 },
    { name: 'ダイヤモンド', threshold: 2100 },
    { name: 'マスター', threshold: 2400 },
    { name: 'グランドマスター', threshold: 2700 }
  ];

  createRankingEntry(userId: string, username: string): RankingEntry {
    const entry: RankingEntry = {
      userId,
      username,
      rank: 0,
      rating: this.INITIAL_RATING,
      wins: 0,
      losses: 0,
      winStreak: 0,
      bestWinStreak: 0,
      seasonPoints: 0,
      lastPlayed: new Date()
    };
    this.rankings.set(userId, entry);
    return entry;
  }

  updateRating(winnerId: string, loserId: string): void {
    const winner = this.rankings.get(winnerId);
    const loser = this.rankings.get(loserId);
    if (!winner || !loser) return;

    // ELOレーティング計算
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
    const expectedLoser = 1 - expectedWinner;

    winner.rating += Math.round(this.RATING_K_FACTOR * (1 - expectedWinner));
    loser.rating += Math.round(this.RATING_K_FACTOR * (0 - expectedLoser));

    // 勝敗数更新
    winner.wins++;
    winner.winStreak++;
    winner.bestWinStreak = Math.max(winner.winStreak, winner.bestWinStreak);
    winner.seasonPoints += 10;

    loser.losses++;
    loser.winStreak = 0;
    loser.seasonPoints = Math.max(0, loser.seasonPoints - 5);

    // ランク更新
    this.updateRank(winner);
    this.updateRank(loser);

    // 最終プレイ時間更新
    const now = new Date();
    winner.lastPlayed = now;
    loser.lastPlayed = now;
  }

  private updateRank(entry: RankingEntry): void {
    for (let i = this.RANKS.length - 1; i >= 0; i--) {
      if (entry.rating >= this.RANKS[i].threshold) {
        entry.rank = i;
        break;
      }
    }
  }

  getTopPlayers(limit: number = 100): RankingEntry[] {
    return Array.from(this.rankings.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getPlayerRank(userId: string): RankingEntry | undefined {
    return this.rankings.get(userId);
  }

  getSeasonInfo(): SeasonInfo {
    return this.currentSeason;
  }

  endSeason(): void {
    // 現在のシーズンのランキングを保存
    this.seasonHistory.set(this.currentSeason.id, new Map(this.rankings));

    // 新しいシーズンの準備
    this.currentSeason = {
      id: this.currentSeason.id + 1,
      name: `シーズン ${this.currentSeason.id + 1}`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90日後
      rewards: this.currentSeason.rewards // 同じ報酬を継続
    };

    // レーティングのソフトリセット
    for (const entry of this.rankings.values()) {
      entry.rating = Math.round((entry.rating + this.INITIAL_RATING) / 2);
      entry.seasonPoints = 0;
      entry.winStreak = 0;
      this.updateRank(entry);
    }
  }

  getSeasonHistory(seasonId: number): Map<string, RankingEntry> | undefined {
    return this.seasonHistory.get(seasonId);
  }
} 