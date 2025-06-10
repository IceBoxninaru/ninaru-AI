// カードゲーム「claude王国」のゲームロジック - ハイスピードバージョン

// カードデータ - より強力な効果と多様性
const cards = [
    // 瘴気コスト付きの強力なカード
    { id: 1, name: "魂喰らいの呪い", type: "呪術", cost: 2, effect: "相手に4ダメージを与え、自分は1回復する。", keyword: "", comboValue: 2 },
    { id: 8, name: "死者の囁き", type: "呪術", cost: 5, effect: "相手に7ダメージを与える。このカードは山札に戻る。", keyword: "", comboValue: 4 },
    { id: 11, name: "瞬間消滅", type: "呪術", cost: 1, effect: "相手に2ダメージ。コンボ中なら4ダメージ。", keyword: "速攻", comboValue: 2 },
    { id: 12, name: "連鎖呪縛", type: "呪術", cost: 3, effect: "相手に3ダメージ。コンボ値+3で追加カードを引く。", keyword: "", comboValue: 3 },
    { id: 15, name: "魔力爆発", type: "呪術", cost: 4, effect: "現在のコンボ値×2のダメージを与える。", keyword: "", comboValue: 0 },
    { id: 5, name: "禁忌の書物", type: "遺物", cost: 4, effect: "各ターンの開始時、追加で瘴気1を得る。", keyword: "腐敗 1", comboValue: 3 },
    { id: 7, name: "闇の契約", type: "策略", cost: 2, effect: "山札から呪術カードを1枚手札に加える。自分は2ダメージを受ける。", keyword: "", comboValue: 2 },
    
    // 瘴気コスト0の物理攻撃カード（基本的な攻撃）
    { id: 16, name: "素早い一撃", type: "物理", cost: 0, effect: "相手に1ダメージを与える。", keyword: "速攻", comboValue: 1 },
    { id: 17, name: "突撃", type: "物理", cost: 0, effect: "相手に2ダメージを与える。", keyword: "", comboValue: 1 },
    { id: 18, name: "防御姿勢", type: "物理", cost: 0, effect: "次のターン、受けるダメージを1減少させる。", keyword: "", comboValue: 1 },
    { id: 19, name: "戦術的後退", type: "物理", cost: 0, effect: "カードを1枚引く。", keyword: "", comboValue: 1 },
    
    // 瘴気コスト少なめの基本カード
    { id: 2, name: "彷徨う骸骨", type: "クリーチャー", cost: 1, effect: "パワー1/タフネス1", keyword: "", comboValue: 1 },
    { id: 3, name: "血の取引", type: "策略", cost: 0, effect: "自分の正気度を3失う。カードを2枚引く。", keyword: "腐敗 1", comboValue: 3 },
    { id: 4, name: "王家の指輪", type: "遺物", cost: 3, effect: "あなたのクリーチャーはパワー+1の修正を受ける。", keyword: "", comboValue: 2 },
    { id: 6, name: "魂の牢獄", type: "呪術", cost: 3, effect: "相手のクリーチャー1体を破壊する。", keyword: "使役", comboValue: 2 },
    { id: 9, name: "亡霊の侍女", type: "クリーチャー", cost: 2, effect: "パワー2/タフネス1。プレイした時、カードを1枚引く。", keyword: "", comboValue: 2 },
    { id: 10, name: "呪われた鎧", type: "遺物", cost: 2, effect: "あなたが受けるダメージを1減少させる。", keyword: "腐敗 2", comboValue: 2 },
    { id: 14, name: "狂気の刻印", type: "遺物", cost: 1, effect: "毎ターン終了時にコンボ値が+1される。", keyword: "", comboValue: 1 },
    
    // 瘴気コスト高めの強力な物理カード
    { id: 20, name: "致命的一撃", type: "物理", cost: 3, effect: "相手に5ダメージを与える。", keyword: "", comboValue: 2 },
    { id: 21, name: "連続攻撃", type: "物理", cost: 2, effect: "相手に2ダメージを2回与える。", keyword: "", comboValue: 3 },
    { id: 22, name: "猛攻", type: "物理", cost: 4, effect: "相手に6ダメージを与える。次のターン、自分は2ダメージを受ける。", keyword: "", comboValue: 4 },
    
    // 回復カード（コスト0）
    { id: 23, name: "小休止", type: "回復", cost: 0, effect: "正気度を3回復する。", keyword: "", comboValue: 1 },
    { id: 24, name: "浅い瞑想", type: "回復", cost: 0, effect: "瘴気を3回復する。", keyword: "", comboValue: 1 },
    { id: 25, name: "応急手当", type: "回復", cost: 0, effect: "正気度を5回復する。瘴気を1消費する。", keyword: "", comboValue: 1 },
    
    // 回復カード（コスト低め）
    { id: 26, name: "癒しの光", type: "回復", cost: 1, effect: "正気度を8回復する。", keyword: "", comboValue: 2 },
    { id: 27, name: "瘴気集中", type: "回復", cost: 1, effect: "瘴気を8回復する。", keyword: "", comboValue: 2 },
    { id: 28, name: "生命の雫", type: "回復", cost: 2, effect: "正気度を12回復する。", keyword: "", comboValue: 2 },
    
    // 回復カード（コスト高め・強力）
    { id: 29, name: "生命湧出", type: "回復", cost: 3, effect: "正気度を20回復する。", keyword: "", comboValue: 3 },
    { id: 30, name: "魔力解放", type: "回復", cost: 3, effect: "瘴気を20回復する。", keyword: "", comboValue: 3 },
    { id: 31, name: "再生", type: "回復", cost: 4, effect: "正気度を10、瘴気を10回復する。", keyword: "", comboValue: 3 },
    { id: 32, name: "魂の復活", type: "回復", cost: 5, effect: "正気度を15回復する。", keyword: "", comboValue: 4 },
    
    // 特殊回復カード
    { id: 33, name: "生命と魔力の交換", type: "回復", cost: 0, effect: "正気度を10失い、瘴気を8得る。", keyword: "", comboValue: 2 },
    { id: 34, name: "魔力と生命の交換", type: "回復", cost: 0, effect: "瘴気を10失い、正気度を8得る。", keyword: "", comboValue: 2 },
];

// ゲームモード
const gameModes = {
    normal: {
        name: '通常モード',
        description: 'オーソドックスな戦略重視の対戦',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 1,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 1,
        comboEnabled: false
    },
    speed: {
        name: 'スピードモード',
        description: '瘴気の回復が早く、手札も多く引ける高速バトル',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 2,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 2,
        comboEnabled: false
    },
    combo: {
        name: 'コンボモード',
        description: '連続でカードを使うほど効果がアップする',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 1,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 1,
        comboEnabled: true
    }
};

// ゲーム状態
const gameState = {
    turn: 1,
    playerHP: 35,
    playerMaxHP: 100,
    playerMaxMP: 100,
    playerCurrentMP: 10,
    playerHand: [],
    playerDeck: [],
    playerDiscard: [],
    enemyHP: 35,
    enemyMaxHP: 100,
    enemyMaxMP: 100,
    enemyCurrentMP: 10,
    enemyHand: [],
    enemyDeck: [],
    enemyDiscard: [],
    selectedCardId: null,
    effects: [],
    mode: 'normal',
    playerCombo: 0,
    enemyCombo: 0,
    costReduction: 0,
    comboBonus: 0,
    maxHand: 12,
    drawPerTurn: 1
};

// DOM要素の参照
let playerHandElement;
let enemyHandElement;
let playerHPBar;
let playerMPBar;
let enemyHPBar;
let enemyMPBar;
let playerHPValue;
let playerMPValue;
let enemyHPValue;
let enemyMPValue;
let playerNameDisplayElement;
let enemyNameElement;
let handCountElement;
let maxHandElement;
let endTurnButton;
let helpButton;
let closeHelpButton;
let gameLogElement;
let startScreen;
let gameContainer;
let playerNameInput;
let roomCodeInput;
let roomCodeContainer;
let startGameButton;
let normalModeOption;
let speedModeOption;
let comboModeOption;
let soloTypeOption;
let onlineTypeOption;
let currentModeDisplayElement;
let keyboardShortcutsModal;
let comboDisplayElement;
let modeOptionCards;
let gameTypeOptions;
let logMessagesElement;

// オンラインプレイヤーの模擬データ（実際の実装では、サーバーからデータを取得）
const onlinePlayers = [
    { id: 1, name: "プレイヤー1", hp: 20, maxHp: 25, mp: 2, maxMp: 3 },
    { id: 2, name: "プレイヤー2", hp: 15, maxHp: 25, mp: 1, maxMp: 3 },
    { id: 3, name: "プレイヤー3", hp: 22, maxHp: 25, mp: 3, maxMp: 3 }
];

// プレイヤーリストDOM要素
let playersListElement;
let playerListItemsElement;

// DOMが読み込まれたときの初期化
document.addEventListener('DOMContentLoaded', () => {
    // スタート画面の要素
    startScreen = document.getElementById('start-screen');
    gameContainer = document.getElementById('game-container');
    playerNameInput = document.getElementById('player-name');
    startGameButton = document.getElementById('start-game-button');
    modeOptionCards = document.querySelectorAll('.mode-option-card');
    gameTypeOptions = document.querySelectorAll('.game-type-option');
    roomCodeContainer = document.getElementById('room-code-container');
    roomCodeInput = document.getElementById('room-code');
    
    // ゲーム画面の要素
    playerHandElement = document.getElementById('player-hand');
    enemyHandElement = document.getElementById('enemy-hand');
    endTurnButton = document.getElementById('end-turn-button');
    logMessagesElement = document.getElementById('log-messages');
    gameLogElement = document.getElementById('game-log');
    helpButton = document.getElementById('help-button');
    closeHelpButton = document.getElementById('close-help-button');
    keyboardShortcutsModal = document.getElementById('keyboard-shortcuts-modal');
    
    // ステータス表示要素
    playerHPBar = document.getElementById('player-hp-bar');
    playerMPBar = document.getElementById('player-mp-bar');
    enemyHPBar = document.getElementById('enemy-hp-bar');
    enemyMPBar = document.getElementById('enemy-mp-bar');
    playerHPValue = document.getElementById('player-hp-value');
    playerMPValue = document.getElementById('player-mp-value');
    enemyHPValue = document.getElementById('enemy-hp-value');
    enemyMPValue = document.getElementById('enemy-mp-value');
    
    // 名前表示と手札情報
    playerNameDisplayElement = document.getElementById('player-name-display');
    enemyNameElement = document.getElementById('enemy-name');
    handCountElement = document.getElementById('hand-count');
    maxHandElement = document.getElementById('max-hand');
    
    // ゲームモード関連
    currentModeDisplayElement = document.getElementById('current-mode-display');
    normalModeOption = document.querySelector('[data-mode="normal"]');
    speedModeOption = document.querySelector('[data-mode="speed"]');
    comboModeOption = document.querySelector('[data-mode="combo"]');
    soloTypeOption = document.querySelector('[data-type="solo"]');
    onlineTypeOption = document.querySelector('[data-type="online"]');
    
    // プレイヤーリスト要素
    playersListElement = document.getElementById('players-list');
    playerListItemsElement = document.getElementById('player-list-items');
    
    // コンボ表示要素を作成
    comboDisplayElement = document.createElement('div');
    comboDisplayElement.id = 'combo-display';
    comboDisplayElement.style.display = 'none';
    if (document.getElementById('player-area')) {
        document.getElementById('player-area').appendChild(comboDisplayElement);
    }
    
    // モード選択の処理
    modeOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            // 全てのカードから選択クラスを削除
            modeOptionCards.forEach(c => c.classList.remove('selected'));
            // クリックされたカードに選択クラスを追加
            card.classList.add('selected');
            // ゲームモードを設定
            gameState.mode = card.dataset.mode;
        });
    });
    
    // 対戦タイプの処理
    gameTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 全てのオプションから選択クラスを削除
            gameTypeOptions.forEach(o => o.classList.remove('selected'));
            // クリックされたオプションに選択クラスを追加
            option.classList.add('selected');
            // ゲームタイプを設定
            gameState.gameType = option.dataset.type;
            
            // オンラインモードの場合、部屋コード入力を表示
            if (option.dataset.type === 'online') {
                roomCodeContainer.classList.remove('hidden');
            } else {
                roomCodeContainer.classList.add('hidden');
            }
        });
    });
    
    // ゲーム開始ボタンの処理
    startGameButton.addEventListener('click', () => {
        // プレイヤー名のバリデーション
        const playerName = playerNameInput.value.trim();
        if (playerName === '') {
            // エラーのビジュアルフィードバック
            playerNameInput.classList.add('error');
            
            // エラーメッセージ要素があれば表示、なければ作成
            let errorElement = document.getElementById('player-name-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = 'player-name-error';
                errorElement.className = 'error-message visible';
                errorElement.textContent = '名前を入力してください';
                playerNameInput.parentNode.appendChild(errorElement);
            } else {
                errorElement.classList.add('visible');
            }
            
            // フォーカスを入力フィールドに戻す
            playerNameInput.focus();
            return;
        } else {
            // エラー表示を削除
            playerNameInput.classList.remove('error');
            const errorElement = document.getElementById('player-name-error');
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
        }
        
        // オンラインモードの場合は部屋コードも必要
        if (gameState.gameType === 'online') {
            const roomCode = roomCodeInput.value.trim();
            if (roomCode === '') {
                // エラーのビジュアルフィードバック
                roomCodeInput.classList.add('error');
                
                // エラーメッセージ要素があれば表示、なければ作成
                let errorElement = document.getElementById('room-code-error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = 'room-code-error';
                    errorElement.className = 'error-message visible';
                    errorElement.textContent = '部屋の合言葉を入力してください';
                    roomCodeInput.parentNode.appendChild(errorElement);
                } else {
                    errorElement.classList.add('visible');
                }
                
                // フォーカスを入力フィールドに戻す
                roomCodeInput.focus();
                return;
            } else {
                // エラー表示を削除
                roomCodeInput.classList.remove('error');
                const errorElement = document.getElementById('room-code-error');
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
            }
            gameState.roomCode = roomCode;
        }
        
        // プレイヤー名を設定
        gameState.playerName = playerName;
        
        // プレイヤー名を表示に設定
        playerNameDisplayElement.textContent = gameState.playerName;
        
        // スタート画面を非表示にし、ゲーム画面を表示
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // ゲームを初期化
        initGame();
    });
    
    // 入力フィールドのエラークリア
    playerNameInput.addEventListener('input', () => {
        playerNameInput.classList.remove('error');
        const errorElement = document.getElementById('player-name-error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    });
    
    roomCodeInput.addEventListener('input', () => {
        roomCodeInput.classList.remove('error');
        const errorElement = document.getElementById('room-code-error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    });
    
    // ターン終了ボタンの処理
    if (endTurnButton) {
        endTurnButton.addEventListener('click', endTurn);
    }
    
    // ヘルプボタンの処理
    if (helpButton) {
        helpButton.addEventListener('click', () => {
            keyboardShortcutsModal.classList.remove('hidden');
        });
    }
    
    // ヘルプを閉じるボタンの処理
    if (closeHelpButton) {
        closeHelpButton.addEventListener('click', () => {
            keyboardShortcutsModal.classList.add('hidden');
        });
    }
    
    // キーボードショートカット
    document.addEventListener('keydown', (event) => {
        // ゲーム開始後のみキーボードショートカットを有効化
        if (gameContainer.classList.contains('hidden')) {
            return;
        }
        
        // ESCキーでヘルプを閉じる
        if (event.key === 'Escape') {
            keyboardShortcutsModal.classList.add('hidden');
            return;
        }
        
        // ヘルプモーダルが表示されている場合は他のショートカットを無効化
        if (!keyboardShortcutsModal.classList.contains('hidden')) {
            return;
        }
        
        // スペースキーでターン終了
        if (event.key === ' ' || event.key === 'Spacebar') {
            if (endTurnButton && !endTurnButton.disabled) {
                endTurn();
            }
            event.preventDefault();
            return;
        }
        
        // 数字キーでカード選択
        if (/^[1-9]$/.test(event.key)) {
            const index = parseInt(event.key) - 1;
            const cardElements = playerHandElement.querySelectorAll('.card');
            if (index < cardElements.length) {
                cardElements[index].click();
            }
            return;
        }
    });
});

// 初期化関数
function initGame() {
    try {
        console.log("ゲーム初期化開始");
        
        // ゲームモードの設定
        setupGameMode(gameState.mode);
        
        // モード表示の更新
        updateModeDisplay();
        
        // カードデッキの初期化
        gameState.playerDeck = [];
        gameState.enemyDeck = [];
        
        // すべてのカードをデッキに追加
        cards.forEach(card => {
            gameState.playerDeck.push(card.id);
            gameState.enemyDeck.push(card.id);
        });
        
        console.log(`デッキ初期化: ${gameState.playerDeck.length}枚のカード`);
        
        // デッキのシャッフル
        shuffle(gameState.playerDeck);
        shuffle(gameState.enemyDeck);
        
        // 初期手札を配る
        const modeConfig = gameModes[gameState.mode];
        gameState.playerHand = [];
        gameState.enemyHand = [];
        
        console.log(`初期手札枚数: ${modeConfig.initialHandSize}枚`);
        
        // プレイヤーの初期手札
        for (let i = 0; i < modeConfig.initialHandSize; i++) {
            if (gameState.playerDeck.length > 0) {
                const cardId = gameState.playerDeck.shift();
                gameState.playerHand.push(cardId);
                console.log(`プレイヤー初期手札に追加: カードID ${cardId}`);
            }
        }
        
        console.log(`初期手札配布完了: ${gameState.playerHand.length}枚`);
        
        // 敵の初期手札
        for (let i = 0; i < modeConfig.initialHandSize; i++) {
            if (gameState.enemyDeck.length > 0) {
                gameState.enemyHand.push(gameState.enemyDeck.shift());
            }
        }
        
        // コンボモードの場合は初期コンボ値を0に設定
        if (gameState.mode === 'combo') {
            gameState.playerCombo = 0;
        }
        
        // 最初のターンをプレイヤーのターンに設定
        gameState.turn = 1;
        gameState.isPlayerTurn = true;
        
        // UIの更新
        updateUI();
        
        // ゲームログを初期化
        addLogMessage('ゲームを開始しました。');
        addLogMessage(`【${modeConfig.name}】 - ${modeConfig.description}`);
        addLogMessage('あなたのターンです。');
        
        // カード説明を表示
        addLogMessage('【カード説明】');
        addLogMessage('・左上の青い数字: カードコスト（使用に必要な瘴気の量）');
        addLogMessage('・右上のオレンジ色の数字: コンボ値（コンボモード時に効果が上昇）');
        addLogMessage('・カードをクリックして選択、ダブルクリックで使用できます');
        addLogMessage('・カードを使用すると自動的にターンが終了します');
        
        // オンラインモードの場合はプレイヤーリストを表示
        if (gameState.gameType === 'online') {
            showPlayersList();
        }
    } catch (error) {
        console.error("ゲーム初期化中にエラーが発生しました:", error);
        alert("ゲームの初期化中にエラーが発生しました。ページを再読み込みしてください。");
    }
}

// ゲームモード設定
function setupGameMode(mode) {
    const modeConfig = gameModes[mode];
    gameState.playerHP = modeConfig.initialHP;
    gameState.playerMaxHP = modeConfig.maxHP;
    gameState.playerMaxMP = modeConfig.maxMP;
    gameState.playerCurrentMP = modeConfig.initialMP;
    gameState.enemyHP = modeConfig.initialHP;
    gameState.enemyMaxHP = modeConfig.maxHP;
    gameState.enemyMaxMP = modeConfig.maxMP;
    gameState.enemyCurrentMP = modeConfig.initialMP;
    gameState.maxHand = modeConfig.maxHandSize;
    gameState.drawPerTurn = modeConfig.drawPerTurn;
}

// UI更新関数
function updateUI() {
    // 手札を更新
    updateHand();
    
    // HPとMPの表示を更新
    updateStatusBars();
    
    // コンボ表示
    if (gameModes[gameState.mode].comboEnabled) {
        comboDisplayElement.textContent = `コンボ: ${gameState.playerCombo}`;
        comboDisplayElement.style.display = 'block';
    } else {
        comboDisplayElement.style.display = 'none';
    }
    
    // ゲームモード表示の更新
    updateModeDisplay();
}

// 手札更新関数
function updateHand() {
    if (!playerHandElement) {
        console.error("プレイヤーの手札要素が見つかりません");
        // 要素を再取得してみる
        playerHandElement = document.getElementById('player-hand');
        if (!playerHandElement) {
            console.error("再取得してもプレイヤーの手札要素が見つかりません");
            return;
        }
    }
    
    console.log("手札更新開始", gameState.playerHand);
    
    // 既存の手札をクリア
    playerHandElement.innerHTML = '';
    
    // 手札情報の表示を更新
    const infoElement = document.createElement('div');
    infoElement.className = 'hand-info';
    infoElement.textContent = `手札: ${gameState.playerHand.length}/${gameModes[gameState.mode].maxHandSize}`;
    playerHandElement.appendChild(infoElement);
    
    // 各カードを表示
    if (gameState.playerHand.length === 0) {
        const emptyHandMsg = document.createElement('div');
        emptyHandMsg.className = 'empty-hand-message';
        emptyHandMsg.textContent = "手札がありません。ターンを終了すると新しいカードを引きます。";
        playerHandElement.appendChild(emptyHandMsg);
        console.log("空の手札メッセージを表示");
    } else {
        let displayedCards = 0;
        gameState.playerHand.forEach((cardId, index) => {
            const card = cards.find(c => c.id === cardId);
            if (card) {
                const cardElement = createCardElement(card);
                playerHandElement.appendChild(cardElement);
                displayedCards++;
            } else {
                console.error(`ID ${cardId} のカードが見つかりません (手札インデックス: ${index})`);
            }
        });
        console.log(`${displayedCards}枚のカードを表示しました`);
    }
    
    // 手札カウントを更新
    if (handCountElement && maxHandElement) {
        handCountElement.textContent = gameState.playerHand.length;
        maxHandElement.textContent = gameModes[gameState.mode].maxHandSize;
    }
    
    // カード使用ボタンの追加
    const useCardButton = document.createElement('button');
    useCardButton.className = 'card-use-button';
    useCardButton.textContent = 'カードを使用';
    useCardButton.disabled = !gameState.selectedCardId;
    useCardButton.addEventListener('click', () => {
        if (gameState.selectedCardId) {
            playSelectedCard();
        } else {
            addLogMessage("使用するカードを選択してください。");
        }
    });
    playerHandElement.appendChild(useCardButton);
}

// ステータスバー更新
function updateStatusBars() {
    // プレイヤーのHP表示（数値のみ）
    playerHPValue.textContent = `${gameState.playerHP} / ${gameModes[gameState.mode].maxHP}`;
    
    // プレイヤーのMP表示（数値のみ）
    playerMPValue.textContent = `${gameState.playerCurrentMP} / ${gameState.playerMaxMP}`;
    
    // 敵のHP表示（数値のみ）
    enemyHPValue.textContent = `${gameState.enemyHP} / ${gameModes[gameState.mode].maxHP}`;
    
    // 敵のMP表示（数値のみ）
    enemyMPValue.textContent = `${gameState.enemyCurrentMP} / ${gameState.enemyMaxMP}`;
    
    // 手札情報の更新
    if (handCountElement && maxHandElement) {
        handCountElement.textContent = gameState.playerHand.length;
        maxHandElement.textContent = gameModes[gameState.mode].maxHandSize;
    }
    
    // ステータスバーの視覚的更新
    if (playerHPBar) {
        const hpPercentage = (gameState.playerHP / gameModes[gameState.mode].maxHP) * 100;
        playerHPBar.style.width = `${Math.max(0, hpPercentage)}%`;
    }
    
    if (playerMPBar) {
        const mpPercentage = (gameState.playerCurrentMP / gameState.playerMaxMP) * 100;
        playerMPBar.style.width = `${Math.max(0, mpPercentage)}%`;
    }
    
    if (enemyHPBar) {
        const enemyHpPercentage = (gameState.enemyHP / gameModes[gameState.mode].maxHP) * 100;
        enemyHPBar.style.width = `${Math.max(0, enemyHpPercentage)}%`;
    }
    
    if (enemyMPBar) {
        const enemyMpPercentage = (gameState.enemyCurrentMP / gameState.enemyMaxMP) * 100;
        enemyMPBar.style.width = `${Math.max(0, enemyMpPercentage)}%`;
    }
}

// カードを選択する
function selectCard(cardId) {
    // 既に選択されている場合は選択解除
    if (gameState.selectedCardId === cardId) {
        gameState.selectedCardId = null;
        
        // 選択解除の視覚的表示
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 実行ボタンを非表示
        const playButton = document.getElementById('play-card-button');
        if (playButton) {
            playButton.style.display = 'none';
        }
        
        return;
    }
    
    // 新しいカードを選択
    gameState.selectedCardId = cardId;
    
    // 全てのカードから選択状態を解除
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 選択されたカードを強調表示
    const selectedCardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    if (selectedCardElement) {
        selectedCardElement.classList.add('selected');
    }
    
    // 実行ボタンを表示
    const playButton = document.getElementById('play-card-button');
    if (playButton) {
        playButton.style.display = 'block';
        
        // ボタンクリックでカードを使用
        playButton.onclick = () => {
            playCard(cardId);
            // 選択状態をリセット
            gameState.selectedCardId = null;
            playButton.style.display = 'none';
        };
    }
}

// ログメッセージ追加関数
function addLogMessage(message) {
    // ログ配列に追加
    gameState.log.push(message);
    
    // DOM更新
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logMessagesElement.appendChild(logEntry);
    
    // 自動スクロール
    logMessagesElement.scrollTop = logMessagesElement.scrollHeight;
    
    // スピードモードでは古いログを削除
    if (gameState.mode === 'speed' && logMessagesElement.children.length > 10) {
        logMessagesElement.removeChild(logMessagesElement.children[0]);
    }
}

// 特殊効果の処理
function processEndTurnEffects() {
    // 特殊効果があれば処理
    if (gameState.effects && gameState.effects.length > 0) {
        const activeEffects = [...gameState.effects];
        
        activeEffects.forEach(effect => {
            // 効果のタイプによって処理を分岐
            if (effect.type === 'comboGrowth') {
                gameState.playerCombo += effect.value;
                addLogMessage(`狂気の刻印により、コンボ値が${effect.value}増加した！(${gameState.playerCombo})`);
            } else if (effect.type === 'corruption') {
                gameState.playerHP -= effect.value;
                addLogMessage(`腐敗効果により、正気度が${effect.value}減少した。`);
            } else if (effect.type === 'mpGrowth') {
                gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + effect.value);
                addLogMessage(`瘴気増加効果により、瘴気が${effect.value}増えた。`);
            }
        });
        
        // 持続時間を減少させ、期限切れの効果を削除
        gameState.effects = gameState.effects.filter(effect => {
            if (effect.duration > 0) {
                effect.duration--;
            }
            return effect.duration > 0 || effect.duration === -1; // -1は永続効果
        });
    }
}

// ターン開始時の効果処理
function processTurnStartEffects() {
    // 特殊効果があれば処理
    if (gameState.effects && gameState.effects.length > 0) {
        const activeEffects = [...gameState.effects];
        
        activeEffects.forEach(effect => {
            // 効果のタイプによって処理を分岐
            if (effect.type === 'selfDamage') {
                gameState.playerHP -= effect.value;
                addLogMessage(`反動効果により、${effect.value}ダメージを受けた。`);
            }
        });
        
        // 持続時間を減少させ、期限切れの効果を削除
        gameState.effects = gameState.effects.filter(effect => {
            if (effect.duration > 0) {
                effect.duration--;
            }
            return effect.duration > 0 || effect.duration === -1; // -1は永続効果
        });
    }
}

// 特殊効果の追加
function addEffect(type, value, duration, name) {
    if (!gameState.effects) {
        gameState.effects = [];
    }
    
    // 同じ種類の効果がすでにある場合は上書き
    const existingIndex = gameState.effects.findIndex(e => e.type === type);
    if (existingIndex !== -1) {
        gameState.effects[existingIndex].value = value;
        gameState.effects[existingIndex].duration = duration;
        gameState.effects[existingIndex].name = name;
    } else {
        // 新しい効果を追加
        gameState.effects.push({
            type: type,
            value: value,
            duration: duration,
            name: name
        });
    }
    
    addLogMessage(`「${name}」の効果が発動した！`);
}

// 特殊効果の値を取得
function getEffectValue(type) {
    if (!gameState.effects) return 0;
    
    const effect = gameState.effects.find(e => e.type === type);
    return effect ? effect.value : 0;
}

// ゲームオーバー処理
function gameOver(isWin) {
    // ゲーム終了メッセージ
    if (isWin) {
        addLogMessage("勝利！ あなたは呪いに打ち勝った！");
    } else {
        addLogMessage("敗北... あなたは呪いに飲み込まれた...");
    }
    
    // カードボタンを無効化
    disableCardButtons();
    
    // ターン終了ボタンを無効化
    endTurnButton.disabled = true;
    
    // リプレイボタン追加
    addReplayButton();
    
    // モード変更ボタン追加
    addModeChangeButton();
}

// リプレイボタン追加
function addReplayButton() {
    const replayButton = document.createElement('button');
    replayButton.id = 'replay-button';
    replayButton.classList.add('game-button');
    replayButton.textContent = '再戦';
    replayButton.addEventListener('click', resetGame);
    
    // ボタンエリアに追加
    const buttonArea = document.querySelector('.button-area');
    buttonArea.appendChild(replayButton);
}

// モード変更ボタン追加
function addModeChangeButton() {
    const modeButton = document.createElement('button');
    modeButton.id = 'mode-button';
    modeButton.classList.add('game-button');
    modeButton.textContent = 'モード変更';
    
    modeButton.addEventListener('click', () => {
        // モードを切り替え
        const modes = Object.keys(gameModes);
        const currentIndex = modes.indexOf(gameState.mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        gameState.mode = modes[nextIndex];
        
        // ゲームをリセット
        resetGame();
    });
    
    // ボタンエリアに追加
    const buttonArea = document.querySelector('.button-area');
    buttonArea.appendChild(modeButton);
}

// カードボタンを無効化
function disableCardButtons() {
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.disabled = true;
    });
}

// カードボタンを有効化
function enableCardButtons() {
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.disabled = false;
    });
}

