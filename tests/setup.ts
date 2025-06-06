import { jest } from '@jest/globals';

// テストのタイムアウトを設定
jest.setTimeout(10000);

// グローバルなモックの設定
global.console = {
  ...console,
  // テスト中のログ出力を抑制
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// setImmediateのポリフィル
if (!global.setImmediate) {
  const setImmediatePolyfill = (callback: () => void) => setTimeout(callback, 0);
  setImmediatePolyfill.__promisify__ = () => Promise.resolve();
  global.setImmediate = setImmediatePolyfill as typeof global.setImmediate;
}

// Jestのグローバル設定
global.expect = expect;
global.jest = jest; 