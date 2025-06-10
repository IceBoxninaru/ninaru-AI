const { app, BrowserWindow } = require('electron');
const path = require('path');

// アプリのウィンドウを保持する変数
let mainWindow;

// ウィンドウを作成する関数
function createWindow() {
  // ブラウザウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false, // セキュリティのため無効化
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // 必要な場合
    },
    icon: path.join(__dirname, 'icon.png'), // アイコンファイル（作成してください）
    title: 'claude王国',
    fullscreen: true, // フルスクリーンモードで起動
    backgroundColor: '#1a1a1a' // 背景色を設定
  });

  // index.htmlをロード
  mainWindow.loadFile('index.html');

  // 開発者ツールを開く場合（開発時のみ）
  // mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたときの処理
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  
  // ESCキーでフルスクリーン解除を無効化（ゲーム内でESCキーを使用するため）
  mainWindow.setMenuBarVisibility(false);
}

// Electronの初期化完了後にウィンドウを作成
app.whenReady().then(createWindow);

// すべてのウィンドウが閉じられたときの処理
app.on('window-all-closed', function () {
  // macOSでは、ユーザーがCmd + Qで明示的に終了するまで
  // アプリケーションとそのメニューバーは有効なままにするのが一般的
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // macOSでは、ドックアイコンクリック時に
  // 開いているウィンドウがない場合は新しいウィンドウを作成するのが一般的
  if (mainWindow === null) createWindow();
}); 