// ゲームリセット
function resetGame() {
    // ゲーム状態のリセット
    const modeConfig = gameModes[gameState.mode];
    gameState.turn = 1;
    gameState.playerHP = modeConfig.initialHP;
    gameState.playerMaxMP = modeConfig.maxMP;
    gameState.playerCurrentMP = modeConfig.initialMP;
    gameState.enemyHP = modeConfig.initialHP;
    gameState.enemyMaxMP = modeConfig.maxMP;
    gameState.enemyCurrentMP = modeConfig.initialMP;
    gameState.playerCombo = 0;
    gameState.enemyCombo = 0;
    gameState.effects = [];
    gameState.selectedCardId = null;
    
    // デッキと手札をリセット
    const allCards = cards.map(card => card.id);
    gameState.playerDeck = [...allCards];
    shuffle(gameState.playerDeck);
    
    // 初期手札を配る
    gameState.playerHand = [];
    const initialHandSize = modeConfig.initialHandSize || 9; // 初期手札のデフォルト値を9に
    for (let i = 0; i < initialHandSize; i++) {
        if (gameState.playerDeck.length > 0) {
            gameState.playerHand.push(gameState.playerDeck.shift());
        }
    }
    
    // ログをクリア
    gameState.log = ["claude王国へようこそ…"];
    logMessagesElement.innerHTML = '';
    addLogMessage(`${gameState.playerName}よ、新たな対戦が始まった…`);
    addLogMessage(`【${gameModes[gameState.mode].name}】 - ${gameModes[gameState.mode].description}`);
    
    if (gameState.gameType === 'online') {
        addLogMessage(`合言葉「${gameState.roomCode}」の部屋で対戦します。`);
    } else {
        addLogMessage("瘴気が満ちる王国で、あなたの戦いが始まる。");
    }
    
    // UI更新
    updateUI();
    
    // 追加したボタンを削除
    const replayButton = document.getElementById('replay-button');
    if (replayButton) replayButton.remove();
    
    const modeButton = document.getElementById('mode-button');
    if (modeButton) modeButton.remove();
    
    // ボタンを有効化
    endTurnButton.disabled = false;
}

// ゲームモード切り替え
function toggleGameMode() {
    const modes = Object.keys(gameModes);
    const currentIndex = modes.indexOf(gameState.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    gameState.mode = modes[nextIndex];
    
    addLogMessage(`ゲームモードを【${gameModes[gameState.mode].name}】に変更しました。`);
    resetGame();
    
    // モード表示を更新
    updateModeDisplay();
}

// ゲームモード表示を更新
function updateModeDisplay() {
    if (!currentModeDisplayElement) return;
    
    // モード名を取得
    const modeName = gameModes[gameState.mode].name || "通常モード";
    
    // 表示を更新
    currentModeDisplayElement.textContent = modeName;
    
    // モードツールチップのアクティブ状態を更新
    document.querySelectorAll('#mode-tooltip .mode-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const activeOption = document.getElementById(`${gameState.mode}-mode`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
}

// ヘルプモーダルの表示/非表示
function toggleHelpModal() {
    keyboardShortcutsModal.classList.toggle('hidden');
}

// 配列をシャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// イベントリスナーのセットアップ
function setupEventListeners() {
    try {
        // ターン終了ボタン
        endTurnButton.addEventListener('click', endTurn);
        
        // ヘルプボタン
        helpButton.addEventListener('click', toggleHelpModal);
        
        // ヘルプを閉じるボタン
        closeHelpButton.addEventListener('click', toggleHelpModal);
        
        // ゲームモードインジケータ
        document.getElementById('game-mode-indicator').addEventListener('click', function(event) {
            // ツールチップの表示中にクリックした場合のみモード切替
            if (event.target.classList.contains('mode-option')) {
                const clickedMode = event.target.id.replace('-mode', '');
                if (gameState.mode !== clickedMode) {
                    gameState.mode = clickedMode;
                    addLogMessage(`ゲームモードを【${gameModes[gameState.mode].name}】に変更しました。`);
                    resetGame();
                    updateModeDisplay();
                }
            }
        });
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            // ESCキーでヘルプを閉じる
            if (e.key === 'Escape' && !keyboardShortcutsModal.classList.contains('hidden')) {
                toggleHelpModal();
                return;
            }
            
            // モーダルが表示されている間は他のショートカットを無効化
            if (!keyboardShortcutsModal.classList.contains('hidden')) {
                return;
            }
            
            // スペースキーでターン終了
            if (e.code === 'Space' && !endTurnButton.disabled) {
                e.preventDefault();
                endTurn();
            }
            
            // Mキーでゲームモード切替
            if (e.key === 'm' || e.key === 'M') {
                toggleGameMode();
            }
            
            // 数字キーでカード選択（1〜9）
            const numKey = parseInt(e.key);
            if (!isNaN(numKey) && numKey >= 1 && numKey <= 9) {
                const index = numKey - 1;
                if (index < gameState.playerHand.length) {
                    const cardId = gameState.playerHand[index];
                    // 直接playCardを呼ばずに選択状態を切り替える
                    selectCard(cardId);
                }
            }
        });
        
        // カードがプレイされた時のエフェクト
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('card-button') && !event.target.disabled) {
                event.target.classList.add('card-playing');
                // アニメーション後にクラスを削除
                setTimeout(() => {
                    event.target.classList.remove('card-playing');
                }, 500);
            }
        });
    } catch (error) {
        console.error("イベントリスナーの設定中にエラーが発生しました:", error);
    }
}

// カード要素を作成する関数
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.cardId = card.id;
    cardElement.dataset.cardType = card.type;
    
    // カードのプレイ可能状態を確認
    const isPlayable = card.cost <= gameState.playerCurrentMP;
    if (!isPlayable) {
        cardElement.classList.add('unplayable');
    }
    
    // カード名
    const nameElement = document.createElement('div');
    nameElement.className = 'card-name';
    nameElement.textContent = card.name;
    cardElement.appendChild(nameElement);
    
    // カードタイプ
    const typeElement = document.createElement('div');
    typeElement.className = 'card-type';
    typeElement.textContent = card.type;
    cardElement.appendChild(typeElement);
    
    // コスト表示
    const costElement = document.createElement('div');
    costElement.className = 'card-cost';
    costElement.textContent = card.cost;
    cardElement.appendChild(costElement);
    
    // コンボ値表示
    const comboElement = document.createElement('div');
    comboElement.className = 'card-combo';
    comboElement.textContent = card.comboValue;
    cardElement.appendChild(comboElement);
    
    // カード効果
    const effectElement = document.createElement('div');
    effectElement.className = 'card-effect';
    effectElement.textContent = card.effect;
    cardElement.appendChild(effectElement);
    
    // キーワード能力
    if (card.keyword) {
        const keywordElement = document.createElement('div');
        keywordElement.className = 'card-keyword';
        keywordElement.textContent = card.keyword;
        cardElement.appendChild(keywordElement);
    }
    
    // シングルクリックでカード選択
    cardElement.addEventListener('click', () => {
        // コストが足りない場合は選択できない
        if (!isPlayable) {
            addLogMessage(`「${card.name}」は瘴気が足りません (コスト: ${card.cost})`);
            return;
        }
        
        // 選択状態を切り替え
        selectCard(card.id);
    });
    
    return cardElement;
}

// 選択したカードをプレイする関数
function playSelectedCard() {
    if (gameState.selectedCardId !== null) {
        // カードを使用
        playCard(gameState.selectedCardId);
        // 選択をリセット
        gameState.selectedCardId = null;
        // 手札の表示を更新
        updateHand();
    } else {
        addLogMessage("使用するカードを選択してください。");
    }
}

// カードをプレイする
function playCard(cardId) {
    // 選択されたカードを探す
    const cardIndex = gameState.playerHand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
        addLogMessage('カードが見つかりません');
        return;
    }
    
    const card = gameState.playerHand[cardIndex];
    
    // コストチェック
    if (card.cost > gameState.playerCurrentMP) {
        addLogMessage(`瘴気が足りません！ 必要: ${card.cost}, 現在: ${gameState.playerCurrentMP}`);
        return;
    }
    
    // コンボチェック・更新
    if (gameModes[gameState.mode].comboEnabled) {
        gameState.playerCombo++;
        updateComboDisplay();
    }
    
    // MPを減らす
    gameState.playerCurrentMP -= card.cost;
    
    // カード効果を適用
    addLogMessage(`[${gameState.turn}ターン] 「${card.name}」をプレイしました`);
    
    // カードタイプによる処理分岐
    if (card.type === "物理" || card.type === "呪術") {
        // 攻撃カード効果
        applyAttackCardEffect(card);
    } else if (card.type === "回復") {
        // 回復カード効果
        applyHealCardEffect(card);
    } else {
        // その他のカード効果（クリーチャー、遺物、策略）
        applyOtherCardEffect(card);
    }
    
    // カードをプレイ後、手札から削除
    gameState.playerHand.splice(cardIndex, 1);
    
    // 勝敗チェック
    checkWinCondition();
    
    // 表示更新
    updateGameDisplay();
    
    // 自動的にターンを終了する（簡略化のため）
    // 実際のゲームでは、複数のカードを連続して使えるようにする
    endPlayerTurn();
}

