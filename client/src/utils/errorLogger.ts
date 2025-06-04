interface ErrorLog {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
  context?: {
    component?: string;
    action?: string;
    data?: any;
  };
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {
    // ローカルストレージからログを復元
    try {
      const savedLogs = localStorage.getItem('errorLogs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (e) {
      console.error('ログの復元に失敗しました:', e);
    }
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: ErrorLog): void {
    this.logs.push(error);
    
    // ログが最大数を超えた場合、古いものから削除
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // エラーの種類に応じてコンソールに出力
    switch (error.type) {
      case 'error':
        console.error('エラー:', error);
        break;
      case 'warning':
        console.warn('警告:', error);
        break;
      case 'info':
        console.info('情報:', error);
        break;
    }

    // ローカルストレージにログを保存
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('errorLogs', JSON.stringify(this.logs));
    } catch (e) {
      console.error('ログの保存に失敗しました:', e);
    }
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  getLogsByType(type: ErrorLog['type']): ErrorLog[] {
    return this.logs.filter(log => log.type === type);
  }

  getLogsByTimeRange(startTime: number, endTime: number): ErrorLog[] {
    return this.logs.filter(log => 
      log.timestamp >= startTime && log.timestamp <= endTime
    );
  }

  getErrorFrequency(): Record<string, number> {
    return this.logs.reduce((acc, log) => {
      const key = `${log.type}:${log.message}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('errorLogs');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  analyzeErrors(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    mostFrequentErrors: Array<{ message: string; count: number }>;
    recentErrors: ErrorLog[];
  } {
    const errorsByType = this.logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorFrequency = this.getErrorFrequency();
    const mostFrequentErrors = Object.entries(errorFrequency)
      .map(([key, count]) => ({
        message: key.split(':')[1],
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentErrors = this.logs
      .slice(-10)
      .sort((a, b) => b.timestamp - a.timestamp);

    return {
      totalErrors: this.logs.length,
      errorsByType,
      mostFrequentErrors,
      recentErrors
    };
  }
}

export default ErrorLogger; 