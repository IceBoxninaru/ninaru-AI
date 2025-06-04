import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { GameBoard } from './components/GameBoard';
import { GameContextProvider, useGame } from './contexts/GameContext';
import { validateGameId, validatePlayerName, sanitizeInput } from './utils/validation';
import PlayerHand from './components/PlayerHand';
import WeatherDisplay from './components/WeatherDisplay';
import StatusEffects from './components/StatusEffects';
import GameHistory from './components/GameHistory';
import ErrorDisplay from './components/ErrorDisplay';
import ErrorAnalytics from './components/ErrorAnalytics';
import RecoveryStatus from './components/RecoveryStatus';
import { IWeather, IPlayer, IStatusEffect, ICardData, WeatherKind } from '../../shared/types/game';
import './App.css';

const App = (): React.ReactElement => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameId, setGameId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      setError('');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setError('サーバーとの接続が切断されました');
    });

    socket.on('joinError', (message: string) => {
      setError(message);
      setIsJoined(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('joinError');
    };
  }, []);

  const handleJoinGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateGameId(gameId)) {
      setError('ゲームIDは4-12文字の英数字で入力してください');
      return;
    }

    if (!validatePlayerName(playerName)) {
      setError('プレイヤー名は2-20文字で入力してください（空白は使用できません）');
      return;
    }

    const sanitizedGameId = sanitizeInput(gameId);
    const sanitizedPlayerName = sanitizeInput(playerName);

    socket.emit('joinGame', {
      gameId: sanitizedGameId,
      playerName: sanitizedPlayerName
    });
    setIsJoined(true);
  };

  if (!isConnected) {
    return <div className="connection-status">サーバーに接続中...</div>;
  }

  if (!socket.id) {
    return <div className="connection-status">接続を確立中...</div>;
  }

  if (!isJoined) {
    return (
      <div className="join-game">
        <h1>クロード王国</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleJoinGame}>
          <div className="form-group">
            <label htmlFor="gameId">ゲームID:</label>
            <input
              type="text"
              id="gameId"
              value={gameId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameId(e.target.value)}
              required
              pattern="[a-zA-Z0-9]{4,12}"
              title="4-12文字の英数字"
            />
          </div>
          <div className="form-group">
            <label htmlFor="playerName">プレイヤー名:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
              required
              minLength={2}
              maxLength={20}
              pattern="\S+"
              title="2-20文字（空白は使用できません）"
            />
          </div>
          <button type="submit">ゲームに参加</button>
        </form>
      </div>
    );
  }

  return (
    <GameContextProvider gameId={gameId} playerId={socket.id}>
      <GameContent />
    </GameContextProvider>
  );
};

const GameContent = (): React.ReactElement => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const { 
    gameState, 
    gameHistory, 
    isLoading,
    errors,
    isRecovering,
    playCard,
    endTurn,
    removeError
  } = useGame();

  if (isLoading) {
    return <div className="loading">ゲームを読み込んでいます...</div>;
  }

  if (!gameState) {
    return <div className="error">ゲームの初期化に失敗しました。</div>;
  }

  const currentPlayer = gameState.players.find((p: IPlayer) => p.id === gameState.currentPlayerId);

  return (
    <div className="game-container">
      <div className="error-container">
        {errors.map(error => (
          <ErrorDisplay
            key={error.timestamp}
            errorKey={error.errorKey}
            context={error.context}
            timestamp={error.timestamp}
            onClose={removeError}
          />
        ))}
      </div>

      <div className="game-header">
        <WeatherDisplay weather={gameState.weather.type} />
        <div className="header-buttons">
          <button
            className="analytics-button"
            onClick={() => setShowAnalytics(true)}
          >
            エラー分析
          </button>
          <button
            className={`recovery-button ${isRecovering ? 'recovering' : ''}`}
            onClick={() => setShowRecovery(true)}
          >
            リカバリー状態
            {isRecovering && <div className="recovery-indicator" />}
          </button>
        </div>
      </div>
      
      <div className="game-board">
        <GameBoard
          players={gameState.players}
          currentPlayerId={gameState.currentPlayerId}
          onPlayerSelect={(targetId: string) => {
            // プレイヤー選択の処理
          }}
        />
      </div>

      <div className="status-effects">
        <StatusEffects effects={currentPlayer?.statusEffects || []} />
      </div>

      <div className="player-hand-container">
        <PlayerHand
          hand={currentPlayer?.hand || []}
          onCardSelect={playCard}
          isCurrentTurn={gameState.currentPlayerId === currentPlayer?.id}
        />
      </div>

      <div className="game-history">
        <GameHistory history={gameHistory} />
      </div>

      {gameState.currentPlayerId === currentPlayer?.id && (
        <button 
          className="end-turn-button"
          onClick={endTurn}
        >
          ターン終了
        </button>
      )}

      {showAnalytics && (
        <ErrorAnalytics onClose={() => setShowAnalytics(false)} />
      )}

      {showRecovery && (
        <RecoveryStatus onClose={() => setShowRecovery(false)} />
      )}
    </div>
  );
};

export default App;