// 攻撃カードの効果を適用
function applyAttackCardEffect(card) {
    let damage = 0;
    
    // コンボ対応カードの処理
    if (card.id === 11) { // 瞬間消滅
        damage = gameState.playerCombo > 1 ? 4 : 2;
    } else if (card.id === 15) { // 魔力爆発
        damage = gameState.playerCombo * 2;
    } else if (card.id === 1) { // 魂喰らいの呪い
        damage = 4;
        // 回復効果も適用
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + 1);
        addLogMessage(`+1 正気度を回復しました`);
    } else if (card.id === 8) { // 死者の囁き
        damage = 7;
        // 山札に戻る効果
        gameState.playerDeck.push(card);
        addLogMessage(`「${card.name}」は山札に戻りました`);
    } else if (card.id === 12) { // 連鎖呪縛
        damage = 3;
        // カードを引く効果も適用
        if (gameState.playerCombo >= 3) {
            drawCards(1);
            addLogMessage(`コンボ効果: カードを1枚引きました`);
        }
    } else if (card.id === 21) { // 連続攻撃
        // 2回ダメージを与える
        damage = 2;
        gameState.enemyHP -= damage;
        addLogMessage(`敵に${damage}ダメージを与えました`);
        damage = 2; // 2回目のダメージ
    } else {
        // その他の攻撃カードの基本効果
        // カードの効果文からダメージ値を抽出
        const damageMatch = card.effect.match(/(\d+)ダメージ/);
        if (damageMatch) {
            damage = parseInt(damageMatch[1]);
        } else {
            // デフォルトダメージ
            damage = 1;
        }
    }
    
    // ダメージ適用
    gameState.enemyHP -= damage;
    addLogMessage(`敵に${damage}ダメージを与えました`);
}

