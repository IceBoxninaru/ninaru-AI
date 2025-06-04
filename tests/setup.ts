// テストのタイムアウトを設定
jest.setTimeout(10000);

// コンソール出力のモック化
global.console = {
  ...console,
  // テスト中のログ出力を抑制
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 