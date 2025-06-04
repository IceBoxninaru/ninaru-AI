# クロード王国 - オンラインカードゲーム

## 概要
クロード王国は、戦略性の高いオンラインカードゲームです。プレイヤーは様々な属性のカードを使用して対戦を行い、相手のHPを0にすることを目指します。

## 特徴
- 6つの属性（火・水・地・風・光・闇）
- 天候システムによる戦略性
- コンボシステム
- ステータス効果システム
- リプレイ機能

## 必要条件
- Node.js 18.0.0以上
- npm 8.0.0以上

## インストール方法
```bash
# リポジトリのクローン
git clone https://github.com/yourusername/claude-kingdom.git
cd claude-kingdom

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な設定を行う
```

## 開発環境での実行方法
```bash
# 開発サーバーの起動（クライアント＆サーバー）
npm run dev

# クライアントのみ起動
npm run dev:client

# サーバーのみ起動
npm run dev:server
```

## ビルドとデプロイ
```bash
# プロジェクトのビルド
npm run build

# ビルドしたプロジェクトのプレビュー
npm run preview
```

## テスト
```bash
# すべてのテストを実行
npm test

# テストカバレッジの確認
npm run test:coverage
```

## 環境変数
以下の環境変数を`.env`ファイルに設定してください：

- `PORT`: サーバーのポート番号（デフォルト: 3000）
- `CLIENT_URL`: クライアントのURL
- `NODE_ENV`: 実行環境（development/production）
- `DATABASE_URL`: データベースの接続URL（必要な場合）

## ディレクトリ構造
```
claude-kingdom/
├── client/          # フロントエンドのソースコード
├── server/          # バックエンドのソースコード
├── shared/          # 共有の型定義とユーティリティ
├── tests/           # テストファイル
└── scripts/         # ビルドスクリプトなど
```

## ライセンス
ISC License

## 作者
[Your Name]

## 貢献
1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成 