// 回復カードの効果を適用
function applyHealCardEffect(card) {
    if (card.id === 23) { // 小休止
        const healAmount = 3;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 24) { // 浅い瞑想
        const mpHealAmount = 3;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 25) { // 応急手当
        const healAmount = 5;
        const mpCost = 1;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        gameState.playerCurrentMP = Math.max(0, gameState.playerCurrentMP - mpCost);
        addLogMessage(`正気度を${healAmount}回復し、瘴気を${mpCost}消費しました`);
    } else if (card.id === 26) { // 癒しの光
        const healAmount = 8;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 27) { // 瘴気集中
        const mpHealAmount = 8;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 28) { // 生命の雫
        const healAmount = 12;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 29) { // 生命湧出
        const healAmount = 20;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 30) { // 魔力解放
        const mpHealAmount = 20;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 31) { // 再生
        const healAmount = 10;
        const mpHealAmount = 10;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`正気度を${healAmount}、瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 32) { // 魂の復活
        const healAmount = 30;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 33) { // 生命と魔力の交換
        const hpLoss = 10;
        const mpGain = 15;
        gameState.playerHP = Math.max(1, gameState.playerHP - hpLoss);
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpGain);
        addLogMessage(`正気度を${hpLoss}失い、瘴気を${mpGain}得ました`);
    } else if (card.id === 34) { // 魔力と生命の交換
        const mpLoss = 10;
        const hpGain = 15;
        gameState.playerCurrentMP = Math.max(0, gameState.playerCurrentMP - mpLoss);
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + hpGain);
        addLogMessage(`瘴気を${mpLoss}失い、正気度を${hpGain}得ました`);
    } else if (card.id === 35) { // 完全回復
        const healToFull = gameState.playerMaxHP - gameState.playerHP;
        gameState.playerHP = gameState.playerMaxHP;
        addLogMessage(`正気度を${healToFull}回復し、最大まで回復しました`);
    }
}

// その他のカード効果を適用
function applyOtherCardEffect(card) {
    // カードIDによって異なる効果を適用
    if (card.id === 3) { // 血の取引
        gameState.playerHP = Math.max(1, gameState.playerHP - 3);
        addLogMessage(`正気度を3失いました`);
        drawCards(2);
        addLogMessage(`カードを2枚引きました`);
    } else if (card.id === 7) { // 闇の契約
        // 山札から呪術カードを1枚手札に追加
        const spellCards = gameState.playerDeck.filter(c => c.type === "呪術");
        if (spellCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * spellCards.length);
            const spellCard = spellCards[randomIndex];
            // 山札から削除して手札に追加
            gameState.playerDeck = gameState.playerDeck.filter(c => c !== spellCard);
            gameState.playerHand.push(spellCard);
            addLogMessage(`「${spellCard.name}」を山札から手札に加えました`);
        } else {
            addLogMessage(`山札に呪術カードがありません`);
        }
        
        // ダメージ効果
        gameState.playerHP = Math.max(1, gameState.playerHP - 2);
        addLogMessage(`自分に2ダメージを受けました`);
    } else if (card.id === 13) { // 時間加速
        // このターン、カードコストが1減少する効果を付与
        gameState.costReduction = 1;
        addLogMessage(`このターン、カードコストが1減少します`);
    } else if (card.id === 14) { // 狂気の刻印
        // 毎ターン終了時にコンボ値が+1される効果を付与
        gameState.comboBonus = 1;
        addLogMessage(`毎ターン終了時にコンボ値が+1されます`);
    } else if (card.id === 19) { // 戦術的後退
        drawCards(1);
        addLogMessage(`カードを1枚引きました`);
    } else {
        // その他のカード効果はここに追加
        addLogMessage(`「${card.name}」の効果が発動しました`);
    }
}

// ターン終了処理
function endTurn() {
    // ターン数を増やす
    gameState.turn++;
    
    // 特殊効果の処理
    processEndTurnEffects();
    
    // 敵のターン処理（簡易AI）
    processEnemyTurn();
    
    // 新しいターン開始処理
    startNewTurn();
}

// 敵のターン処理（簡易AI）
function processEnemyTurn() {
    // 瘴気の回復前の値を保存
    const previousMP = gameState.enemyCurrentMP;
    
    // 敵のMPを回復
    gameState.enemyCurrentMP = Math.min(gameState.enemyMaxMP, gameState.enemyCurrentMP + gameModes[gameState.mode].mpRegenRate);
    
    // 瘴気回復のログ表示
    if (gameState.enemyCurrentMP > previousMP) {
        const mpGain = gameState.enemyCurrentMP - previousMP;
        addLogMessage(`敵の瘴気が${mpGain}回復した。(${previousMP} → ${gameState.enemyCurrentMP})`);
    }
    
    // 敵のカード使用シミュレーション
    // 瘴気を使用するかどうかランダムに決定
    const useMP = gameState.enemyCurrentMP > 0 && Math.random() > 0.3;
    
    let damage = 0;
    
    if (useMP) {
        // 瘴気を使った強力な攻撃（2〜3の瘴気を消費）
        const mpCost = Math.min(gameState.enemyCurrentMP, Math.floor(Math.random() * 2) + 2);
        gameState.enemyCurrentMP -= mpCost;
        
        // ダメージ計算（瘴気を使うと強い）
        damage = mpCost * 2 + Math.floor(Math.random() * 3);
        
        addLogMessage(`敵が瘴気を${mpCost}消費して強力な攻撃を仕掛けてきた！`);
    } else {
        // 通常攻撃（瘴気を使わない）
        damage = Math.floor(Math.random() * 3) + 1; // 1〜3のダメージ
        addLogMessage(`敵が通常攻撃を仕掛けてきた。`);
    }
    
    // ダメージ軽減効果があれば適用
    const damageReduction = getEffectValue('damageReduction') || 0;
    if (damageReduction > 0) {
        const originalDamage = damage;
        damage = Math.max(1, damage - damageReduction);
        addLogMessage(`ダメージ軽減効果により、ダメージが${originalDamage}から${damage}に減少した。`);
    }
    
    // プレイヤーにダメージを与える
    gameState.playerHP -= damage;
    
    // ダメージを表示
    addLogMessage(`あなたに${damage}ダメージ！`);
    
    // プレイヤーの負け判定
    if (gameState.playerHP <= 0) {
        gameOver(false);
        return;
    }
    
    // 敵の瘴気状態をログに表示
    addLogMessage(`敵の瘴気: ${gameState.enemyCurrentMP}/${gameState.enemyMaxMP}`);
    
    // UI更新
    updateUI();
}

// 新しいターン開始処理
function startNewTurn() {
    gameState.isPlayerTurn = true;
    
    // ターン開始時のMP回復
    const mpRegen = gameModes[gameState.mode].mpRegenRate || 1;
    gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpRegen);
    
    // ターン開始時の効果処理
    processTurnStartEffects();
    
    // 効果の持続時間減少と期限切れチェック
    gameState.effects = gameState.effects.filter(effect => {
        effect.duration--;
        return effect.duration > 0 || effect.duration === -1; // 永続効果(-1)は残す
    });
    
    // カードを引く
    const drawCount = gameModes[gameState.mode].drawPerTurn || 1;
    drawCards(drawCount);
    
    // 手札が少ない場合は追加でカードを引く（最低3枚は確保）
    const minHandSize = 3;
    if (gameState.playerHand.length < minHandSize) {
        const additionalCards = minHandSize - gameState.playerHand.length;
        addLogMessage(`手札が少ないため、追加で${additionalCards}枚引きます。`);
        drawCards(additionalCards);
    }
    
    // UIを更新
    updateUI();
    
    // ログにメッセージを追加
    addLogMessage(`ターン${gameState.turn}：あなたのターンです。`);
    
    // ステータス効果のメッセージ
    if (gameState.effects.length > 0) {
        const effectMessages = gameState.effects.map(e => {
            const duration = e.duration === -1 ? "永続" : `残り${e.duration}ターン`;
            return `${e.name}(${duration})`;
        });
        addLogMessage(`有効な効果：${effectMessages.join(', ')}`);
    }
}

// カードを引く関数
function drawCards(count) {
    const maxHandSize = gameModes[gameState.mode].maxHandSize;
    let cardsDrawn = 0;
    
    for (let i = 0; i < count; i++) {
        // 手札がいっぱいならこれ以上引かない
        if (gameState.playerHand.length >= maxHandSize) {
            addLogMessage(`手札がいっぱいです（最大${maxHandSize}枚）。`);
            break;
        }
        
        // デッキが空なら再構築
        if (gameState.playerDeck.length === 0) {
            reshufflePlayerDeck();
        }
        
        // カードを引く
        if (gameState.playerDeck.length > 0) {
            const cardId = gameState.playerDeck.shift();
            gameState.playerHand.push(cardId);
            cardsDrawn++;
        }
    }
    
    if (cardsDrawn > 0) {
        addLogMessage(`カードを${cardsDrawn}枚引きました。`);
    }
    
    // 手札の更新
    updateHand();
}

// プレイヤーデッキを再構築する
function reshufflePlayerDeck() {
    addLogMessage("デッキが空になりました。新しいデッキを構築します...");
    
    // 新しいデッキを作成
    gameState.playerDeck = [];
    cards.forEach(card => {
        gameState.playerDeck.push(card.id);
    });
    
    // シャッフル
    shuffle(gameState.playerDeck);
    addLogMessage("デッキをリセットしました。");
}

// 勝敗条件をチェックする関数
function checkWinCondition() {
    if (gameState.enemyHP <= 0) {
        // プレイヤーの勝利
        addLogMessage(`敵の正気度が0になりました！あなたの勝利です！`);
        gameOver(true);
        return true;
    } else if (gameState.playerHP <= 0) {
        // プレイヤーの敗北
        addLogMessage(`あなたの正気度が0になりました！あなたの敗北です...`);
        gameOver(false);
        return true;
    }
    return false;
}

// コンボ表示を更新する関数
function updateComboDisplay() {
    const comboElement = document.getElementById('combo-display');
    if (comboElement) {
        if (gameState.playerCombo > 1) {
            comboElement.textContent = `コンボ: ${gameState.playerCombo}`;
            comboElement.style.display = 'block';
            
            // アニメーション効果
            comboElement.classList.add('combo-flash');
            setTimeout(() => {
                comboElement.classList.remove('combo-flash');
            }, 500);
        } else {
            comboElement.style.display = 'none';
        }
    }
}

// プレイヤーデッキを再構築する
function reshufflePlayerDeck() {
    addLogMessage("デッキが空になりました。新しいデッキを構築します...");
    
    // 新しいデッキを作成
    gameState.playerDeck = [];
    cards.forEach(card => {
        gameState.playerDeck.push(card.id);
    });
    
    // シャッフル
    shuffle(gameState.playerDeck);
    addLogMessage("デッキをリセットしました。");
}

// プレイヤーのターン終了処理
function endPlayerTurn() {
    // 特殊効果の処理（例：毎ターン終了時のコンボ増加）
    if (gameState.comboBonus > 0) {
        gameState.playerCombo += gameState.comboBonus;
        addLogMessage(`コンボボーナス効果: コンボ値が${gameState.comboBonus}増加しました (現在: ${gameState.playerCombo})`);
        updateComboDisplay();
    }
    
    // ターンを敵に移す
    addLogMessage(`ターン終了：${gameState.turn}ターン目`);
    
    // 敵のターン処理を実行
    setTimeout(() => {
        enemyTurn();
    }, 1000);
}

// ゲーム表示の更新
function updateGameDisplay() {
    // ステータスバーの更新
    updateStatusBars();
    
    // 手札の表示更新
    updateHandDisplay();
    
    // コンボ表示の更新
    if (gameModes[gameState.mode].comboEnabled) {
        updateComboDisplay();
    }
    
    // アニメーション効果
    const gameboardElement = document.querySelector('.game-board');
    if (gameboardElement) {
        gameboardElement.classList.add('update-effect');
        setTimeout(() => {
            gameboardElement.classList.remove('update-effect');
        }, 300);
    }
}

// ゲームUIの初期化
function initGameUI() {
    // ヘルプボタン
    const helpButton = document.getElementById('help-button');
    const closeHelpButton = document.getElementById('close-help-button');
    const helpModal = document.getElementById('keyboard-shortcuts-modal');
    
    if (helpButton && closeHelpButton && helpModal) {
        helpButton.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
        });
        
        closeHelpButton.addEventListener('click', () => {
            helpModal.classList.add('hidden');
        });
    }
    
    // ターン終了ボタン
    const endTurnButton = document.getElementById('end-turn-button');
    if (endTurnButton) {
        endTurnButton.addEventListener('click', () => {
            endPlayerTurn();
        });
    }
}

// ゲームUIの初期化
initGameUI();
    
    // ゲームUIの初期化
    initGameUI();
// カードゲーム「claude王国」のゲームロジック - ハイスピードバージョン

// カードデータ - より強力な効果と多様性
const cards = [
    // 瘴気コスト付きの強力なカード
    { id: 1, name: "魂喰らいの呪い", type: "呪術", cost: 2, effect: "相手に4ダメージを与え、自分は1回復する。", keyword: "", comboValue: 2 },
    { id: 8, name: "死者の囁き", type: "呪術", cost: 5, effect: "相手に7ダメージを与える。このカードは山札に戻る。", keyword: "", comboValue: 4 },
    { id: 11, name: "瞬間消滅", type: "呪術", cost: 1, effect: "相手に2ダメージ。コンボ中なら4ダメージ。", keyword: "速攻", comboValue: 2 },
    { id: 12, name: "連鎖呪縛", type: "呪術", cost: 3, effect: "相手に3ダメージ。コンボ値+3で追加カードを引く。", keyword: "", comboValue: 3 },
    { id: 15, name: "魔力爆発", type: "呪術", cost: 4, effect: "現在のコンボ値×2のダメージを与える。", keyword: "", comboValue: 0 },
    { id: 5, name: "禁忌の書物", type: "遺物", cost: 4, effect: "各ターンの開始時、追加で瘴気1を得る。", keyword: "腐敗 1", comboValue: 3 },
    { id: 7, name: "闇の契約", type: "策略", cost: 2, effect: "山札から呪術カードを1枚手札に加える。自分は2ダメージを受ける。", keyword: "", comboValue: 2 },
    
    // 瘴気コスト0の物理攻撃カード（基本的な攻撃）
    { id: 16, name: "素早い一撃", type: "物理", cost: 0, effect: "相手に1ダメージを与える。", keyword: "速攻", comboValue: 1 },
    { id: 17, name: "突撃", type: "物理", cost: 0, effect: "相手に2ダメージを与える。", keyword: "", comboValue: 1 },
    { id: 18, name: "防御姿勢", type: "物理", cost: 0, effect: "次のターン、受けるダメージを1減少させる。", keyword: "", comboValue: 1 },
    { id: 19, name: "戦術的後退", type: "物理", cost: 0, effect: "カードを1枚引く。", keyword: "", comboValue: 1 },
    
    // 瘴気コスト少なめの基本カード
    { id: 2, name: "彷徨う骸骨", type: "クリーチャー", cost: 1, effect: "パワー1/タフネス1", keyword: "", comboValue: 1 },
    { id: 3, name: "血の取引", type: "策略", cost: 0, effect: "自分の正気度を3失う。カードを2枚引く。", keyword: "腐敗 1", comboValue: 3 },
    { id: 4, name: "王家の指輪", type: "遺物", cost: 3, effect: "あなたのクリーチャーはパワー+1の修正を受ける。", keyword: "", comboValue: 2 },
    { id: 6, name: "魂の牢獄", type: "呪術", cost: 3, effect: "相手のクリーチャー1体を破壊する。", keyword: "使役", comboValue: 2 },
    { id: 9, name: "亡霊の侍女", type: "クリーチャー", cost: 2, effect: "パワー2/タフネス1。プレイした時、カードを1枚引く。", keyword: "", comboValue: 2 },
    { id: 10, name: "呪われた鎧", type: "遺物", cost: 2, effect: "あなたが受けるダメージを1減少させる。", keyword: "腐敗 2", comboValue: 2 },
    { id: 14, name: "狂気の刻印", type: "遺物", cost: 1, effect: "毎ターン終了時にコンボ値が+1される。", keyword: "", comboValue: 1 },
    
    // 瘴気コスト高めの強力な物理カード
    { id: 20, name: "致命的一撃", type: "物理", cost: 3, effect: "相手に5ダメージを与える。", keyword: "", comboValue: 2 },
    { id: 21, name: "連続攻撃", type: "物理", cost: 2, effect: "相手に2ダメージを2回与える。", keyword: "", comboValue: 3 },
    { id: 22, name: "猛攻", type: "物理", cost: 4, effect: "相手に6ダメージを与える。次のターン、自分は2ダメージを受ける。", keyword: "", comboValue: 4 },
    
    // 回復カード（コスト0）
    { id: 23, name: "小休止", type: "回復", cost: 0, effect: "正気度を3回復する。", keyword: "", comboValue: 1 },
    { id: 24, name: "浅い瞑想", type: "回復", cost: 0, effect: "瘴気を3回復する。", keyword: "", comboValue: 1 },
    { id: 25, name: "応急手当", type: "回復", cost: 0, effect: "正気度を5回復する。瘴気を1消費する。", keyword: "", comboValue: 1 },
    
    // 回復カード（コスト低め）
    { id: 26, name: "癒しの光", type: "回復", cost: 1, effect: "正気度を8回復する。", keyword: "", comboValue: 2 },
    { id: 27, name: "瘴気集中", type: "回復", cost: 1, effect: "瘴気を8回復する。", keyword: "", comboValue: 2 },
    { id: 28, name: "生命の雫", type: "回復", cost: 2, effect: "正気度を12回復する。", keyword: "", comboValue: 2 },
    
    // 回復カード（コスト高め・強力）
    { id: 29, name: "生命湧出", type: "回復", cost: 3, effect: "正気度を20回復する。", keyword: "", comboValue: 3 },
    { id: 30, name: "魔力解放", type: "回復", cost: 3, effect: "瘴気を20回復する。", keyword: "", comboValue: 3 },
    { id: 31, name: "再生", type: "回復", cost: 4, effect: "正気度を10、瘴気を10回復する。", keyword: "", comboValue: 3 },
    { id: 32, name: "魂の復活", type: "回復", cost: 5, effect: "正気度を15回復する。", keyword: "", comboValue: 4 },
    
    // 特殊回復カード
    { id: 33, name: "生命と魔力の交換", type: "回復", cost: 0, effect: "正気度を10失い、瘴気を8得る。", keyword: "", comboValue: 2 },
    { id: 34, name: "魔力と生命の交換", type: "回復", cost: 0, effect: "瘴気を10失い、正気度を8得る。", keyword: "", comboValue: 2 },
];

// ゲームモード
const gameModes = {
    normal: {
        name: '通常モード',
        description: 'オーソドックスな戦略重視の対戦',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 1,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 1,
        comboEnabled: false
    },
    speed: {
        name: 'スピードモード',
        description: '瘴気の回復が早く、手札も多く引ける高速バトル',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 2,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 2,
        comboEnabled: false
    },
    combo: {
        name: 'コンボモード',
        description: '連続でカードを使うほど効果がアップする',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 1,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 1,
        comboEnabled: true
    }
};

// ゲーム状態
const gameState = {
    turn: 1,
    playerHP: 35,
    playerMaxHP: 100,
    playerMaxMP: 100,
    playerCurrentMP: 10,
    playerHand: [],
    playerDeck: [],
    playerDiscard: [],
    enemyHP: 35,
    enemyMaxHP: 100,
    enemyMaxMP: 100,
    enemyCurrentMP: 10,
    enemyHand: [],
    enemyDeck: [],
    enemyDiscard: [],
    selectedCardId: null,
    effects: [],
    mode: 'normal',
    playerCombo: 0,
    enemyCombo: 0,
    costReduction: 0,
    comboBonus: 0,
    maxHand: 12,
    drawPerTurn: 1
};

// DOM要素の参照
let playerHandElement;
let enemyHandElement;
let playerHPBar;
let playerMPBar;
let enemyHPBar;
let enemyMPBar;
let playerHPValue;
let playerMPValue;
let enemyHPValue;
let enemyMPValue;
let playerNameDisplayElement;
let enemyNameElement;
let handCountElement;
let maxHandElement;
let endTurnButton;
let helpButton;
let closeHelpButton;
let gameLogElement;
let startScreen;
let gameContainer;
let playerNameInput;
let roomCodeInput;
let roomCodeContainer;
let startGameButton;
let normalModeOption;
let speedModeOption;
let comboModeOption;
let soloTypeOption;
let onlineTypeOption;
let currentModeDisplayElement;
let keyboardShortcutsModal;
let comboDisplayElement;
let modeOptionCards;
let gameTypeOptions;
let logMessagesElement;

// オンラインプレイヤーの模擬データ（実際の実装では、サーバーからデータを取得）
const onlinePlayers = [
    { id: 1, name: "プレイヤー1", hp: 20, maxHp: 25, mp: 2, maxMp: 3 },
    { id: 2, name: "プレイヤー2", hp: 15, maxHp: 25, mp: 1, maxMp: 3 },
    { id: 3, name: "プレイヤー3", hp: 22, maxHp: 25, mp: 3, maxMp: 3 }
];

// プレイヤーリストDOM要素
let playersListElement;
let playerListItemsElement;

// DOMが読み込まれたときの初期化
document.addEventListener('DOMContentLoaded', () => {
    // スタート画面の要素
    startScreen = document.getElementById('start-screen');
    gameContainer = document.getElementById('game-container');
    playerNameInput = document.getElementById('player-name');
    startGameButton = document.getElementById('start-game-button');
    modeOptionCards = document.querySelectorAll('.mode-option-card');
    gameTypeOptions = document.querySelectorAll('.game-type-option');
    roomCodeContainer = document.getElementById('room-code-container');
    roomCodeInput = document.getElementById('room-code');
    
    // ゲーム画面の要素
    playerHandElement = document.getElementById('player-hand');
    enemyHandElement = document.getElementById('enemy-hand');
    endTurnButton = document.getElementById('end-turn-button');
    logMessagesElement = document.getElementById('log-messages');
    gameLogElement = document.getElementById('game-log');
    helpButton = document.getElementById('help-button');
    closeHelpButton = document.getElementById('close-help-button');
    keyboardShortcutsModal = document.getElementById('keyboard-shortcuts-modal');
    
    // ステータス表示要素
    playerHPBar = document.getElementById('player-hp-bar');
    playerMPBar = document.getElementById('player-mp-bar');
    enemyHPBar = document.getElementById('enemy-hp-bar');
    enemyMPBar = document.getElementById('enemy-mp-bar');
    playerHPValue = document.getElementById('player-hp-value');
    playerMPValue = document.getElementById('player-mp-value');
    enemyHPValue = document.getElementById('enemy-hp-value');
    enemyMPValue = document.getElementById('enemy-mp-value');
    
    // 名前表示と手札情報
    playerNameDisplayElement = document.getElementById('player-name-display');
    enemyNameElement = document.getElementById('enemy-name');
    handCountElement = document.getElementById('hand-count');
    maxHandElement = document.getElementById('max-hand');
    
    // ゲームモード関連
    currentModeDisplayElement = document.getElementById('current-mode-display');
    normalModeOption = document.querySelector('[data-mode="normal"]');
    speedModeOption = document.querySelector('[data-mode="speed"]');
    comboModeOption = document.querySelector('[data-mode="combo"]');
    soloTypeOption = document.querySelector('[data-type="solo"]');
    onlineTypeOption = document.querySelector('[data-type="online"]');
    
    // プレイヤーリスト要素
    playersListElement = document.getElementById('players-list');
    playerListItemsElement = document.getElementById('player-list-items');
    
    // コンボ表示要素を作成
    comboDisplayElement = document.createElement('div');
    comboDisplayElement.id = 'combo-display';
    comboDisplayElement.style.display = 'none';
    if (document.getElementById('player-area')) {
        document.getElementById('player-area').appendChild(comboDisplayElement);
    }
    
    // モード選択の処理
    modeOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            // 全てのカードから選択クラスを削除
            modeOptionCards.forEach(c => c.classList.remove('selected'));
            // クリックされたカードに選択クラスを追加
            card.classList.add('selected');
            // ゲームモードを設定
            gameState.mode = card.dataset.mode;
        });
    });
    
    // 対戦タイプの処理
    gameTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 全てのオプションから選択クラスを削除
            gameTypeOptions.forEach(o => o.classList.remove('selected'));
            // クリックされたオプションに選択クラスを追加
            option.classList.add('selected');
            // ゲームタイプを設定
            gameState.gameType = option.dataset.type;
            
            // オンラインモードの場合、部屋コード入力を表示
            if (option.dataset.type === 'online') {
                roomCodeContainer.classList.remove('hidden');
            } else {
                roomCodeContainer.classList.add('hidden');
            }
        });
    });
    
    // ゲーム開始ボタンの処理
    startGameButton.addEventListener('click', () => {
        // プレイヤー名のバリデーション
        const playerName = playerNameInput.value.trim();
        if (playerName === '') {
            // エラーのビジュアルフィードバック
            playerNameInput.classList.add('error');
            
            // エラーメッセージ要素があれば表示、なければ作成
            let errorElement = document.getElementById('player-name-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = 'player-name-error';
                errorElement.className = 'error-message visible';
                errorElement.textContent = '名前を入力してください';
                playerNameInput.parentNode.appendChild(errorElement);
            } else {
                errorElement.classList.add('visible');
            }
            
            // フォーカスを入力フィールドに戻す
            playerNameInput.focus();
            return;
        } else {
            // エラー表示を削除
            playerNameInput.classList.remove('error');
            const errorElement = document.getElementById('player-name-error');
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
        }
        
        // オンラインモードの場合は部屋コードも必要
        if (gameState.gameType === 'online') {
            const roomCode = roomCodeInput.value.trim();
            if (roomCode === '') {
                // エラーのビジュアルフィードバック
                roomCodeInput.classList.add('error');
                
                // エラーメッセージ要素があれば表示、なければ作成
                let errorElement = document.getElementById('room-code-error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = 'room-code-error';
                    errorElement.className = 'error-message visible';
                    errorElement.textContent = '部屋の合言葉を入力してください';
                    roomCodeInput.parentNode.appendChild(errorElement);
                } else {
                    errorElement.classList.add('visible');
                }
                
                // フォーカスを入力フィールドに戻す
                roomCodeInput.focus();
                return;
            } else {
                // エラー表示を削除
                roomCodeInput.classList.remove('error');
                const errorElement = document.getElementById('room-code-error');
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
            }
            gameState.roomCode = roomCode;
        }
        
        // プレイヤー名を設定
        gameState.playerName = playerName;
        
        // プレイヤー名を表示に設定
        playerNameDisplayElement.textContent = gameState.playerName;
        
        // スタート画面を非表示にし、ゲーム画面を表示
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // ゲームを初期化
        initGame();
    });
    
    // 入力フィールドのエラークリア
    playerNameInput.addEventListener('input', () => {
        playerNameInput.classList.remove('error');
        const errorElement = document.getElementById('player-name-error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    });
    
    roomCodeInput.addEventListener('input', () => {
        roomCodeInput.classList.remove('error');
        const errorElement = document.getElementById('room-code-error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    });
    
    // ターン終了ボタンの処理
    if (endTurnButton) {
        endTurnButton.addEventListener('click', endTurn);
    }
    
    // ヘルプボタンの処理
    if (helpButton) {
        helpButton.addEventListener('click', () => {
            keyboardShortcutsModal.classList.remove('hidden');
        });
    }
    
    // ヘルプを閉じるボタンの処理
    if (closeHelpButton) {
        closeHelpButton.addEventListener('click', () => {
            keyboardShortcutsModal.classList.add('hidden');
        });
    }
    
    // キーボードショートカット
    document.addEventListener('keydown', (event) => {
        // ゲーム開始後のみキーボードショートカットを有効化
        if (gameContainer.classList.contains('hidden')) {
            return;
        }
        
        // ESCキーでヘルプを閉じる
        if (event.key === 'Escape') {
            keyboardShortcutsModal.classList.add('hidden');
            return;
        }
        
        // ヘルプモーダルが表示されている場合は他のショートカットを無効化
        if (!keyboardShortcutsModal.classList.contains('hidden')) {
            return;
        }
        
        // スペースキーでターン終了
        if (event.key === ' ' || event.key === 'Spacebar') {
            if (endTurnButton && !endTurnButton.disabled) {
                endTurn();
            }
            event.preventDefault();
            return;
        }
        
        // 数字キーでカード選択
        if (/^[1-9]$/.test(event.key)) {
            const index = parseInt(event.key) - 1;
            const cardElements = playerHandElement.querySelectorAll('.card');
            if (index < cardElements.length) {
                cardElements[index].click();
            }
            return;
        }
    });
});

// 初期化関数
function initGame() {
    try {
        console.log("ゲーム初期化開始");
        
        // ゲームモードの設定
        setupGameMode(gameState.mode);
        
        // モード表示の更新
        updateModeDisplay();
        
        // カードデッキの初期化
        gameState.playerDeck = [];
        gameState.enemyDeck = [];
        
        // すべてのカードをデッキに追加
        cards.forEach(card => {
            gameState.playerDeck.push(card.id);
            gameState.enemyDeck.push(card.id);
        });
        
        console.log(`デッキ初期化: ${gameState.playerDeck.length}枚のカード`);
        
        // デッキのシャッフル
        shuffle(gameState.playerDeck);
        shuffle(gameState.enemyDeck);
        
        // 初期手札を配る
        const modeConfig = gameModes[gameState.mode];
        gameState.playerHand = [];
        gameState.enemyHand = [];
        
        console.log(`初期手札枚数: ${modeConfig.initialHandSize}枚`);
        
        // プレイヤーの初期手札
        for (let i = 0; i < modeConfig.initialHandSize; i++) {
            if (gameState.playerDeck.length > 0) {
                const cardId = gameState.playerDeck.shift();
                gameState.playerHand.push(cardId);
                console.log(`プレイヤー初期手札に追加: カードID ${cardId}`);
            }
        }
        
        console.log(`初期手札配布完了: ${gameState.playerHand.length}枚`);
        
        // 敵の初期手札
        for (let i = 0; i < modeConfig.initialHandSize; i++) {
            if (gameState.enemyDeck.length > 0) {
                gameState.enemyHand.push(gameState.enemyDeck.shift());
            }
        }
        
        // コンボモードの場合は初期コンボ値を0に設定
        if (gameState.mode === 'combo') {
            gameState.playerCombo = 0;
        }
        
        // 最初のターンをプレイヤーのターンに設定
        gameState.turn = 1;
        gameState.isPlayerTurn = true;
        
        // UIの更新
        updateUI();
        
        // ゲームログを初期化
        addLogMessage('ゲームを開始しました。');
        addLogMessage(`【${modeConfig.name}】 - ${modeConfig.description}`);
        addLogMessage('あなたのターンです。');
        
        // カード説明を表示
        addLogMessage('【カード説明】');
        addLogMessage('・左上の青い数字: カードコスト（使用に必要な瘴気の量）');
        addLogMessage('・右上のオレンジ色の数字: コンボ値（コンボモード時に効果が上昇）');
        addLogMessage('・カードをクリックして選択、ダブルクリックで使用できます');
        addLogMessage('・カードを使用すると自動的にターンが終了します');
        
        // オンラインモードの場合はプレイヤーリストを表示
        if (gameState.gameType === 'online') {
            showPlayersList();
        }
    } catch (error) {
        console.error("ゲーム初期化中にエラーが発生しました:", error);
        alert("ゲームの初期化中にエラーが発生しました。ページを再読み込みしてください。");
    }
}

// ゲームモード設定
function setupGameMode(mode) {
    const modeConfig = gameModes[mode];
    gameState.playerHP = modeConfig.initialHP;
    gameState.playerMaxHP = modeConfig.maxHP;
    gameState.playerMaxMP = modeConfig.maxMP;
    gameState.playerCurrentMP = modeConfig.initialMP;
    gameState.enemyHP = modeConfig.initialHP;
    gameState.enemyMaxHP = modeConfig.maxHP;
    gameState.enemyMaxMP = modeConfig.maxMP;
    gameState.enemyCurrentMP = modeConfig.initialMP;
    gameState.maxHand = modeConfig.maxHandSize;
    gameState.drawPerTurn = modeConfig.drawPerTurn;
}

// UI更新関数
function updateUI() {
    // 手札を更新
    updateHand();
    
    // HPとMPの表示を更新
    updateStatusBars();
    
    // コンボ表示
    if (gameModes[gameState.mode].comboEnabled) {
        comboDisplayElement.textContent = `コンボ: ${gameState.playerCombo}`;
        comboDisplayElement.style.display = 'block';
    } else {
        comboDisplayElement.style.display = 'none';
    }
    
    // ゲームモード表示の更新
    updateModeDisplay();
}

// 手札更新関数
function updateHand() {
    if (!playerHandElement) {
        console.error("プレイヤーの手札要素が見つかりません");
        // 要素を再取得してみる
        playerHandElement = document.getElementById('player-hand');
        if (!playerHandElement) {
            console.error("再取得してもプレイヤーの手札要素が見つかりません");
            return;
        }
    }
    
    console.log("手札更新開始", gameState.playerHand);
    
    // 既存の手札をクリア
    playerHandElement.innerHTML = '';
    
    // 手札情報の表示を更新
    const infoElement = document.createElement('div');
    infoElement.className = 'hand-info';
    infoElement.textContent = `手札: ${gameState.playerHand.length}/${gameModes[gameState.mode].maxHandSize}`;
    playerHandElement.appendChild(infoElement);
    
    // 各カードを表示
    if (gameState.playerHand.length === 0) {
        const emptyHandMsg = document.createElement('div');
        emptyHandMsg.className = 'empty-hand-message';
        emptyHandMsg.textContent = "手札がありません。ターンを終了すると新しいカードを引きます。";
        playerHandElement.appendChild(emptyHandMsg);
        console.log("空の手札メッセージを表示");
    } else {
        let displayedCards = 0;
        gameState.playerHand.forEach((cardId, index) => {
            const card = cards.find(c => c.id === cardId);
            if (card) {
                const cardElement = createCardElement(card);
                playerHandElement.appendChild(cardElement);
                displayedCards++;
            } else {
                console.error(`ID ${cardId} のカードが見つかりません (手札インデックス: ${index})`);
            }
        });
        console.log(`${displayedCards}枚のカードを表示しました`);
    }
    
    // 手札カウントを更新
    if (handCountElement && maxHandElement) {
        handCountElement.textContent = gameState.playerHand.length;
        maxHandElement.textContent = gameModes[gameState.mode].maxHandSize;
    }
    
    // カード使用ボタンの追加
    const useCardButton = document.createElement('button');
    useCardButton.className = 'card-use-button';
    useCardButton.textContent = 'カードを使用';
    useCardButton.disabled = !gameState.selectedCardId;
    useCardButton.addEventListener('click', () => {
        if (gameState.selectedCardId) {
            playSelectedCard();
        } else {
            addLogMessage("使用するカードを選択してください。");
        }
    });
    playerHandElement.appendChild(useCardButton);
}

// ステータスバー更新
function updateStatusBars() {
    // プレイヤーのHP表示（数値のみ）
    playerHPValue.textContent = `${gameState.playerHP} / ${gameModes[gameState.mode].maxHP}`;
    
    // プレイヤーのMP表示（数値のみ）
    playerMPValue.textContent = `${gameState.playerCurrentMP} / ${gameState.playerMaxMP}`;
    
    // 敵のHP表示（数値のみ）
    enemyHPValue.textContent = `${gameState.enemyHP} / ${gameModes[gameState.mode].maxHP}`;
    
    // 敵のMP表示（数値のみ）
    enemyMPValue.textContent = `${gameState.enemyCurrentMP} / ${gameState.enemyMaxMP}`;
    
    // 手札情報の更新
    if (handCountElement && maxHandElement) {
        handCountElement.textContent = gameState.playerHand.length;
        maxHandElement.textContent = gameModes[gameState.mode].maxHandSize;
    }
    
    // ステータスバーの視覚的更新
    if (playerHPBar) {
        const hpPercentage = (gameState.playerHP / gameModes[gameState.mode].maxHP) * 100;
        playerHPBar.style.width = `${Math.max(0, hpPercentage)}%`;
    }
    
    if (playerMPBar) {
        const mpPercentage = (gameState.playerCurrentMP / gameState.playerMaxMP) * 100;
        playerMPBar.style.width = `${Math.max(0, mpPercentage)}%`;
    }
    
    if (enemyHPBar) {
        const enemyHpPercentage = (gameState.enemyHP / gameModes[gameState.mode].maxHP) * 100;
        enemyHPBar.style.width = `${Math.max(0, enemyHpPercentage)}%`;
    }
    
    if (enemyMPBar) {
        const enemyMpPercentage = (gameState.enemyCurrentMP / gameState.enemyMaxMP) * 100;
        enemyMPBar.style.width = `${Math.max(0, enemyMpPercentage)}%`;
    }
}

// カードを選択する
function selectCard(cardId) {
    // 既に選択されている場合は選択解除
    if (gameState.selectedCardId === cardId) {
        gameState.selectedCardId = null;
        
        // 選択解除の視覚的表示
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 実行ボタンを非表示
        const playButton = document.getElementById('play-card-button');
        if (playButton) {
            playButton.style.display = 'none';
        }
        
        return;
    }
    
    // 新しいカードを選択
    gameState.selectedCardId = cardId;
    
    // 全てのカードから選択状態を解除
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 選択されたカードを強調表示
    const selectedCardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    if (selectedCardElement) {
        selectedCardElement.classList.add('selected');
    }
    
    // 実行ボタンを表示
    const playButton = document.getElementById('play-card-button');
    if (playButton) {
        playButton.style.display = 'block';
        
        // ボタンクリックでカードを使用
        playButton.onclick = () => {
            playCard(cardId);
            // 選択状態をリセット
            gameState.selectedCardId = null;
            playButton.style.display = 'none';
        };
    }
}

// ログメッセージ追加関数
function addLogMessage(message) {
    // ログ配列に追加
    gameState.log.push(message);
    
    // DOM更新
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logMessagesElement.appendChild(logEntry);
    
    // 自動スクロール
    logMessagesElement.scrollTop = logMessagesElement.scrollHeight;
    
    // スピードモードでは古いログを削除
    if (gameState.mode === 'speed' && logMessagesElement.children.length > 10) {
        logMessagesElement.removeChild(logMessagesElement.children[0]);
    }
}

// 特殊効果の処理
function processEndTurnEffects() {
    // 特殊効果があれば処理
    if (gameState.effects && gameState.effects.length > 0) {
        const activeEffects = [...gameState.effects];
        
        activeEffects.forEach(effect => {
            // 効果のタイプによって処理を分岐
            if (effect.type === 'comboGrowth') {
                gameState.playerCombo += effect.value;
                addLogMessage(`狂気の刻印により、コンボ値が${effect.value}増加した！(${gameState.playerCombo})`);
            } else if (effect.type === 'corruption') {
                gameState.playerHP -= effect.value;
                addLogMessage(`腐敗効果により、正気度が${effect.value}減少した。`);
            } else if (effect.type === 'mpGrowth') {
                gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + effect.value);
                addLogMessage(`瘴気増加効果により、瘴気が${effect.value}増えた。`);
            }
        });
        
        // 持続時間を減少させ、期限切れの効果を削除
        gameState.effects = gameState.effects.filter(effect => {
            if (effect.duration > 0) {
                effect.duration--;
            }
            return effect.duration > 0 || effect.duration === -1; // -1は永続効果
        });
    }
}

// ターン開始時の効果処理
function processTurnStartEffects() {
    // 特殊効果があれば処理
    if (gameState.effects && gameState.effects.length > 0) {
        const activeEffects = [...gameState.effects];
        
        activeEffects.forEach(effect => {
            // 効果のタイプによって処理を分岐
            if (effect.type === 'selfDamage') {
                gameState.playerHP -= effect.value;
                addLogMessage(`反動効果により、${effect.value}ダメージを受けた。`);
            }
        });
        
        // 持続時間を減少させ、期限切れの効果を削除
        gameState.effects = gameState.effects.filter(effect => {
            if (effect.duration > 0) {
                effect.duration--;
            }
            return effect.duration > 0 || effect.duration === -1; // -1は永続効果
        });
    }
}

// 特殊効果の追加
function addEffect(type, value, duration, name) {
    if (!gameState.effects) {
        gameState.effects = [];
    }
    
    // 同じ種類の効果がすでにある場合は上書き
    const existingIndex = gameState.effects.findIndex(e => e.type === type);
    if (existingIndex !== -1) {
        gameState.effects[existingIndex].value = value;
        gameState.effects[existingIndex].duration = duration;
        gameState.effects[existingIndex].name = name;
    } else {
        // 新しい効果を追加
        gameState.effects.push({
            type: type,
            value: value,
            duration: duration,
            name: name
        });
    }
    
    addLogMessage(`「${name}」の効果が発動した！`);
}

// 特殊効果の値を取得
function getEffectValue(type) {
    if (!gameState.effects) return 0;
    
    const effect = gameState.effects.find(e => e.type === type);
    return effect ? effect.value : 0;
}

// ゲームオーバー処理
function gameOver(isWin) {
    // ゲーム終了メッセージ
    if (isWin) {
        addLogMessage("勝利！ あなたは呪いに打ち勝った！");
    } else {
        addLogMessage("敗北... あなたは呪いに飲み込まれた...");
    }
    
    // カードボタンを無効化
    disableCardButtons();
    
    // ターン終了ボタンを無効化
    endTurnButton.disabled = true;
    
    // リプレイボタン追加
    addReplayButton();
    
    // モード変更ボタン追加
    addModeChangeButton();
}

// リプレイボタン追加
function addReplayButton() {
    const replayButton = document.createElement('button');
    replayButton.id = 'replay-button';
    replayButton.classList.add('game-button');
    replayButton.textContent = '再戦';
    replayButton.addEventListener('click', resetGame);
    
    // ボタンエリアに追加
    const buttonArea = document.querySelector('.button-area');
    buttonArea.appendChild(replayButton);
}

// モード変更ボタン追加
function addModeChangeButton() {
    const modeButton = document.createElement('button');
    modeButton.id = 'mode-button';
    modeButton.classList.add('game-button');
    modeButton.textContent = 'モード変更';
    
    modeButton.addEventListener('click', () => {
        // モードを切り替え
        const modes = Object.keys(gameModes);
        const currentIndex = modes.indexOf(gameState.mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        gameState.mode = modes[nextIndex];
        
        // ゲームをリセット
        resetGame();
    });
    
    // ボタンエリアに追加
    const buttonArea = document.querySelector('.button-area');
    buttonArea.appendChild(modeButton);
}

// カードボタンを無効化
function disableCardButtons() {
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.disabled = true;
    });
}

// カードボタンを有効化
function enableCardButtons() {
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.disabled = false;
    });
}

// ゲームリセット
function resetGame() {
    // ゲーム状態のリセット
    const modeConfig = gameModes[gameState.mode];
    gameState.turn = 1;
    gameState.playerHP = modeConfig.initialHP;
    gameState.playerMaxMP = modeConfig.maxMP;
    gameState.playerCurrentMP = modeConfig.initialMP;
    gameState.enemyHP = modeConfig.initialHP;
    gameState.enemyMaxMP = modeConfig.maxMP;
    gameState.enemyCurrentMP = modeConfig.initialMP;
    gameState.playerCombo = 0;
    gameState.enemyCombo = 0;
    gameState.effects = [];
    gameState.selectedCardId = null;
    
    // デッキと手札をリセット
    const allCards = cards.map(card => card.id);
    gameState.playerDeck = [...allCards];
    shuffle(gameState.playerDeck);
    
    // 初期手札を配る
    gameState.playerHand = [];
    const initialHandSize = modeConfig.initialHandSize || 9; // 初期手札のデフォルト値を9に
    for (let i = 0; i < initialHandSize; i++) {
        if (gameState.playerDeck.length > 0) {
            gameState.playerHand.push(gameState.playerDeck.shift());
        }
    }
    
    // ログをクリア
    gameState.log = ["claude王国へようこそ…"];
    logMessagesElement.innerHTML = '';
    addLogMessage(`${gameState.playerName}よ、新たな対戦が始まった…`);
    addLogMessage(`【${gameModes[gameState.mode].name}】 - ${gameModes[gameState.mode].description}`);
    
    if (gameState.gameType === 'online') {
        addLogMessage(`合言葉「${gameState.roomCode}」の部屋で対戦します。`);
    } else {
        addLogMessage("瘴気が満ちる王国で、あなたの戦いが始まる。");
    }
    
    // UI更新
    updateUI();
    
    // 追加したボタンを削除
    const replayButton = document.getElementById('replay-button');
    if (replayButton) replayButton.remove();
    
    const modeButton = document.getElementById('mode-button');
    if (modeButton) modeButton.remove();
    
    // ボタンを有効化
    endTurnButton.disabled = false;
}

// ゲームモード切り替え
function toggleGameMode() {
    const modes = Object.keys(gameModes);
    const currentIndex = modes.indexOf(gameState.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    gameState.mode = modes[nextIndex];
    
    addLogMessage(`ゲームモードを【${gameModes[gameState.mode].name}】に変更しました。`);
    resetGame();
    
    // モード表示を更新
    updateModeDisplay();
}

// ゲームモード表示を更新
function updateModeDisplay() {
    if (!currentModeDisplayElement) return;
    
    // モード名を取得
    const modeName = gameModes[gameState.mode].name || "通常モード";
    
    // 表示を更新
    currentModeDisplayElement.textContent = modeName;
    
    // モードツールチップのアクティブ状態を更新
    document.querySelectorAll('#mode-tooltip .mode-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const activeOption = document.getElementById(`${gameState.mode}-mode`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
}

// ヘルプモーダルの表示/非表示
function toggleHelpModal() {
    keyboardShortcutsModal.classList.toggle('hidden');
}

// 配列をシャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// イベントリスナーのセットアップ
function setupEventListeners() {
    try {
        // ターン終了ボタン
        endTurnButton.addEventListener('click', endTurn);
        
        // ヘルプボタン
        helpButton.addEventListener('click', toggleHelpModal);
        
        // ヘルプを閉じるボタン
        closeHelpButton.addEventListener('click', toggleHelpModal);
        
        // ゲームモードインジケータ
        document.getElementById('game-mode-indicator').addEventListener('click', function(event) {
            // ツールチップの表示中にクリックした場合のみモード切替
            if (event.target.classList.contains('mode-option')) {
                const clickedMode = event.target.id.replace('-mode', '');
                if (gameState.mode !== clickedMode) {
                    gameState.mode = clickedMode;
                    addLogMessage(`ゲームモードを【${gameModes[gameState.mode].name}】に変更しました。`);
                    resetGame();
                    updateModeDisplay();
                }
            }
        });
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            // ESCキーでヘルプを閉じる
            if (e.key === 'Escape' && !keyboardShortcutsModal.classList.contains('hidden')) {
                toggleHelpModal();
                return;
            }
            
            // モーダルが表示されている間は他のショートカットを無効化
            if (!keyboardShortcutsModal.classList.contains('hidden')) {
                return;
            }
            
            // スペースキーでターン終了
            if (e.code === 'Space' && !endTurnButton.disabled) {
                e.preventDefault();
                endTurn();
            }
            
            // Mキーでゲームモード切替
            if (e.key === 'm' || e.key === 'M') {
                toggleGameMode();
            }
            
            // 数字キーでカード選択（1〜9）
            const numKey = parseInt(e.key);
            if (!isNaN(numKey) && numKey >= 1 && numKey <= 9) {
                const index = numKey - 1;
                if (index < gameState.playerHand.length) {
                    const cardId = gameState.playerHand[index];
                    // 直接playCardを呼ばずに選択状態を切り替える
                    selectCard(cardId);
                }
            }
        });
        
        // カードがプレイされた時のエフェクト
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('card-button') && !event.target.disabled) {
                event.target.classList.add('card-playing');
                // アニメーション後にクラスを削除
                setTimeout(() => {
                    event.target.classList.remove('card-playing');
                }, 500);
            }
        });
    } catch (error) {
        console.error("イベントリスナーの設定中にエラーが発生しました:", error);
    }
}

// カード要素を作成する関数
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.cardId = card.id;
    cardElement.dataset.cardType = card.type;
    
    // カードのプレイ可能状態を確認
    const isPlayable = card.cost <= gameState.playerCurrentMP;
    if (!isPlayable) {
        cardElement.classList.add('unplayable');
    }
    
    // カード名
    const nameElement = document.createElement('div');
    nameElement.className = 'card-name';
    nameElement.textContent = card.name;
    cardElement.appendChild(nameElement);
    
    // カードタイプ
    const typeElement = document.createElement('div');
    typeElement.className = 'card-type';
    typeElement.textContent = card.type;
    cardElement.appendChild(typeElement);
    
    // コスト表示
    const costElement = document.createElement('div');
    costElement.className = 'card-cost';
    costElement.textContent = card.cost;
    cardElement.appendChild(costElement);
    
    // コンボ値表示
    const comboElement = document.createElement('div');
    comboElement.className = 'card-combo';
    comboElement.textContent = card.comboValue;
    cardElement.appendChild(comboElement);
    
    // カード効果
    const effectElement = document.createElement('div');
    effectElement.className = 'card-effect';
    effectElement.textContent = card.effect;
    cardElement.appendChild(effectElement);
    
    // キーワード能力
    if (card.keyword) {
        const keywordElement = document.createElement('div');
        keywordElement.className = 'card-keyword';
        keywordElement.textContent = card.keyword;
        cardElement.appendChild(keywordElement);
    }
    
    // シングルクリックでカード選択
    cardElement.addEventListener('click', () => {
        // コストが足りない場合は選択できない
        if (!isPlayable) {
            addLogMessage(`「${card.name}」は瘴気が足りません (コスト: ${card.cost})`);
            return;
        }
        
        // 選択状態を切り替え
        selectCard(card.id);
    });
    
    return cardElement;
}

// 選択したカードをプレイする関数
function playSelectedCard() {
    if (gameState.selectedCardId !== null) {
        // カードを使用
        playCard(gameState.selectedCardId);
        // 選択をリセット
        gameState.selectedCardId = null;
        // 手札の表示を更新
        updateHand();
    } else {
        addLogMessage("使用するカードを選択してください。");
    }
}

// カードをプレイする
function playCard(cardId) {
    // 選択されたカードを探す
    const cardIndex = gameState.playerHand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
        addLogMessage('カードが見つかりません');
        return;
    }
    
    const card = gameState.playerHand[cardIndex];
    
    // コストチェック
    if (card.cost > gameState.playerCurrentMP) {
        addLogMessage(`瘴気が足りません！ 必要: ${card.cost}, 現在: ${gameState.playerCurrentMP}`);
        return;
    }
    
    // コンボチェック・更新
    if (gameModes[gameState.mode].comboEnabled) {
        gameState.playerCombo++;
        updateComboDisplay();
    }
    
    // MPを減らす
    gameState.playerCurrentMP -= card.cost;
    
    // カード効果を適用
    addLogMessage(`[${gameState.turn}ターン] 「${card.name}」をプレイしました`);
    
    // カードタイプによる処理分岐
    if (card.type === "物理" || card.type === "呪術") {
        // 攻撃カード効果
        applyAttackCardEffect(card);
    } else if (card.type === "回復") {
        // 回復カード効果
        applyHealCardEffect(card);
    } else {
        // その他のカード効果（クリーチャー、遺物、策略）
        applyOtherCardEffect(card);
    }
    
    // カードをプレイ後、手札から削除
    gameState.playerHand.splice(cardIndex, 1);
    
    // 勝敗チェック
    checkWinCondition();
    
    // 表示更新
    updateGameDisplay();
    
    // 自動的にターンを終了する（簡略化のため）
    // 実際のゲームでは、複数のカードを連続して使えるようにする
    endPlayerTurn();
}

// 攻撃カードの効果を適用
function applyAttackCardEffect(card) {
    let damage = 0;
    
    // コンボ対応カードの処理
    if (card.id === 11) { // 瞬間消滅
        damage = gameState.playerCombo > 1 ? 4 : 2;
    } else if (card.id === 15) { // 魔力爆発
        damage = gameState.playerCombo * 2;
    } else if (card.id === 1) { // 魂喰らいの呪い
        damage = 4;
        // 回復効果も適用
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + 1);
        addLogMessage(`+1 正気度を回復しました`);
    } else if (card.id === 8) { // 死者の囁き
        damage = 7;
        // 山札に戻る効果
        gameState.playerDeck.push(card);
        addLogMessage(`「${card.name}」は山札に戻りました`);
    } else if (card.id === 12) { // 連鎖呪縛
        damage = 3;
        // カードを引く効果も適用
        if (gameState.playerCombo >= 3) {
            drawCards(1);
            addLogMessage(`コンボ効果: カードを1枚引きました`);
        }
    } else if (card.id === 21) { // 連続攻撃
        // 2回ダメージを与える
        damage = 2;
        gameState.enemyHP -= damage;
        addLogMessage(`敵に${damage}ダメージを与えました`);
        damage = 2; // 2回目のダメージ
    } else {
        // その他の攻撃カードの基本効果
        // カードの効果文からダメージ値を抽出
        const damageMatch = card.effect.match(/(\d+)ダメージ/);
        if (damageMatch) {
            damage = parseInt(damageMatch[1]);
        } else {
            // デフォルトダメージ
            damage = 1;
        }
    }
    
    // ダメージ適用
    gameState.enemyHP -= damage;
    addLogMessage(`敵に${damage}ダメージを与えました`);
}

// 回復カードの効果を適用
function applyHealCardEffect(card) {
    if (card.id === 23) { // 小休止
        const healAmount = 3;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 24) { // 浅い瞑想
        const mpHealAmount = 3;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 25) { // 応急手当
        const healAmount = 5;
        const mpCost = 1;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        gameState.playerCurrentMP = Math.max(0, gameState.playerCurrentMP - mpCost);
        addLogMessage(`正気度を${healAmount}回復し、瘴気を${mpCost}消費しました`);
    } else if (card.id === 26) { // 癒しの光
        const healAmount = 8;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 27) { // 瘴気集中
        const mpHealAmount = 8;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 28) { // 生命の雫
        const healAmount = 12;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 29) { // 生命湧出
        const healAmount = 20;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 30) { // 魔力解放
        const mpHealAmount = 20;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 31) { // 再生
        const healAmount = 10;
        const mpHealAmount = 10;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`正気度を${healAmount}、瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 32) { // 魂の復活
        const healAmount = 30;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 33) { // 生命と魔力の交換
        const hpLoss = 10;
        const mpGain = 15;
        gameState.playerHP = Math.max(1, gameState.playerHP - hpLoss);
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpGain);
        addLogMessage(`正気度を${hpLoss}失い、瘴気を${mpGain}得ました`);
    } else if (card.id === 34) { // 魔力と生命の交換
        const mpLoss = 10;
        const hpGain = 15;
        gameState.playerCurrentMP = Math.max(0, gameState.playerCurrentMP - mpLoss);
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + hpGain);
        addLogMessage(`瘴気を${mpLoss}失い、正気度を${hpGain}得ました`);
    } else if (card.id === 35) { // 完全回復
        const healToFull = gameState.playerMaxHP - gameState.playerHP;
        gameState.playerHP = gameState.playerMaxHP;
        addLogMessage(`正気度を${healToFull}回復し、最大まで回復しました`);
    }
}

