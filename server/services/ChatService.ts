interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'global' | 'team' | 'private' | 'system';
  targetId?: string;
  isEmote?: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'global' | 'team' | 'private';
  members: Set<string>;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export class ChatService {
  private rooms: Map<string, ChatRoom> = new Map();
  private userRooms: Map<string, Set<string>> = new Map(); // userId -> roomIds
  private bannedWords: Set<string> = new Set(['NGワード1', 'NGワード2']);
  private mutedUsers: Map<string, Date> = new Map(); // userId -> muteEndTime
  private emotes: Map<string, string> = new Map([
    ['happy', '(^_^)'],
    ['sad', '(;_;)'],
    ['angry', '(｀Д´)'],
    ['surprise', '(ﾟДﾟ)'],
    ['love', '(｡♥‿♥｡)']
  ]);

  constructor() {
    // グローバルチャットルームを作成
    this.createRoom('global', 'グローバル', 'global');
  }

  createRoom(id: string, name: string, type: 'global' | 'team' | 'private'): ChatRoom {
    const room: ChatRoom = {
      id,
      name,
      type,
      members: new Set(),
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };
    this.rooms.set(id, room);
    return room;
  }

  joinRoom(userId: string, roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.members.add(userId);
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId)!.add(roomId);

    this.broadcastSystemMessage(roomId, `ユーザー ${userId} が参加しました`);
    return true;
  }

  leaveRoom(userId: string, roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.members.delete(userId);
    this.userRooms.get(userId)?.delete(roomId);

    this.broadcastSystemMessage(roomId, `ユーザー ${userId} が退出しました`);
    return true;
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): boolean {
    if (this.isUserMuted(message.userId)) return false;
    if (!this.isContentValid(message.content)) return false;

    const room = this.rooms.get(message.type === 'private' ? 
      this.getPrivateRoomId(message.userId, message.targetId!) :
      message.type === 'team' ? `team_${message.targetId}` : 'global'
    );
    if (!room) return false;

    const fullMessage: ChatMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date(),
      content: this.processMessageContent(message.content)
    };

    room.messages.push(fullMessage);
    room.lastActivity = fullMessage.timestamp;

    return true;
  }

  private isUserMuted(userId: string): boolean {
    const muteEndTime = this.mutedUsers.get(userId);
    if (!muteEndTime) return false;

    if (muteEndTime > new Date()) {
      return true;
    } else {
      this.mutedUsers.delete(userId);
      return false;
    }
  }

  private isContentValid(content: string): boolean {
    if (!content.trim()) return false;
    if (content.length > 1000) return false;
    
    // NGワードチェック
    for (const word of this.bannedWords) {
      if (content.toLowerCase().includes(word.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  private processMessageContent(content: string): string {
    // 絵文字の変換
    let processed = content;
    for (const [code, emote] of this.emotes.entries()) {
      processed = processed.replace(`:${code}:`, emote);
    }

    // URLの検出と装飾
    processed = processed.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    );

    return processed;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPrivateRoomId(userId1: string, userId2: string): string {
    return `private_${[userId1, userId2].sort().join('_')}`;
  }

  private broadcastSystemMessage(roomId: string, content: string): void {
    this.sendMessage({
      userId: 'system',
      username: 'System',
      content,
      type: 'system',
      targetId: roomId
    });
  }

  muteUser(userId: string, durationMinutes: number): void {
    this.mutedUsers.set(userId, new Date(Date.now() + durationMinutes * 60000));
    this.broadcastSystemMessage('global', `ユーザー ${userId} が${durationMinutes}分間ミュートされました`);
  }

  unmuteUser(userId: string): void {
    this.mutedUsers.delete(userId);
    this.broadcastSystemMessage('global', `ユーザー ${userId} のミュートが解除されました`);
  }

  getRoomMessages(roomId: string, limit: number = 50): ChatMessage[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return room.messages.slice(-limit);
  }

  getUserRooms(userId: string): ChatRoom[] {
    const roomIds = this.userRooms.get(userId);
    if (!roomIds) return [];
    return Array.from(roomIds)
      .map(id => this.rooms.get(id))
      .filter((room): room is ChatRoom => room !== undefined);
  }

  addEmote(code: string, emote: string): void {
    this.emotes.set(code, emote);
  }

  addBannedWord(word: string): void {
    this.bannedWords.add(word.toLowerCase());
  }

  removeBannedWord(word: string): void {
    this.bannedWords.delete(word.toLowerCase());
  }
} 