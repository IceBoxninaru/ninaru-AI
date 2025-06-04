interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  reward: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  targetAudience?: {
    minRank?: number;
    maxRank?: number;
    region?: string[];
    interests?: string[];
  };
}

export class AdService {
  private ads: Advertisement[] = [
    {
      id: 'ad001',
      title: '新作カードパック「神々の黄昏」',
      description: '新たな神々が降臨！限定カードをゲットしよう！',
      imageUrl: '/assets/ads/gods-twilight.jpg',
      link: 'https://example.com/card-packs/gods-twilight',
      reward: 100,
      duration: 30,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-05-01'),
      targetAudience: {
        minRank: 10,
        interests: ['mythology', 'collection']
      }
    },
    {
      id: 'ad002',
      title: '公式大会「呪われた王座」開催！',
      description: '優勝賞金100万円！今すぐエントリー！',
      imageUrl: '/assets/ads/tournament.jpg',
      link: 'https://example.com/tournaments/cursed-throne',
      reward: 200,
      duration: 60,
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-04-30'),
      targetAudience: {
        minRank: 20,
        region: ['JP']
      }
    }
  ];

  private viewedAds: Map<string, Set<string>> = new Map(); // userId -> adIds

  getAdsForUser(userId: string, userRank: number, region: string): Advertisement[] {
    const now = new Date();
    const viewedAdIds = this.viewedAds.get(userId) || new Set();

    return this.ads.filter(ad => {
      // 期間チェック
      if (now < ad.startDate || now > ad.endDate) return false;

      // 既に視聴済みの広告は除外
      if (viewedAdIds.has(ad.id)) return false;

      // ターゲット条件チェック
      if (ad.targetAudience) {
        if (ad.targetAudience.minRank && userRank < ad.targetAudience.minRank) return false;
        if (ad.targetAudience.maxRank && userRank > ad.targetAudience.maxRank) return false;
        if (ad.targetAudience.region && !ad.targetAudience.region.includes(region)) return false;
      }

      return true;
    });
  }

  recordAdView(userId: string, adId: string): void {
    if (!this.viewedAds.has(userId)) {
      this.viewedAds.set(userId, new Set());
    }
    this.viewedAds.get(userId)!.add(adId);
  }

  getAdReward(adId: string): number {
    const ad = this.ads.find(a => a.id === adId);
    return ad ? ad.reward : 0;
  }

  addNewAd(ad: Advertisement): void {
    this.ads.push(ad);
  }

  removeExpiredAds(): void {
    const now = new Date();
    this.ads = this.ads.filter(ad => ad.endDate > now);
  }

  clearViewHistory(olderThan: Date): void {
    // 古い視聴履歴を削除
    for (const [userId, adIds] of this.viewedAds.entries()) {
      if (adIds.size === 0) {
        this.viewedAds.delete(userId);
      }
    }
  }
} 