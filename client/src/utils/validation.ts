export const validateGameId = (gameId: string): boolean => {
  // ゲームIDは英数字のみ、4-12文字
  return /^[a-zA-Z0-9]{4,12}$/.test(gameId);
};

export const validatePlayerName = (name: string): boolean => {
  // プレイヤー名は2-20文字、空白を含まない
  return name.trim().length >= 2 && name.trim().length <= 20 && !/\s/.test(name);
};

export const sanitizeInput = (input: string): string => {
  // XSS対策: HTMLタグと特殊文字をエスケープ
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}; 