// その他のカード効果を適用
function applyOtherCardEffect(card) {
    // カードIDによって異なる効果を適用
    if (card.id === 3) { // 血の取引
        gameState.playerHP = Math.max(1, gameState.playerHP - 3);
        addLogMessage(`正気度を3失いました`);
        drawCards(2);
        addLogMessage(`カードを2枚引きました`);
    } else if (card.id === 7) { // 闇の契約
        // 山札から呪術カードを1枚手札に追加
        const spellCards = gameState.playerDeck.filter(c => c.type === "呪術");
        if (spellCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * spellCards.length);
            const spellCard = spellCards[randomIndex];
            // 山札から削除して手札に追加
            gameState.playerDeck = gameState.playerDeck.filter(c => c !== spellCard);
            gameState.playerHand.push(spellCard);
            addLogMessage(`「${spellCard.name}」を山札から手札に加えました`);
        } else {
            addLogMessage(`山札に呪術カードがありません`);
        }
        
        // ダメージ効果
        gameState.playerHP = Math.max(1, gameState.playerHP - 2);
        addLogMessage(`自分に2ダメージを受けました`);
    } else if (card.id === 13) { // 時間加速
        // このターン、カードコストが1減少する効果を付与
        gameState.costReduction = 1;
        addLogMessage(`このターン、カードコストが1減少します`);
    } else if (card.id === 14) { // 狂気の刻印
        // 毎ターン終了時にコンボ値が+1される効果を付与
        gameState.comboBonus = 1;
        addLogMessage(`毎ターン終了時にコンボ値が+1されます`);
    } else if (card.id === 19) { // 戦術的後退
        drawCards(1);
        addLogMessage(`カードを1枚引きました`);
    } else {
        // その他のカード効果はここに追加
        addLogMessage(`「${card.name}」の効果が発動しました`);
    }
}

// ターン終了処理
function endTurn() {
    // ターン数を増やす
    gameState.turn++;
    
    // 特殊効果の処理
    processEndTurnEffects();
    
    // 敵のターン処理（簡易AI）
    processEnemyTurn();
    
    // 新しいターン開始処理
    startNewTurn();
}

// 敵のターン処理（簡易AI）
function processEnemyTurn() {
    // 瘴気の回復前の値を保存
    const previousMP = gameState.enemyCurrentMP;
    
    // 敵のMPを回復
    gameState.enemyCurrentMP = Math.min(gameState.enemyMaxMP, gameState.enemyCurrentMP + gameModes[gameState.mode].mpRegenRate);
    
    // 瘴気回復のログ表示
    if (gameState.enemyCurrentMP > previousMP) {
        const mpGain = gameState.enemyCurrentMP - previousMP;
        addLogMessage(`敵の瘴気が${mpGain}回復した。(${previousMP} → ${gameState.enemyCurrentMP})`);
    }
    
    // 敵のカード使用シミュレーション
    // 瘴気を使用するかどうかランダムに決定
    const useMP = gameState.enemyCurrentMP > 0 && Math.random() > 0.3;
    
    let damage = 0;
    
    if (useMP) {
        // 瘴気を使った強力な攻撃（2〜3の瘴気を消費）
        const mpCost = Math.min(gameState.enemyCurrentMP, Math.floor(Math.random() * 2) + 2);
        gameState.enemyCurrentMP -= mpCost;
        
        // ダメージ計算（瘴気を使うと強い）
        damage = mpCost * 2 + Math.floor(Math.random() * 3);
        
        addLogMessage(`敵が瘴気を${mpCost}消費して強力な攻撃を仕掛けてきた！`);
    } else {
        // 通常攻撃（瘴気を使わない）
        damage = Math.floor(Math.random() * 3) + 1; // 1〜3のダメージ
        addLogMessage(`敵が通常攻撃を仕掛けてきた。`);
    }
    
    // ダメージ軽減効果があれば適用
    const damageReduction = getEffectValue('damageReduction') || 0;
    if (damageReduction > 0) {
        const originalDamage = damage;
        damage = Math.max(1, damage - damageReduction);
        addLogMessage(`ダメージ軽減効果により、ダメージが${originalDamage}から${damage}に減少した。`);
    }
    
    // プレイヤーにダメージを与える
    gameState.playerHP -= damage;
    
    // ダメージを表示
    addLogMessage(`あなたに${damage}ダメージ！`);
    
    // プレイヤーの負け判定
    if (gameState.playerHP <= 0) {
        gameOver(false);
        return;
    }
    
    // 敵の瘴気状態をログに表示
    addLogMessage(`敵の瘴気: ${gameState.enemyCurrentMP}/${gameState.enemyMaxMP}`);
    
    // UI更新
    updateUI();
}

