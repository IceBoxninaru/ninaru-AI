// All of the Node.js APIs are available in the preload process.
// Electronのセキュリティ機能を考慮したpreloadスクリプト
window.addEventListener('DOMContentLoaded', () => {
  // ここでレンダラープロセス（Webページ）側で利用する
  // APIや機能を追加できます
  
  // 例：バージョン情報を表示
  const versionInfo = document.createElement('div');
  versionInfo.style.position = 'absolute';
  versionInfo.style.bottom = '5px';
  versionInfo.style.right = '5px';
  versionInfo.style.fontSize = '10px';
  versionInfo.style.color = '#555';
  versionInfo.textContent = `claude王国 v1.0.0`;
  document.body.appendChild(versionInfo);
}); 