import { GameService } from './src/services/TestGameService.js';
import { ICardData } from '../shared/types/game.js';
import * as readline from 'readline';

const game = new GameService();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayGameState() {
  const state = game.getGameState();
  const player = state.players[0];
  const ai = state.players[1];

  console.log('\n現在の状態:');
  console.log(`ターン: ${state.turn}`);
  console.log(`天候: ${state.weather}`);
  console.log('\nプレイヤー:');
  console.log(`HP: ${player.hp}/${player.maxHp}`);
  console.log(`MP: ${player.mp}/${player.maxMp}`);
  console.log('手札:');
  player.hand.forEach((card: ICardData, index: number) => {
    console.log(`${index + 1}: ${card.name} (${card.type}, コスト: ${card.mpCost || 0})`);
  });

  console.log('\nAIプレイヤー:');
  console.log(`HP: ${ai.hp}/${ai.maxHp}`);
  console.log(`MP: ${ai.mp}/${ai.maxMp}`);
}

function promptAction() {
  displayGameState();
  console.log('\n行動を選択してください:');
  console.log('1-5: カードを使用');
  console.log('e: ターン終了');
  console.log('q: ゲーム終了');

  rl.question('> ', (answer) => {
    if (answer === 'q') {
      rl.close();
      return;
    }

    if (answer === 'e') {
      game.endTurn();
      console.log('ターン終了');
      game.processAITurn();
      game.endTurn();
      game.startTurn();
      promptAction();
      return;
    }

    const cardIndex = parseInt(answer) - 1;
    if (cardIndex >= 0 && cardIndex < game.getGameState().players[0].hand.length) {
      const success = game.playCard('human', cardIndex, 'ai');
      if (success) {
        console.log('カードを使用しました');
      } else {
        console.log('カードを使用できませんでした');
      }
    } else {
      console.log('無効な選択です');
    }

    if (game.isGameOver()) {
      const winner = game.getWinner();
      console.log(`\nゲーム終了! 勝者: ${winner?.name}`);
      rl.close();
      return;
    }

    promptAction();
  });
}

console.log('ゲーム開始!');
game.startTurn();
promptAction(); 