// 新しいターン開始処理
function startNewTurn() {
    gameState.isPlayerTurn = true;
    
    // ターン開始時のMP回復
    const mpRegen = gameModes[gameState.mode].mpRegenRate || 1;
    gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpRegen);
    
    // ターン開始時の効果処理
    processTurnStartEffects();
    
    // 効果の持続時間減少と期限切れチェック
    gameState.effects = gameState.effects.filter(effect => {
        effect.duration--;
        return effect.duration > 0 || effect.duration === -1; // 永続効果(-1)は残す
    });
    
    // カードを引く
    const drawCount = gameModes[gameState.mode].drawPerTurn || 1;
    drawCards(drawCount);
    
    // 手札が少ない場合は追加でカードを引く（最低3枚は確保）
    const minHandSize = 3;
    if (gameState.playerHand.length < minHandSize) {
        const additionalCards = minHandSize - gameState.playerHand.length;
        addLogMessage(`手札が少ないため、追加で${additionalCards}枚引きます。`);
        drawCards(additionalCards);
    }
    
    // UIを更新
    updateUI();
    
    // ログにメッセージを追加
    addLogMessage(`ターン${gameState.turn}：あなたのターンです。`);
    
    // ステータス効果のメッセージ
    if (gameState.effects.length > 0) {
        const effectMessages = gameState.effects.map(e => {
            const duration = e.duration === -1 ? "永続" : `残り${e.duration}ターン`;
            return `${e.name}(${duration})`;
        });
        addLogMessage(`有効な効果：${effectMessages.join(', ')}`);
    }
}

// カードを引く関数
function drawCards(count) {
    const maxHandSize = gameModes[gameState.mode].maxHandSize;
    let cardsDrawn = 0;
    
    for (let i = 0; i < count; i++) {
        // 手札がいっぱいならこれ以上引かない
        if (gameState.playerHand.length >= maxHandSize) {
            addLogMessage(`手札がいっぱいです（最大${maxHandSize}枚）。`);
            break;
        }
        
        // デッキが空なら再構築
        if (gameState.playerDeck.length === 0) {
            reshufflePlayerDeck();
        }
        
        // カードを引く
        if (gameState.playerDeck.length > 0) {
            const cardId = gameState.playerDeck.shift();
            gameState.playerHand.push(cardId);
            cardsDrawn++;
        }
    }
    
    if (cardsDrawn > 0) {
        addLogMessage(`カードを${cardsDrawn}枚引きました。`);
    }
    
    // 手札の更新
    updateHand();
}

// プレイヤーデッキを再構築する
function reshufflePlayerDeck() {
    addLogMessage("デッキが空になりました。新しいデッキを構築します...");
    
    // 新しいデッキを作成
    gameState.playerDeck = [];
    cards.forEach(card => {
        gameState.playerDeck.push(card.id);
    });
    
    // シャッフル
    shuffle(gameState.playerDeck);
    addLogMessage("デッキをリセットしました。");
}

// 勝敗条件をチェックする関数
function checkWinCondition() {
    if (gameState.enemyHP <= 0) {
        // プレイヤーの勝利
        addLogMessage(`敵の正気度が0になりました！あなたの勝利です！`);
        gameOver(true);
        return true;
    } else if (gameState.playerHP <= 0) {
        // プレイヤーの敗北
        addLogMessage(`あなたの正気度が0になりました！あなたの敗北です...`);
        gameOver(false);
        return true;
    }
    return false;
}

// コンボ表示を更新する関数
function updateComboDisplay() {
    const comboElement = document.getElementById('combo-display');
    if (comboElement) {
        if (gameState.playerCombo > 1) {
            comboElement.textContent = `コンボ: ${gameState.playerCombo}`;
            comboElement.style.display = 'block';
            
            // アニメーション効果
            comboElement.classList.add('combo-flash');
            setTimeout(() => {
                comboElement.classList.remove('combo-flash');
            }, 500);
        } else {
            comboElement.style.display = 'none';
        }
    }
}

// プレイヤーデッキを再構築する
function reshufflePlayerDeck() {
    addLogMessage("デッキが空になりました。新しいデッキを構築します...");
    
    // 新しいデッキを作成
    gameState.playerDeck = [];
    cards.forEach(card => {
        gameState.playerDeck.push(card.id);
    });
    
    // シャッフル
    shuffle(gameState.playerDeck);
    addLogMessage("デッキをリセットしました。");
}

// プレイヤーのターン終了処理
function endPlayerTurn() {
    // 特殊効果の処理（例：毎ターン終了時のコンボ増加）
    if (gameState.comboBonus > 0) {
        gameState.playerCombo += gameState.comboBonus;
        addLogMessage(`コンボボーナス効果: コンボ値が${gameState.comboBonus}増加しました (現在: ${gameState.playerCombo})`);
        updateComboDisplay();
    }
    
    // ターンを敵に移す
    addLogMessage(`ターン終了：${gameState.turn}ターン目`);
    
    // 敵のターン処理を実行
    setTimeout(() => {
        enemyTurn();
    }, 1000);
}

// ゲーム表示の更新
function updateGameDisplay() {
    // ステータスバーの更新
    updateStatusBars();
    
    // 手札の表示更新
    updateHandDisplay();
    
    // コンボ表示の更新
    if (gameModes[gameState.mode].comboEnabled) {
        updateComboDisplay();
    }
    
    // アニメーション効果
    const gameboardElement = document.querySelector('.game-board');
    if (gameboardElement) {
        gameboardElement.classList.add('update-effect');
        setTimeout(() => {
            gameboardElement.classList.remove('update-effect');
        }, 300);
    }
}

// ゲームUIの初期化
function initGameUI() {
    // ヘルプボタン
    const helpButton = document.getElementById('help-button');
    const closeHelpButton = document.getElementById('close-help-button');
    const helpModal = document.getElementById('keyboard-shortcuts-modal');
    
    if (helpButton && closeHelpButton && helpModal) {
        helpButton.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
        });
        
        closeHelpButton.addEventListener('click', () => {
            helpModal.classList.add('hidden');
        });
    }
    
    // ターン終了ボタン
    const endTurnButton = document.getElementById('end-turn-button');
    if (endTurnButton) {
        endTurnButton.addEventListener('click', () => {
            endPlayerTurn();
        });
    }
}

// ゲームUIの初期化
initGameUI();
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
    // ゲームUIの初期化
    initGameUI();
}
    
// カードゲーム「claude王国」のゲームロジック - ハイスピードバージョン

// カードデータ - より強力な効果と多様性
const cards = [
    // 瘴気コスト付きの強力なカード
    { id: 1, name: "魂喰らいの呪い", type: "呪術", cost: 2, effect: "相手に4ダメージを与え、自分は1回復する。", keyword: "", comboValue: 2 },
    { id: 8, name: "死者の囁き", type: "呪術", cost: 5, effect: "相手に7ダメージを与える。このカードは山札に戻る。", keyword: "", comboValue: 4 },
    { id: 11, name: "瞬間消滅", type: "呪術", cost: 1, effect: "相手に2ダメージ。コンボ中なら4ダメージ。", keyword: "速攻", comboValue: 2 },
    { id: 12, name: "連鎖呪縛", type: "呪術", cost: 3, effect: "相手に3ダメージ。コンボ値+3で追加カードを引く。", keyword: "", comboValue: 3 },
    { id: 15, name: "魔力爆発", type: "呪術", cost: 4, effect: "現在のコンボ値×2のダメージを与える。", keyword: "", comboValue: 0 },
    { id: 5, name: "禁忌の書物", type: "遺物", cost: 4, effect: "各ターンの開始時、追加で瘴気1を得る。", keyword: "腐敗 1", comboValue: 3 },
    { id: 7, name: "闇の契約", type: "策略", cost: 2, effect: "山札から呪術カードを1枚手札に加える。自分は2ダメージを受ける。", keyword: "", comboValue: 2 },
    
    // 瘴気コスト0の物理攻撃カード（基本的な攻撃）
    { id: 16, name: "素早い一撃", type: "物理", cost: 0, effect: "相手に1ダメージを与える。", keyword: "速攻", comboValue: 1 },
    { id: 17, name: "突撃", type: "物理", cost: 0, effect: "相手に2ダメージを与える。", keyword: "", comboValue: 1 },
    { id: 18, name: "防御姿勢", type: "物理", cost: 0, effect: "次のターン、受けるダメージを1減少させる。", keyword: "", comboValue: 1 },
    { id: 19, name: "戦術的後退", type: "物理", cost: 0, effect: "カードを1枚引く。", keyword: "", comboValue: 1 },
    
    // 瘴気コスト少なめの基本カード
    { id: 2, name: "彷徨う骸骨", type: "クリーチャー", cost: 1, effect: "パワー1/タフネス1", keyword: "", comboValue: 1 },
    { id: 3, name: "血の取引", type: "策略", cost: 0, effect: "自分の正気度を3失う。カードを2枚引く。", keyword: "腐敗 1", comboValue: 3 },
    { id: 4, name: "王家の指輪", type: "遺物", cost: 3, effect: "あなたのクリーチャーはパワー+1の修正を受ける。", keyword: "", comboValue: 2 },
    { id: 6, name: "魂の牢獄", type: "呪術", cost: 3, effect: "相手のクリーチャー1体を破壊する。", keyword: "使役", comboValue: 2 },
    { id: 9, name: "亡霊の侍女", type: "クリーチャー", cost: 2, effect: "パワー2/タフネス1。プレイした時、カードを1枚引く。", keyword: "", comboValue: 2 },
    { id: 10, name: "呪われた鎧", type: "遺物", cost: 2, effect: "あなたが受けるダメージを1減少させる。", keyword: "腐敗 2", comboValue: 2 },
    { id: 14, name: "狂気の刻印", type: "遺物", cost: 1, effect: "毎ターン終了時にコンボ値が+1される。", keyword: "", comboValue: 1 },
    
    // 瘴気コスト高めの強力な物理カード
    { id: 20, name: "致命的一撃", type: "物理", cost: 3, effect: "相手に5ダメージを与える。", keyword: "", comboValue: 2 },
    { id: 21, name: "連続攻撃", type: "物理", cost: 2, effect: "相手に2ダメージを2回与える。", keyword: "", comboValue: 3 },
    { id: 22, name: "猛攻", type: "物理", cost: 4, effect: "相手に6ダメージを与える。次のターン、自分は2ダメージを受ける。", keyword: "", comboValue: 4 },
    
    // 回復カード（コスト0）
    { id: 23, name: "小休止", type: "回復", cost: 0, effect: "正気度を3回復する。", keyword: "", comboValue: 1 },
    { id: 24, name: "浅い瞑想", type: "回復", cost: 0, effect: "瘴気を3回復する。", keyword: "", comboValue: 1 },
    { id: 25, name: "応急手当", type: "回復", cost: 0, effect: "正気度を5回復する。瘴気を1消費する。", keyword: "", comboValue: 1 },
    
    // 回復カード（コスト低め）
    { id: 26, name: "癒しの光", type: "回復", cost: 1, effect: "正気度を8回復する。", keyword: "", comboValue: 2 },
    { id: 27, name: "瘴気集中", type: "回復", cost: 1, effect: "瘴気を8回復する。", keyword: "", comboValue: 2 },
    { id: 28, name: "生命の雫", type: "回復", cost: 2, effect: "正気度を12回復する。", keyword: "", comboValue: 2 },
    
    // 回復カード（コスト高め・強力）
    { id: 29, name: "生命湧出", type: "回復", cost: 3, effect: "正気度を20回復する。", keyword: "", comboValue: 3 },
    { id: 30, name: "魔力解放", type: "回復", cost: 3, effect: "瘴気を20回復する。", keyword: "", comboValue: 3 },
    { id: 31, name: "再生", type: "回復", cost: 4, effect: "正気度を10、瘴気を10回復する。", keyword: "", comboValue: 3 },
    { id: 32, name: "魂の復活", type: "回復", cost: 5, effect: "正気度を15回復する。", keyword: "", comboValue: 4 },
    
    // 特殊回復カード
    { id: 33, name: "生命と魔力の交換", type: "回復", cost: 0, effect: "正気度を10失い、瘴気を8得る。", keyword: "", comboValue: 2 },
    { id: 34, name: "魔力と生命の交換", type: "回復", cost: 0, effect: "瘴気を10失い、正気度を8得る。", keyword: "", comboValue: 2 },
];

// ゲームモード
const gameModes = {
    normal: {
        name: '通常モード',
        description: 'オーソドックスな戦略重視の対戦',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 1,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 1,
        comboEnabled: false
    },
    speed: {
        name: 'スピードモード',
        description: '瘴気の回復が早く、手札も多く引ける高速バトル',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 2,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 2,
        comboEnabled: false
    },
    combo: {
        name: 'コンボモード',
        description: '連続でカードを使うほど効果がアップする',
        initialHP: 35,
        maxHP: 100,
        initialMP: 10,
        maxMP: 100,
        mpRegenRate: 1,
        initialHandSize: 8,
        maxHandSize: 12,
        drawPerTurn: 1,
        comboEnabled: true
    }
};

// ゲーム状態
const gameState = {
    turn: 1,
    playerHP: 35,
    playerMaxHP: 100,
    playerMaxMP: 100,
    playerCurrentMP: 10,
    playerHand: [],
    playerDeck: [],
    playerDiscard: [],
    enemyHP: 35,
    enemyMaxHP: 100,
    enemyMaxMP: 100,
    enemyCurrentMP: 10,
    enemyHand: [],
    enemyDeck: [],
    enemyDiscard: [],
    selectedCardId: null,
    effects: [],
    mode: 'normal',
    playerCombo: 0,
    enemyCombo: 0,
    costReduction: 0,
    comboBonus: 0,
    maxHand: 12,
    drawPerTurn: 1
};

// DOM要素の参照
let playerHandElement;
let enemyHandElement;
let playerHPBar;
let playerMPBar;
let enemyHPBar;
let enemyMPBar;
let playerHPValue;
let playerMPValue;
let enemyHPValue;
let enemyMPValue;
let playerNameDisplayElement;
let enemyNameElement;
let handCountElement;
let maxHandElement;
let endTurnButton;
let helpButton;
let closeHelpButton;
let gameLogElement;
let startScreen;
let gameContainer;
let playerNameInput;
let roomCodeInput;
let roomCodeContainer;
let startGameButton;
let normalModeOption;
let speedModeOption;
let comboModeOption;
let soloTypeOption;
let onlineTypeOption;
let currentModeDisplayElement;
let keyboardShortcutsModal;
let comboDisplayElement;
let modeOptionCards;
let gameTypeOptions;
let logMessagesElement;

// オンラインプレイヤーの模擬データ（実際の実装では、サーバーからデータを取得）
const onlinePlayers = [
    { id: 1, name: "プレイヤー1", hp: 20, maxHp: 25, mp: 2, maxMp: 3 },
    { id: 2, name: "プレイヤー2", hp: 15, maxHp: 25, mp: 1, maxMp: 3 },
    { id: 3, name: "プレイヤー3", hp: 22, maxHp: 25, mp: 3, maxMp: 3 }
];

// プレイヤーリストDOM要素
let playersListElement;
let playerListItemsElement;

