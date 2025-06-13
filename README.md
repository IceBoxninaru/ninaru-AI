# claude王国

## 概要
「claude王国」は、ゴシックホラーの雰囲気を持つテキストベースの対戦型カードゲームです。プレイヤーは呪術師となり、「瘴気」を資源として様々な呪いのカードを使い、相手の「正気度」を削りながら戦います。高速で戦略的なバトルが特徴のカードゲームです。

## 世界観
かつて栄華を誇ったclaude王国は、禁忌の呪術によって滅びました。その地には今も禍々しい瘴気が満ち、あらゆるものを蝕んでいます。呪いによって滅びたclaude王国の残滓に集う者たちは、更なる力を求め、互いに呪術を駆使して戦っています。

## ゲームの開始方法
1. **名前の入力**: あなたの呪術師としての名前を入力します
2. **ゲームモードの選択**: 通常、スピード、コンボの中から選びます
3. **対戦タイプの選択**: 
   - ソロモード: AIとの対戦
   - オンラインマルチ: 合言葉を決めて他のプレイヤーと対戦
4. **ゲーム開始**: 準備が整ったらゲームを開始します

## ゲームモード
- **通常モード**: オーソドックスな戦略重視の対戦
- **スピードモード**: 瘴気の回復が早く、手札も多く引ける高速バトル
- **コンボモード**: 連続でカードを使うほど効果がアップするコンボシステム

## 対戦タイプ
- **ソロモード**: AIと対戦する一人用モードです
- **オンラインマルチ**: 合言葉を共有することで、他のプレイヤーと対戦できます（開発中）

## ゲームの目的
相手プレイヤーの「正気度」を0にして勝利を収めましょう。

## ゲームの流れ
1. ゲームモードに応じた「正気度」と「瘴気」でゲームを開始します
2. 各ターンで以下の行動を行います：
   - 山札からカードを引く（スピードモードでは2枚）
   - 瘴気が最大値まで回復する（スピードモードではより早く増加）
   - 手札のカードをコストを支払ってプレイできる
   - ターン終了ボタンを押して相手のターンに移る
3. 相手の正気度が0になれば勝利です

## カードの種類
- **呪術**: 直接的な効果で相手にダメージを与えるカード
- **クリーチャー**: 場に残り続ける召喚された存在
- **遺物(アーティファクト)**: 持続的な効果を発揮する禁忌の品
- **策略**: 様々な戦術的効果を持つカード

## 特殊能力
- **腐敗**: このキーワードを持つカードは、使用した後もプレイヤーを蝕み続け、ターン終了時にダメージを与えます
- **使役**: この能力でクリーチャーを破壊した時、そのクリーチャーの亡骸をあなたの場に召喚します
- **速攻**: スピードモードで特に効果を発揮する、素早く使えるカード
- **コンボ値**: コンボモードで連続使用時に効果を発揮する値

## キーボードショートカット
- **スペースキー**: ターン終了
- **1～9**: 対応する位置のカードを使用
- **M**: ゲームモード切替
- **ESC**: ヘルプを閉じる

## プレイ方法
### ウェブブラウザでプレイ
1. ブラウザで`index.html`を開く
2. プレイヤー名を入力
3. 好みのゲームモードを選択
4. 対戦タイプを選択（オンラインの場合は合言葉を入力）
5. 「ゲーム開始」ボタンをクリック
6. カードをクリックして使用する（コストが支払える場合のみ使用可能）
7. ターン終了ボタンを押して次のターンに進む

### デスクトップアプリでプレイ
1. リリースページから対応OSのインストーラをダウンロード
2. インストールして起動
3. プレイヤー名を入力
4. 好みのゲームモードと対戦タイプを選択
5. カードをクリックまたはキーボードショートカットで使用
6. スペースキーでターン終了

## 高速バトルのコツ
- スピードモードでは瘴気の回復が早いため、毎ターン積極的にカードを使いましょう
- 「速攻」キーワードを持つカードは特に効果的です
- コンボモードでは連続でカードを使うことで威力が上がります
- キーボードショートカットを活用すると、より素早くプレイできます

## オンライン対戦について
- 現在のバージョンではオンライン対戦機能は模擬的なものとなっています
- 将来のアップデートで完全なオンライン対戦をサポート予定です
- オンライン対戦を選択して合言葉を入力することで、同じ合言葉を持つプレイヤー同士でマッチングされます

## 開発情報
- HTML/CSS/JavaScriptで実装
- Electronでデスクトップアプリ化

## Steam配布に向けた準備
### Steam配布のための要件
1. **Steamworks SDKの統合**: Steamのオーバーレイ、アチーブメント、クラウドセーブなどの機能を利用するためにSteamworks SDKの実装が必要です。
2. **ビルド設定**: Steam配布用のビルド設定（electron-builder.ymlファイル内）を調整します。
3. **Steam Partner Portalでの設定**: 
   - Steamパートナーアカウントの作成（$100の登録料が必要）
   - アプリケーションの登録とSteamApp IDの取得
   - ストアページの作成と必要な素材（スクリーンショット、トレーラー等）の準備
   - 審査用ビルドの提出と審査プロセスの完了

### 開発環境のセットアップ
```bash
# 依存関係のインストール
npm install

# 開発モードで実行
npm start

# 配布用ビルドの作成
npm run build
```

ビルドすると、`dist`フォルダに配布用のインストーラが生成されます。

---

*「claude王国」へようこそ…あなたの正気が尽きる前に、敵を倒せるだろうか？*
