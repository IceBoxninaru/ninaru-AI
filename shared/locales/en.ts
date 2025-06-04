import { ErrorTemplate } from '../constants/errorMessages';

export const enErrorMessages: Record<string, Omit<ErrorTemplate, 'code' | 'severity'>> = {
  // Connection related errors
  'CONNECTION_LOST': {
    title: 'Connection Error',
    message: 'Connection to the server has been lost.',
    suggestion: 'Please check your internet connection and reload the page.'
  },
  'CONNECTION_FAILED': {
    title: 'Connection Error',
    message: 'Failed to connect to the server.',
    suggestion: 'Please wait a moment and try again.'
  },

  // Game state related errors
  'GAME_STATE_INVALID': {
    title: 'Game State Error',
    message: 'The game state is invalid.',
    suggestion: 'Please restart the game.'
  },
  'GAME_NOT_INITIALIZED': {
    title: 'Initialization Error',
    message: 'The game has not been properly initialized.',
    suggestion: 'Please reload the page.'
  },

  // Card operation related errors
  'CARD_NOT_FOUND': {
    title: 'Card Error',
    message: 'The specified card was not found.',
    suggestion: 'Please select a different card.'
  },
  'INVALID_CARD_PLAY': {
    title: 'Card Play Error',
    message: 'This card cannot be played at this time.',
    suggestion: 'Please choose a different card.'
  },

  // Player related errors
  'PLAYER_NOT_FOUND': {
    title: 'Player Error',
    message: 'The specified player was not found.',
    suggestion: 'Please select a different target player.'
  },
  'INVALID_TURN': {
    title: 'Turn Error',
    message: 'It is not your turn.',
    suggestion: 'Please wait for your turn.'
  },

  // Recovery related notifications
  'RECOVERY_IN_PROGRESS': {
    title: 'Recovery in Progress',
    message: 'Attempting to recover from error.',
    suggestion: 'Please wait a moment.'
  },
  'RECOVERY_SUCCESS': {
    title: 'Recovery Success',
    message: 'Successfully recovered from error.',
    suggestion: 'You can continue playing.'
  }
}; 