// DOMが読み込まれたときの初期化
document.addEventListener('DOMContentLoaded', () => {
    // スタート画面の要素
    startScreen = document.getElementById('start-screen');
    gameContainer = document.getElementById('game-container');
    playerNameInput = document.getElementById('player-name');
    startGameButton = document.getElementById('start-game-button');
    modeOptionCards = document.querySelectorAll('.mode-option-card');
    gameTypeOptions = document.querySelectorAll('.game-type-option');
    roomCodeContainer = document.getElementById('room-code-container');
    roomCodeInput = document.getElementById('room-code');
    
    // ゲーム画面の要素
    playerHandElement = document.getElementById('player-hand');
    enemyHandElement = document.getElementById('enemy-hand');
    endTurnButton = document.getElementById('end-turn-button');
    logMessagesElement = document.getElementById('log-messages');
    gameLogElement = document.getElementById('game-log');
    helpButton = document.getElementById('help-button');
    closeHelpButton = document.getElementById('close-help-button');
    keyboardShortcutsModal = document.getElementById('keyboard-shortcuts-modal');
    
    // ステータス表示要素
    playerHPBar = document.getElementById('player-hp-bar');
    playerMPBar = document.getElementById('player-mp-bar');
    enemyHPBar = document.getElementById('enemy-hp-bar');
    enemyMPBar = document.getElementById('enemy-mp-bar');
    playerHPValue = document.getElementById('player-hp-value');
    playerMPValue = document.getElementById('player-mp-value');
    enemyHPValue = document.getElementById('enemy-hp-value');
    enemyMPValue = document.getElementById('enemy-mp-value');
    
    // 名前表示と手札情報
    playerNameDisplayElement = document.getElementById('player-name-display');
    enemyNameElement = document.getElementById('enemy-name');
    handCountElement = document.getElementById('hand-count');
    maxHandElement = document.getElementById('max-hand');
    
    // ゲームモード関連
    currentModeDisplayElement = document.getElementById('current-mode-display');
    normalModeOption = document.querySelector('[data-mode="normal"]');
    speedModeOption = document.querySelector('[data-mode="speed"]');
    comboModeOption = document.querySelector('[data-mode="combo"]');
    soloTypeOption = document.querySelector('[data-type="solo"]');
    onlineTypeOption = document.querySelector('[data-type="online"]');
    
    // プレイヤーリスト要素
    playersListElement = document.getElementById('players-list');
    playerListItemsElement = document.getElementById('player-list-items');
    
    // コンボ表示要素を作成
    comboDisplayElement = document.createElement('div');
    comboDisplayElement.id = 'combo-display';
    comboDisplayElement.style.display = 'none';
    if (document.getElementById('player-area')) {
        document.getElementById('player-area').appendChild(comboDisplayElement);
    }
    
    // モード選択の処理
    modeOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            // 全てのカードから選択クラスを削除
            modeOptionCards.forEach(c => c.classList.remove('selected'));
            // クリックされたカードに選択クラスを追加
            card.classList.add('selected');
            // ゲームモードを設定
            gameState.mode = card.dataset.mode;
        });
    });
    
    // 対戦タイプの処理
    gameTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 全てのオプションから選択クラスを削除
            gameTypeOptions.forEach(o => o.classList.remove('selected'));
            // クリックされたオプションに選択クラスを追加
            option.classList.add('selected');
            // ゲームタイプを設定
            gameState.gameType = option.dataset.type;
            
            // オンラインモードの場合、部屋コード入力を表示
            if (option.dataset.type === 'online') {
                roomCodeContainer.classList.remove('hidden');
            } else {
                roomCodeContainer.classList.add('hidden');
            }
        });
    });
    
    // ゲーム開始ボタンの処理
    startGameButton.addEventListener('click', () => {
        // プレイヤー名のバリデーション
        const playerName = playerNameInput.value.trim();
        if (playerName === '') {
            // エラーのビジュアルフィードバック
            playerNameInput.classList.add('error');
            
            // エラーメッセージ要素があれば表示、なければ作成
            let errorElement = document.getElementById('player-name-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = 'player-name-error';
                errorElement.className = 'error-message visible';
                errorElement.textContent = '名前を入力してください';
                playerNameInput.parentNode.appendChild(errorElement);
            } else {
                errorElement.classList.add('visible');
            }
            
            // フォーカスを入力フィールドに戻す
            playerNameInput.focus();
            return;
        } else {
            // エラー表示を削除
            playerNameInput.classList.remove('error');
            const errorElement = document.getElementById('player-name-error');
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
        }
        
        // オンラインモードの場合は部屋コードも必要
        if (gameState.gameType === 'online') {
            const roomCode = roomCodeInput.value.trim();
            if (roomCode === '') {
                // エラーのビジュアルフィードバック
                roomCodeInput.classList.add('error');
                
                // エラーメッセージ要素があれば表示、なければ作成
                let errorElement = document.getElementById('room-code-error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = 'room-code-error';
                    errorElement.className = 'error-message visible';
                    errorElement.textContent = '部屋の合言葉を入力してください';
                    roomCodeInput.parentNode.appendChild(errorElement);
                } else {
                    errorElement.classList.add('visible');
                }
                
                // フォーカスを入力フィールドに戻す
                roomCodeInput.focus();
                return;
            } else {
                // エラー表示を削除
                roomCodeInput.classList.remove('error');
                const errorElement = document.getElementById('room-code-error');
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
            }
            gameState.roomCode = roomCode;
        }
        
        // プレイヤー名を設定
        gameState.playerName = playerName;
        
        // プレイヤー名を表示に設定
        playerNameDisplayElement.textContent = gameState.playerName;
        
        // スタート画面を非表示にし、ゲーム画面を表示
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // ゲームを初期化
        initGame();
    });
    
    // 入力フィールドのエラークリア
    playerNameInput.addEventListener('input', () => {
        playerNameInput.classList.remove('error');
        const errorElement = document.getElementById('player-name-error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    });
    
    roomCodeInput.addEventListener('input', () => {
        roomCodeInput.classList.remove('error');
        const errorElement = document.getElementById('room-code-error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    });
    
    // ターン終了ボタンの処理
    if (endTurnButton) {
        endTurnButton.addEventListener('click', endTurn);
    }
    
    // ヘルプボタンの処理
    if (helpButton) {
        helpButton.addEventListener('click', () => {
            keyboardShortcutsModal.classList.remove('hidden');
        });
    }
    
    // ヘルプを閉じるボタンの処理
    if (closeHelpButton) {
        closeHelpButton.addEventListener('click', () => {
            keyboardShortcutsModal.classList.add('hidden');
        });
    }
    
    // キーボードショートカット
    document.addEventListener('keydown', (event) => {
        // ゲーム開始後のみキーボードショートカットを有効化
        if (gameContainer.classList.contains('hidden')) {
            return;
        }
        
        // ESCキーでヘルプを閉じる
        if (event.key === 'Escape') {
            keyboardShortcutsModal.classList.add('hidden');
            return;
        }
        
        // ヘルプモーダルが表示されている場合は他のショートカットを無効化
        if (!keyboardShortcutsModal.classList.contains('hidden')) {
            return;
        }
        
        // スペースキーでターン終了
        if (event.key === ' ' || event.key === 'Spacebar') {
            if (endTurnButton && !endTurnButton.disabled) {
                endTurn();
            }
            event.preventDefault();
            return;
        }
        
        // 数字キーでカード選択
        if (/^[1-9]$/.test(event.key)) {
            const index = parseInt(event.key) - 1;
            const cardElements = playerHandElement.querySelectorAll('.card');
            if (index < cardElements.length) {
                cardElements[index].click();
            }
            return;
        }
    });
});

// 初期化関数
function initGame() {
    try {
        console.log("ゲーム初期化開始");
        
        // ゲームモードの設定
        setupGameMode(gameState.mode);
        
        // モード表示の更新
        updateModeDisplay();
        
        // カードデッキの初期化
        gameState.playerDeck = [];
        gameState.enemyDeck = [];
        
        // すべてのカードをデッキに追加
        cards.forEach(card => {
            gameState.playerDeck.push(card.id);
            gameState.enemyDeck.push(card.id);
        });
        
        console.log(`デッキ初期化: ${gameState.playerDeck.length}枚のカード`);
        
        // デッキのシャッフル
        shuffle(gameState.playerDeck);
        shuffle(gameState.enemyDeck);
        
        // 初期手札を配る
        const modeConfig = gameModes[gameState.mode];
        gameState.playerHand = [];
        gameState.enemyHand = [];
        
        console.log(`初期手札枚数: ${modeConfig.initialHandSize}枚`);
        
        // プレイヤーの初期手札
        for (let i = 0; i < modeConfig.initialHandSize; i++) {
            if (gameState.playerDeck.length > 0) {
                const cardId = gameState.playerDeck.shift();
                gameState.playerHand.push(cardId);
                console.log(`プレイヤー初期手札に追加: カードID ${cardId}`);
            }
        }
        
        console.log(`初期手札配布完了: ${gameState.playerHand.length}枚`);
        
        // 敵の初期手札
        for (let i = 0; i < modeConfig.initialHandSize; i++) {
            if (gameState.enemyDeck.length > 0) {
                gameState.enemyHand.push(gameState.enemyDeck.shift());
            }
        }
        
        // コンボモードの場合は初期コンボ値を0に設定
        if (gameState.mode === 'combo') {
            gameState.playerCombo = 0;
        }
        
        // 最初のターンをプレイヤーのターンに設定
        gameState.turn = 1;
        gameState.isPlayerTurn = true;
        
        // UIの更新
        updateUI();
        
        // ゲームログを初期化
        addLogMessage('ゲームを開始しました。');
        addLogMessage(`【${modeConfig.name}】 - ${modeConfig.description}`);
        addLogMessage('あなたのターンです。');
        
        // カード説明を表示
        addLogMessage('【カード説明】');
        addLogMessage('・左上の青い数字: カードコスト（使用に必要な瘴気の量）');
        addLogMessage('・右上のオレンジ色の数字: コンボ値（コンボモード時に効果が上昇）');
        addLogMessage('・カードをクリックして選択、ダブルクリックで使用できます');
        addLogMessage('・カードを使用すると自動的にターンが終了します');
        
        // オンラインモードの場合はプレイヤーリストを表示
        if (gameState.gameType === 'online') {
            showPlayersList();
        }
    } catch (error) {
        console.error("ゲーム初期化中にエラーが発生しました:", error);
        alert("ゲームの初期化中にエラーが発生しました。ページを再読み込みしてください。");
    }
}

// ゲームモード設定
function setupGameMode(mode) {
    const modeConfig = gameModes[mode];
    gameState.playerHP = modeConfig.initialHP;
    gameState.playerMaxHP = modeConfig.maxHP;
    gameState.playerMaxMP = modeConfig.maxMP;
    gameState.playerCurrentMP = modeConfig.initialMP;
    gameState.enemyHP = modeConfig.initialHP;
    gameState.enemyMaxHP = modeConfig.maxHP;
    gameState.enemyMaxMP = modeConfig.maxMP;
    gameState.enemyCurrentMP = modeConfig.initialMP;
    gameState.maxHand = modeConfig.maxHandSize;
    gameState.drawPerTurn = modeConfig.drawPerTurn;
}

// UI更新関数
function updateUI() {
    // 手札を更新
    updateHand();
    
    // HPとMPの表示を更新
    updateStatusBars();
    
    // コンボ表示
    if (gameModes[gameState.mode].comboEnabled) {
        comboDisplayElement.textContent = `コンボ: ${gameState.playerCombo}`;
        comboDisplayElement.style.display = 'block';
    } else {
        comboDisplayElement.style.display = 'none';
    }
    
    // ゲームモード表示の更新
    updateModeDisplay();
}

// 手札更新関数
function updateHand() {
    if (!playerHandElement) {
        console.error("プレイヤーの手札要素が見つかりません");
        // 要素を再取得してみる
        playerHandElement = document.getElementById('player-hand');
        if (!playerHandElement) {
            console.error("再取得してもプレイヤーの手札要素が見つかりません");
            return;
        }
    }
    
    console.log("手札更新開始", gameState.playerHand);
    
    // 既存の手札をクリア
    playerHandElement.innerHTML = '';
    
    // 手札情報の表示を更新
    const infoElement = document.createElement('div');
    infoElement.className = 'hand-info';
    infoElement.textContent = `手札: ${gameState.playerHand.length}/${gameModes[gameState.mode].maxHandSize}`;
    playerHandElement.appendChild(infoElement);
    
    // 各カードを表示
    if (gameState.playerHand.length === 0) {
        const emptyHandMsg = document.createElement('div');
        emptyHandMsg.className = 'empty-hand-message';
        emptyHandMsg.textContent = "手札がありません。ターンを終了すると新しいカードを引きます。";
        playerHandElement.appendChild(emptyHandMsg);
        console.log("空の手札メッセージを表示");
    } else {
        let displayedCards = 0;
        gameState.playerHand.forEach((cardId, index) => {
            const card = cards.find(c => c.id === cardId);
            if (card) {
                const cardElement = createCardElement(card);
                playerHandElement.appendChild(cardElement);
                displayedCards++;
            } else {
                console.error(`ID ${cardId} のカードが見つかりません (手札インデックス: ${index})`);
            }
        });
        console.log(`${displayedCards}枚のカードを表示しました`);
    }
    
    // 手札カウントを更新
    if (handCountElement && maxHandElement) {
        handCountElement.textContent = gameState.playerHand.length;
        maxHandElement.textContent = gameModes[gameState.mode].maxHandSize;
    }
    
    // カード使用ボタンの追加
    const useCardButton = document.createElement('button');
    useCardButton.className = 'card-use-button';
    useCardButton.textContent = 'カードを使用';
    useCardButton.disabled = !gameState.selectedCardId;
    useCardButton.addEventListener('click', () => {
        if (gameState.selectedCardId) {
            playSelectedCard();
        } else {
            addLogMessage("使用するカードを選択してください。");
        }
    });
    playerHandElement.appendChild(useCardButton);
}

// ステータスバー更新
function updateStatusBars() {
    // プレイヤーのHP表示（数値のみ）
    playerHPValue.textContent = `${gameState.playerHP} / ${gameModes[gameState.mode].maxHP}`;
    
    // プレイヤーのMP表示（数値のみ）
    playerMPValue.textContent = `${gameState.playerCurrentMP} / ${gameState.playerMaxMP}`;
    
    // 敵のHP表示（数値のみ）
    enemyHPValue.textContent = `${gameState.enemyHP} / ${gameModes[gameState.mode].maxHP}`;
    
    // 敵のMP表示（数値のみ）
    enemyMPValue.textContent = `${gameState.enemyCurrentMP} / ${gameState.enemyMaxMP}`;
    
    // 手札情報の更新
    if (handCountElement && maxHandElement) {
        handCountElement.textContent = gameState.playerHand.length;
        maxHandElement.textContent = gameModes[gameState.mode].maxHandSize;
    }
    
    // ステータスバーの視覚的更新
    if (playerHPBar) {
        const hpPercentage = (gameState.playerHP / gameModes[gameState.mode].maxHP) * 100;
        playerHPBar.style.width = `${Math.max(0, hpPercentage)}%`;
    }
    
    if (playerMPBar) {
        const mpPercentage = (gameState.playerCurrentMP / gameState.playerMaxMP) * 100;
        playerMPBar.style.width = `${Math.max(0, mpPercentage)}%`;
    }
    
    if (enemyHPBar) {
        const enemyHpPercentage = (gameState.enemyHP / gameModes[gameState.mode].maxHP) * 100;
        enemyHPBar.style.width = `${Math.max(0, enemyHpPercentage)}%`;
    }
    
    if (enemyMPBar) {
        const enemyMpPercentage = (gameState.enemyCurrentMP / gameState.enemyMaxMP) * 100;
        enemyMPBar.style.width = `${Math.max(0, enemyMpPercentage)}%`;
    }
}

// カードを選択する
function selectCard(cardId) {
    // 既に選択されている場合は選択解除
    if (gameState.selectedCardId === cardId) {
        gameState.selectedCardId = null;
        
        // 選択解除の視覚的表示
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 実行ボタンを非表示
        const playButton = document.getElementById('play-card-button');
        if (playButton) {
            playButton.style.display = 'none';
        }
        
        return;
    }
    
    // 新しいカードを選択
    gameState.selectedCardId = cardId;
    
    // 全てのカードから選択状態を解除
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 選択されたカードを強調表示
    const selectedCardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    if (selectedCardElement) {
        selectedCardElement.classList.add('selected');
    }
    
    // 実行ボタンを表示
    const playButton = document.getElementById('play-card-button');
    if (playButton) {
        playButton.style.display = 'block';
        
        // ボタンクリックでカードを使用
        playButton.onclick = () => {
            playCard(cardId);
            // 選択状態をリセット
            gameState.selectedCardId = null;
            playButton.style.display = 'none';
        };
    }
}

// ログメッセージ追加関数
function addLogMessage(message) {
    // ログ配列に追加
    gameState.log.push(message);
    
    // DOM更新
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logMessagesElement.appendChild(logEntry);
    
    // 自動スクロール
    logMessagesElement.scrollTop = logMessagesElement.scrollHeight;
    
    // スピードモードでは古いログを削除
    if (gameState.mode === 'speed' && logMessagesElement.children.length > 10) {
        logMessagesElement.removeChild(logMessagesElement.children[0]);
    }
}

// 特殊効果の処理
function processEndTurnEffects() {
    // 特殊効果があれば処理
    if (gameState.effects && gameState.effects.length > 0) {
        const activeEffects = [...gameState.effects];
        
        activeEffects.forEach(effect => {
            // 効果のタイプによって処理を分岐
            if (effect.type === 'comboGrowth') {
                gameState.playerCombo += effect.value;
                addLogMessage(`狂気の刻印により、コンボ値が${effect.value}増加した！(${gameState.playerCombo})`);
            } else if (effect.type === 'corruption') {
                gameState.playerHP -= effect.value;
                addLogMessage(`腐敗効果により、正気度が${effect.value}減少した。`);
            } else if (effect.type === 'mpGrowth') {
                gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + effect.value);
                addLogMessage(`瘴気増加効果により、瘴気が${effect.value}増えた。`);
            }
        });
        
        // 持続時間を減少させ、期限切れの効果を削除
        gameState.effects = gameState.effects.filter(effect => {
            if (effect.duration > 0) {
                effect.duration--;
            }
            return effect.duration > 0 || effect.duration === -1; // -1は永続効果
        });
    }
}

// ターン開始時の効果処理
function processTurnStartEffects() {
    // 特殊効果があれば処理
    if (gameState.effects && gameState.effects.length > 0) {
        const activeEffects = [...gameState.effects];
        
        activeEffects.forEach(effect => {
            // 効果のタイプによって処理を分岐
            if (effect.type === 'selfDamage') {
                gameState.playerHP -= effect.value;
                addLogMessage(`反動効果により、${effect.value}ダメージを受けた。`);
            }
        });
        
        // 持続時間を減少させ、期限切れの効果を削除
        gameState.effects = gameState.effects.filter(effect => {
            if (effect.duration > 0) {
                effect.duration--;
            }
            return effect.duration > 0 || effect.duration === -1; // -1は永続効果
        });
    }
}

// 特殊効果の追加
function addEffect(type, value, duration, name) {
    if (!gameState.effects) {
        gameState.effects = [];
    }
    
    // 同じ種類の効果がすでにある場合は上書き
    const existingIndex = gameState.effects.findIndex(e => e.type === type);
    if (existingIndex !== -1) {
        gameState.effects[existingIndex].value = value;
        gameState.effects[existingIndex].duration = duration;
        gameState.effects[existingIndex].name = name;
    } else {
        // 新しい効果を追加
        gameState.effects.push({
            type: type,
            value: value,
            duration: duration,
            name: name
        });
    }
    
    addLogMessage(`「${name}」の効果が発動した！`);
}

// 特殊効果の値を取得
function getEffectValue(type) {
    if (!gameState.effects) return 0;
    
    const effect = gameState.effects.find(e => e.type === type);
    return effect ? effect.value : 0;
}

// ゲームオーバー処理
function gameOver(isWin) {
    // ゲーム終了メッセージ
    if (isWin) {
        addLogMessage("勝利！ あなたは呪いに打ち勝った！");
    } else {
        addLogMessage("敗北... あなたは呪いに飲み込まれた...");
    }
    
    // カードボタンを無効化
    disableCardButtons();
    
    // ターン終了ボタンを無効化
    endTurnButton.disabled = true;
    
    // リプレイボタン追加
    addReplayButton();
    
    // モード変更ボタン追加
    addModeChangeButton();
}

// リプレイボタン追加
function addReplayButton() {
    const replayButton = document.createElement('button');
    replayButton.id = 'replay-button';
    replayButton.classList.add('game-button');
    replayButton.textContent = '再戦';
    replayButton.addEventListener('click', resetGame);
    
    // ボタンエリアに追加
    const buttonArea = document.querySelector('.button-area');
    buttonArea.appendChild(replayButton);
}

// モード変更ボタン追加
function addModeChangeButton() {
    const modeButton = document.createElement('button');
    modeButton.id = 'mode-button';
    modeButton.classList.add('game-button');
    modeButton.textContent = 'モード変更';
    
    modeButton.addEventListener('click', () => {
        // モードを切り替え
        const modes = Object.keys(gameModes);
        const currentIndex = modes.indexOf(gameState.mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        gameState.mode = modes[nextIndex];
        
        // ゲームをリセット
        resetGame();
    });
    
    // ボタンエリアに追加
    const buttonArea = document.querySelector('.button-area');
    buttonArea.appendChild(modeButton);
}

// カードボタンを無効化
function disableCardButtons() {
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.disabled = true;
    });
}

// カードボタンを有効化
function enableCardButtons() {
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.disabled = false;
    });
}

// ゲームリセット
function resetGame() {
    // ゲーム状態のリセット
    const modeConfig = gameModes[gameState.mode];
    gameState.turn = 1;
    gameState.playerHP = modeConfig.initialHP;
    gameState.playerMaxMP = modeConfig.maxMP;
    gameState.playerCurrentMP = modeConfig.initialMP;
    gameState.enemyHP = modeConfig.initialHP;
    gameState.enemyMaxMP = modeConfig.maxMP;
    gameState.enemyCurrentMP = modeConfig.initialMP;
    gameState.playerCombo = 0;
    gameState.enemyCombo = 0;
    gameState.effects = [];
    gameState.selectedCardId = null;
    
    // デッキと手札をリセット
    const allCards = cards.map(card => card.id);
    gameState.playerDeck = [...allCards];
    shuffle(gameState.playerDeck);
    
    // 初期手札を配る
    gameState.playerHand = [];
    const initialHandSize = modeConfig.initialHandSize || 9; // 初期手札のデフォルト値を9に
    for (let i = 0; i < initialHandSize; i++) {
        if (gameState.playerDeck.length > 0) {
            gameState.playerHand.push(gameState.playerDeck.shift());
        }
    }
    
    // ログをクリア
    gameState.log = ["claude王国へようこそ…"];
    logMessagesElement.innerHTML = '';
    addLogMessage(`${gameState.playerName}よ、新たな対戦が始まった…`);
    addLogMessage(`【${gameModes[gameState.mode].name}】 - ${gameModes[gameState.mode].description}`);
    
    if (gameState.gameType === 'online') {
        addLogMessage(`合言葉「${gameState.roomCode}」の部屋で対戦します。`);
    } else {
        addLogMessage("瘴気が満ちる王国で、あなたの戦いが始まる。");
    }
    
    // UI更新
    updateUI();
    
    // 追加したボタンを削除
    const replayButton = document.getElementById('replay-button');
    if (replayButton) replayButton.remove();
    
    const modeButton = document.getElementById('mode-button');
    if (modeButton) modeButton.remove();
    
    // ボタンを有効化
    endTurnButton.disabled = false;
}

