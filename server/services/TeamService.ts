import { Player } from '../../shared/types/game.js';

export class TeamService {
  private readonly MAX_TEAMS = 3;
  private readonly MAX_PLAYERS_PER_TEAM = 3;

  assignTeams(players: Player[]): void {
    const playerCount = players.length;
    
    if (playerCount < 4) {
      throw new Error('チーム戦には最低4人のプレイヤーが必要です');
    }

    // チーム構成を決定
    const teamConfig = this.getTeamConfig(playerCount);
    let currentTeam = 0;
    let playersInCurrentTeam = 0;

    // プレイヤーをチームに割り当て
    players.forEach(player => {
      player.team = currentTeam;
      playersInCurrentTeam++;

      if (playersInCurrentTeam >= teamConfig[currentTeam]) {
        currentTeam++;
        playersInCurrentTeam = 0;
      }
    });
  }

  private getTeamConfig(playerCount: number): number[] {
    // プレイヤー数に応じたチーム構成を返す
    // 返り値は各チームの人数の配列
    switch (playerCount) {
      case 4:
        return [2, 2];
      case 5:
        return [2, 3];
      case 6:
        return [2, 2, 2];
      case 7:
        return [2, 2, 3];
      case 8:
        return [2, 3, 3];
      case 9:
        return [3, 3, 3];
      default:
        throw new Error('サポートされていないプレイヤー数です');
    }
  }

  isTeammate(player1: Player, player2: Player): boolean {
    return player1.team !== undefined && 
           player2.team !== undefined && 
           player1.team === player2.team;
  }

  getTeammates(player: Player, players: Player[]): Player[] {
    if (player.team === undefined) return [];
    return players.filter(p => p.id !== player.id && p.team === player.team);
  }

  getTeamHealth(team: number, players: Player[]): number {
    return players
      .filter(p => p.team === team)
      .reduce((total, p) => total + p.hp, 0);
  }

  getTeamFaith(team: number, players: Player[]): number {
    return players
      .filter(p => p.team === team)
      .reduce((total, p) => total + p.faith, 0);
  }

  distributeTeamReward(team: number, players: Player[], amount: number): void {
    const teamPlayers = players.filter(p => p.team === team);
    const sharePerPlayer = Math.floor(amount / teamPlayers.length);
    teamPlayers.forEach(player => {
      player.gold += sharePerPlayer;
    });
  }
} 