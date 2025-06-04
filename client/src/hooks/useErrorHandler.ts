import { useState, useCallback } from 'react';
import ErrorLogger from '../utils/errorLogger';
import ErrorRecovery from '../utils/errorRecovery';
import { ErrorMessageManager } from '../utils/errorMessageManager';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

interface ErrorState {
  errorKey: keyof typeof ERROR_MESSAGES;
  context?: {
    component?: string;
    action?: string;
    data?: any;
  };
  timestamp: number;
}

interface ErrorHandlerOptions {
  enableAutoRecovery?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export const useErrorHandler = (
  componentName?: string,
  options: ErrorHandlerOptions = {}
) => {
  const [errors, setErrors] = useState<ErrorState[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);
  const errorLogger = ErrorLogger.getInstance();
  const errorRecovery = ErrorRecovery.getInstance();
  const errorManager = ErrorMessageManager.getInstance();

  const {
    enableAutoRecovery = true,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const addError = useCallback(async (
    errorKey: keyof typeof ERROR_MESSAGES,
    context?: ErrorState['context']
  ) => {
    const errorState: ErrorState = {
      errorKey,
      context: {
        component: componentName,
        ...context
      },
      timestamp: Date.now()
    };

    setErrors(prev => [...prev, errorState]);
    
    const template = errorManager.getErrorTemplate(errorKey, context);
    const formattedMessage = errorManager.formatErrorMessage(template, context);
    errorLogger.log({
      message: formattedMessage,
      type: template.severity.toLowerCase(),
      timestamp: errorState.timestamp,
      context: errorState.context
    });

    // エラーリカバリーの試行
    if (enableAutoRecovery && template.severity === 'ERROR' && context?.action) {
      setIsRecovering(true);
      let retryCount = 0;
      let recovered = false;

      while (retryCount < maxRetries && !recovered) {
        try {
          recovered = await errorRecovery.autoRecover(
            new Error(formattedMessage),
            {
              type: context.component === 'GameBoard' ? 'GAME' :
                    context.component === 'PlayerHand' ? 'PLAYER' : 'CARD',
              action: context.action,
              data: context.data
            }
          );

          if (recovered) {
            setErrors(prev => [
              ...prev,
              {
                errorKey: 'RECOVERY_SUCCESS',
                context: {
                  component: componentName,
                  action: 'RECOVERY',
                  data: { originalError: errorKey }
                },
                timestamp: Date.now()
              }
            ]);
          }
        } catch (e) {
          console.error('リカバリー試行中にエラーが発生しました:', e);
        }

        if (!recovered) {
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }

      setIsRecovering(false);
    }

    // 5秒後にエラーを自動的に削除
    setTimeout(() => {
      setErrors(prev => prev.filter(error => error.timestamp !== errorState.timestamp));
    }, 5000);
  }, [componentName, enableAutoRecovery, maxRetries, retryDelay]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const removeError = useCallback((timestamp: number) => {
    setErrors(prev => prev.filter(error => error.timestamp !== timestamp));
  }, []);

  const getErrorAnalytics = useCallback(() => {
    return errorLogger.analyzeErrors();
  }, []);

  const exportErrorLogs = useCallback(() => {
    return errorLogger.exportLogs();
  }, []);

  const getRecoveryStats = useCallback(() => {
    return errorRecovery.getRecoveryStats();
  }, []);

  return {
    errors,
    isRecovering,
    addError,
    clearErrors,
    removeError,
    getErrorAnalytics,
    exportErrorLogs,
    getRecoveryStats
  };
}; 