// ゲームモード切り替え
function toggleGameMode() {
    const modes = Object.keys(gameModes);
    const currentIndex = modes.indexOf(gameState.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    gameState.mode = modes[nextIndex];
    
    addLogMessage(`ゲームモードを【${gameModes[gameState.mode].name}】に変更しました。`);
    resetGame();
    
    // モード表示を更新
    updateModeDisplay();
}

// ゲームモード表示を更新
function updateModeDisplay() {
    if (!currentModeDisplayElement) return;
    
    // モード名を取得
    const modeName = gameModes[gameState.mode].name || "通常モード";
    
    // 表示を更新
    currentModeDisplayElement.textContent = modeName;
    
    // モードツールチップのアクティブ状態を更新
    document.querySelectorAll('#mode-tooltip .mode-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const activeOption = document.getElementById(`${gameState.mode}-mode`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
}

// ヘルプモーダルの表示/非表示
function toggleHelpModal() {
    keyboardShortcutsModal.classList.toggle('hidden');
}

// 配列をシャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// イベントリスナーのセットアップ
function setupEventListeners() {
    try {
        // ターン終了ボタン
        endTurnButton.addEventListener('click', endTurn);
        
        // ヘルプボタン
        helpButton.addEventListener('click', toggleHelpModal);
        
        // ヘルプを閉じるボタン
        closeHelpButton.addEventListener('click', toggleHelpModal);
        
        // ゲームモードインジケータ
        document.getElementById('game-mode-indicator').addEventListener('click', function(event) {
            // ツールチップの表示中にクリックした場合のみモード切替
            if (event.target.classList.contains('mode-option')) {
                const clickedMode = event.target.id.replace('-mode', '');
                if (gameState.mode !== clickedMode) {
                    gameState.mode = clickedMode;
                    addLogMessage(`ゲームモードを【${gameModes[gameState.mode].name}】に変更しました。`);
                    resetGame();
                    updateModeDisplay();
                }
            }
        });
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            // ESCキーでヘルプを閉じる
            if (e.key === 'Escape' && !keyboardShortcutsModal.classList.contains('hidden')) {
                toggleHelpModal();
                return;
            }
            
            // モーダルが表示されている間は他のショートカットを無効化
            if (!keyboardShortcutsModal.classList.contains('hidden')) {
                return;
            }
            
            // スペースキーでターン終了
            if (e.code === 'Space' && !endTurnButton.disabled) {
                e.preventDefault();
                endTurn();
            }
            
            // Mキーでゲームモード切替
            if (e.key === 'm' || e.key === 'M') {
                toggleGameMode();
            }
            
            // 数字キーでカード選択（1〜9）
            const numKey = parseInt(e.key);
            if (!isNaN(numKey) && numKey >= 1 && numKey <= 9) {
                const index = numKey - 1;
                if (index < gameState.playerHand.length) {
                    const cardId = gameState.playerHand[index];
                    // 直接playCardを呼ばずに選択状態を切り替える
                    selectCard(cardId);
                }
            }
        });
        
        // カードがプレイされた時のエフェクト
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('card-button') && !event.target.disabled) {
                event.target.classList.add('card-playing');
                // アニメーション後にクラスを削除
                setTimeout(() => {
                    event.target.classList.remove('card-playing');
                }, 500);
            }
        });
    } catch (error) {
        console.error("イベントリスナーの設定中にエラーが発生しました:", error);
    }
}

// カード要素を作成する関数
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.cardId = card.id;
    cardElement.dataset.cardType = card.type;
    
    // カードのプレイ可能状態を確認
    const isPlayable = card.cost <= gameState.playerCurrentMP;
    if (!isPlayable) {
        cardElement.classList.add('unplayable');
    }
    
    // カード名
    const nameElement = document.createElement('div');
    nameElement.className = 'card-name';
    nameElement.textContent = card.name;
    cardElement.appendChild(nameElement);
    
    // カードタイプ
    const typeElement = document.createElement('div');
    typeElement.className = 'card-type';
    typeElement.textContent = card.type;
    cardElement.appendChild(typeElement);
    
    // コスト表示
    const costElement = document.createElement('div');
    costElement.className = 'card-cost';
    costElement.textContent = card.cost;
    cardElement.appendChild(costElement);
    
    // コンボ値表示
    const comboElement = document.createElement('div');
    comboElement.className = 'card-combo';
    comboElement.textContent = card.comboValue;
    cardElement.appendChild(comboElement);
    
    // カード効果
    const effectElement = document.createElement('div');
    effectElement.className = 'card-effect';
    effectElement.textContent = card.effect;
    cardElement.appendChild(effectElement);
    
    // キーワード能力
    if (card.keyword) {
        const keywordElement = document.createElement('div');
        keywordElement.className = 'card-keyword';
        keywordElement.textContent = card.keyword;
        cardElement.appendChild(keywordElement);
    }
    
    // シングルクリックでカード選択
    cardElement.addEventListener('click', () => {
        // コストが足りない場合は選択できない
        if (!isPlayable) {
            addLogMessage(`「${card.name}」は瘴気が足りません (コスト: ${card.cost})`);
            return;
        }
        
        // 選択状態を切り替え
        selectCard(card.id);
    });
    
    return cardElement;
}

// 選択したカードをプレイする関数
function playSelectedCard() {
    if (gameState.selectedCardId !== null) {
        // カードを使用
        playCard(gameState.selectedCardId);
        // 選択をリセット
        gameState.selectedCardId = null;
        // 手札の表示を更新
        updateHand();
    } else {
        addLogMessage("使用するカードを選択してください。");
    }
}

// カードをプレイする
function playCard(cardId) {
    // 選択されたカードを探す
    const cardIndex = gameState.playerHand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
        addLogMessage('カードが見つかりません');
        return;
    }
    
    const card = gameState.playerHand[cardIndex];
    
    // コストチェック
    if (card.cost > gameState.playerCurrentMP) {
        addLogMessage(`瘴気が足りません！ 必要: ${card.cost}, 現在: ${gameState.playerCurrentMP}`);
        return;
    }
    
    // コンボチェック・更新
    if (gameModes[gameState.mode].comboEnabled) {
        gameState.playerCombo++;
        updateComboDisplay();
    }
    
    // MPを減らす
    gameState.playerCurrentMP -= card.cost;
    
    // カード効果を適用
    addLogMessage(`[${gameState.turn}ターン] 「${card.name}」をプレイしました`);
    
    // カードタイプによる処理分岐
    if (card.type === "物理" || card.type === "呪術") {
        // 攻撃カード効果
        applyAttackCardEffect(card);
    } else if (card.type === "回復") {
        // 回復カード効果
        applyHealCardEffect(card);
    } else {
        // その他のカード効果（クリーチャー、遺物、策略）
        applyOtherCardEffect(card);
    }
    
    // カードをプレイ後、手札から削除
    gameState.playerHand.splice(cardIndex, 1);
    
    // 勝敗チェック
    checkWinCondition();
    
    // 表示更新
    updateGameDisplay();
    
    // 自動的にターンを終了する（簡略化のため）
    // 実際のゲームでは、複数のカードを連続して使えるようにする
    endPlayerTurn();
}

// 攻撃カードの効果を適用
function applyAttackCardEffect(card) {
    let damage = 0;
    
    // コンボ対応カードの処理
    if (card.id === 11) { // 瞬間消滅
        damage = gameState.playerCombo > 1 ? 4 : 2;
    } else if (card.id === 15) { // 魔力爆発
        damage = gameState.playerCombo * 2;
    } else if (card.id === 1) { // 魂喰らいの呪い
        damage = 4;
        // 回復効果も適用
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + 1);
        addLogMessage(`+1 正気度を回復しました`);
    } else if (card.id === 8) { // 死者の囁き
        damage = 7;
        // 山札に戻る効果
        gameState.playerDeck.push(card);
        addLogMessage(`「${card.name}」は山札に戻りました`);
    } else if (card.id === 12) { // 連鎖呪縛
        damage = 3;
        // カードを引く効果も適用
        if (gameState.playerCombo >= 3) {
            drawCards(1);
            addLogMessage(`コンボ効果: カードを1枚引きました`);
        }
    } else if (card.id === 21) { // 連続攻撃
        // 2回ダメージを与える
        damage = 2;
        gameState.enemyHP -= damage;
        addLogMessage(`敵に${damage}ダメージを与えました`);
        damage = 2; // 2回目のダメージ
    } else {
        // その他の攻撃カードの基本効果
        // カードの効果文からダメージ値を抽出
        const damageMatch = card.effect.match(/(\d+)ダメージ/);
        if (damageMatch) {
            damage = parseInt(damageMatch[1]);
        } else {
            // デフォルトダメージ
            damage = 1;
        }
    }
    
    // ダメージ適用
    gameState.enemyHP -= damage;
    addLogMessage(`敵に${damage}ダメージを与えました`);
}

// 回復カードの効果を適用
function applyHealCardEffect(card) {
    if (card.id === 23) { // 小休止
        const healAmount = 3;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 24) { // 浅い瞑想
        const mpHealAmount = 3;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 25) { // 応急手当
        const healAmount = 5;
        const mpCost = 1;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        gameState.playerCurrentMP = Math.max(0, gameState.playerCurrentMP - mpCost);
        addLogMessage(`正気度を${healAmount}回復し、瘴気を${mpCost}消費しました`);
    } else if (card.id === 26) { // 癒しの光
        const healAmount = 8;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 27) { // 瘴気集中
        const mpHealAmount = 8;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 28) { // 生命の雫
        const healAmount = 12;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 29) { // 生命湧出
        const healAmount = 20;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 30) { // 魔力解放
        const mpHealAmount = 20;
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 31) { // 再生
        const healAmount = 10;
        const mpHealAmount = 10;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpHealAmount);
        addLogMessage(`正気度を${healAmount}、瘴気を${mpHealAmount}回復しました`);
    } else if (card.id === 32) { // 魂の復活
        const healAmount = 30;
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + healAmount);
        addLogMessage(`正気度を${healAmount}回復しました`);
    } else if (card.id === 33) { // 生命と魔力の交換
        const hpLoss = 10;
        const mpGain = 15;
        gameState.playerHP = Math.max(1, gameState.playerHP - hpLoss);
        gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpGain);
        addLogMessage(`正気度を${hpLoss}失い、瘴気を${mpGain}得ました`);
    } else if (card.id === 34) { // 魔力と生命の交換
        const mpLoss = 10;
        const hpGain = 15;
        gameState.playerCurrentMP = Math.max(0, gameState.playerCurrentMP - mpLoss);
        gameState.playerHP = Math.min(gameState.playerMaxHP, gameState.playerHP + hpGain);
        addLogMessage(`瘴気を${mpLoss}失い、正気度を${hpGain}得ました`);
    } else if (card.id === 35) { // 完全回復
        const healToFull = gameState.playerMaxHP - gameState.playerHP;
        gameState.playerHP = gameState.playerMaxHP;
        addLogMessage(`正気度を${healToFull}回復し、最大まで回復しました`);
    }
}

// その他のカード効果を適用
function applyOtherCardEffect(card) {
    // カードIDによって異なる効果を適用
    if (card.id === 3) { // 血の取引
        gameState.playerHP = Math.max(1, gameState.playerHP - 3);
        addLogMessage(`正気度を3失いました`);
        drawCards(2);
        addLogMessage(`カードを2枚引きました`);
    } else if (card.id === 7) { // 闇の契約
        // 山札から呪術カードを1枚手札に追加
        const spellCards = gameState.playerDeck.filter(c => c.type === "呪術");
        if (spellCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * spellCards.length);
            const spellCard = spellCards[randomIndex];
            // 山札から削除して手札に追加
            gameState.playerDeck = gameState.playerDeck.filter(c => c !== spellCard);
            gameState.playerHand.push(spellCard);
            addLogMessage(`「${spellCard.name}」を山札から手札に加えました`);
        } else {
            addLogMessage(`山札に呪術カードがありません`);
        }
        
        // ダメージ効果
        gameState.playerHP = Math.max(1, gameState.playerHP - 2);
        addLogMessage(`自分に2ダメージを受けました`);
    } else if (card.id === 13) { // 時間加速
        // このターン、カードコストが1減少する効果を付与
        gameState.costReduction = 1;
        addLogMessage(`このターン、カードコストが1減少します`);
    } else if (card.id === 14) { // 狂気の刻印
        // 毎ターン終了時にコンボ値が+1される効果を付与
        gameState.comboBonus = 1;
        addLogMessage(`毎ターン終了時にコンボ値が+1されます`);
    } else if (card.id === 19) { // 戦術的後退
        drawCards(1);
        addLogMessage(`カードを1枚引きました`);
    } else {
        // その他のカード効果はここに追加
        addLogMessage(`「${card.name}」の効果が発動しました`);
    }
}

// ターン終了処理
function endTurn() {
    // ターン数を増やす
    gameState.turn++;
    
    // 特殊効果の処理
    processEndTurnEffects();
    
    // 敵のターン処理（簡易AI）
    processEnemyTurn();
    
    // 新しいターン開始処理
    startNewTurn();
}

// 敵のターン処理（簡易AI）
function processEnemyTurn() {
    // 瘴気の回復前の値を保存
    const previousMP = gameState.enemyCurrentMP;
    
    // 敵のMPを回復
    gameState.enemyCurrentMP = Math.min(gameState.enemyMaxMP, gameState.enemyCurrentMP + gameModes[gameState.mode].mpRegenRate);
    
    // 瘴気回復のログ表示
    if (gameState.enemyCurrentMP > previousMP) {
        const mpGain = gameState.enemyCurrentMP - previousMP;
        addLogMessage(`敵の瘴気が${mpGain}回復した。(${previousMP} → ${gameState.enemyCurrentMP})`);
    }
    
    // 敵のカード使用シミュレーション
    // 瘴気を使用するかどうかランダムに決定
    const useMP = gameState.enemyCurrentMP > 0 && Math.random() > 0.3;
    
    let damage = 0;
    
    if (useMP) {
        // 瘴気を使った強力な攻撃（2〜3の瘴気を消費）
        const mpCost = Math.min(gameState.enemyCurrentMP, Math.floor(Math.random() * 2) + 2);
        gameState.enemyCurrentMP -= mpCost;
        
        // ダメージ計算（瘴気を使うと強い）
        damage = mpCost * 2 + Math.floor(Math.random() * 3);
        
        addLogMessage(`敵が瘴気を${mpCost}消費して強力な攻撃を仕掛けてきた！`);
    } else {
        // 通常攻撃（瘴気を使わない）
        damage = Math.floor(Math.random() * 3) + 1; // 1〜3のダメージ
        addLogMessage(`敵が通常攻撃を仕掛けてきた。`);
    }
    
    // ダメージ軽減効果があれば適用
    const damageReduction = getEffectValue('damageReduction') || 0;
    if (damageReduction > 0) {
        const originalDamage = damage;
        damage = Math.max(1, damage - damageReduction);
        addLogMessage(`ダメージ軽減効果により、ダメージが${originalDamage}から${damage}に減少した。`);
    }
    
    // プレイヤーにダメージを与える
    gameState.playerHP -= damage;
    
    // ダメージを表示
    addLogMessage(`あなたに${damage}ダメージ！`);
    
    // プレイヤーの負け判定
    if (gameState.playerHP <= 0) {
        gameOver(false);
        return;
    }
    
    // 敵の瘴気状態をログに表示
    addLogMessage(`敵の瘴気: ${gameState.enemyCurrentMP}/${gameState.enemyMaxMP}`);
    
    // UI更新
    updateUI();
}

// 新しいターン開始処理
function startNewTurn() {
    gameState.isPlayerTurn = true;
    
    // ターン開始時のMP回復
    const mpRegen = gameModes[gameState.mode].mpRegenRate || 1;
    gameState.playerCurrentMP = Math.min(gameState.playerMaxMP, gameState.playerCurrentMP + mpRegen);
    
    // ターン開始時の効果処理
    processTurnStartEffects();
    
    // 効果の持続時間減少と期限切れチェック
    gameState.effects = gameState.effects.filter(effect => {
        effect.duration--;
        return effect.duration > 0 || effect.duration === -1; // 永続効果(-1)は残す
    });
    
    // カードを引く
    const drawCount = gameModes[gameState.mode].drawPerTurn || 1;
    drawCards(drawCount);
    
    // 手札が少ない場合は追加でカードを引く（最低3枚は確保）
    const minHandSize = 3;
    if (gameState.playerHand.length < minHandSize) {
        const additionalCards = minHandSize - gameState.playerHand.length;
        addLogMessage(`手札が少ないため、追加で${additionalCards}枚引きます。`);
        drawCards(additionalCards);
    }
    
    // UIを更新
    updateUI();
    
    // ログにメッセージを追加
    addLogMessage(`ターン${gameState.turn}：あなたのターンです。`);
    
    // ステータス効果のメッセージ
    if (gameState.effects.length > 0) {
        const effectMessages = gameState.effects.map(e => {
            const duration = e.duration === -1 ? "永続" : `残り${e.duration}ターン`;
            return `${e.name}(${duration})`;
        });
        addLogMessage(`有効な効果：${effectMessages.join(', ')}`);
    }
}

// カードを引く関数
function drawCards(count) {
    const maxHandSize = gameModes[gameState.mode].maxHandSize;
    let cardsDrawn = 0;
    
    for (let i = 0; i < count; i++) {
        // 手札がいっぱいならこれ以上引かない
        if (gameState.playerHand.length >= maxHandSize) {
            addLogMessage(`手札がいっぱいです（最大${maxHandSize}枚）。`);
            break;
        }
        
        // デッキが空なら再構築
        if (gameState.playerDeck.length === 0) {
            reshufflePlayerDeck();
        }
        
        // カードを引く
        if (gameState.playerDeck.length > 0) {
            const cardId = gameState.playerDeck.shift();
            gameState.playerHand.push(cardId);
            cardsDrawn++;
        }
    }
    
    if (cardsDrawn > 0) {
        addLogMessage(`カードを${cardsDrawn}枚引きました。`);
    }
    
    // 手札の更新
    updateHand();
}

// プレイヤーデッキを再構築する
function reshufflePlayerDeck() {
    addLogMessage("デッキが空になりました。新しいデッキを構築します...");
    
    // 新しいデッキを作成
    gameState.playerDeck = [];
    cards.forEach(card => {
        gameState.playerDeck.push(card.id);
    });
    
    // シャッフル
    shuffle(gameState.playerDeck);
    addLogMessage("デッキをリセットしました。");
}

// 勝敗条件をチェックする関数
function checkWinCondition() {
    if (gameState.enemyHP <= 0) {
        // プレイヤーの勝利
        addLogMessage(`敵の正気度が0になりました！あなたの勝利です！`);
        gameOver(true);
        return true;
    } else if (gameState.playerHP <= 0) {
        // プレイヤーの敗北
        addLogMessage(`あなたの正気度が0になりました！あなたの敗北です...`);
        gameOver(false);
        return true;
    }
    return false;
}

// コンボ表示を更新する関数
function updateComboDisplay() {
    const comboElement = document.getElementById('combo-display');
    if (comboElement) {
        if (gameState.playerCombo > 1) {
            comboElement.textContent = `コンボ: ${gameState.playerCombo}`;
            comboElement.style.display = 'block';
            
            // アニメーション効果
            comboElement.classList.add('combo-flash');
            setTimeout(() => {
                comboElement.classList.remove('combo-flash');
            }, 500);
        } else {
            comboElement.style.display = 'none';
        }
    }
}

// プレイヤーデッキを再構築する
function reshufflePlayerDeck() {
    addLogMessage("デッキが空になりました。新しいデッキを構築します...");
    
    // 新しいデッキを作成
    gameState.playerDeck = [];
    cards.forEach(card => {
        gameState.playerDeck.push(card.id);
    });
    
    // シャッフル
    shuffle(gameState.playerDeck);
    addLogMessage("デッキをリセットしました。");
}

// プレイヤーのターン終了処理
function endPlayerTurn() {
    // 特殊効果の処理（例：毎ターン終了時のコンボ増加）
    if (gameState.comboBonus > 0) {
        gameState.playerCombo += gameState.comboBonus;
        addLogMessage(`コンボボーナス効果: コンボ値が${gameState.comboBonus}増加しました (現在: ${gameState.playerCombo})`);
        updateComboDisplay();
    }
    
    // ターンを敵に移す
    addLogMessage(`ターン終了：${gameState.turn}ターン目`);
    
    // 敵のターン処理を実行
    setTimeout(() => {
        enemyTurn();
    }, 1000);
}

// ゲーム表示の更新
function updateGameDisplay() {
    // ステータスバーの更新
    updateStatusBars();
    
    // 手札の表示更新
    updateHandDisplay();
    
    // コンボ表示の更新
    if (gameModes[gameState.mode].comboEnabled) {
        updateComboDisplay();
    }
    
    // アニメーション効果
    const gameboardElement = document.querySelector('.game-board');
    if (gameboardElement) {
        gameboardElement.classList.add('update-effect');
        setTimeout(() => {
            gameboardElement.classList.remove('update-effect');
        }, 300);
    }
} 