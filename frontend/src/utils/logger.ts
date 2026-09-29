// Simple logger utility
// In a production app, you might use winston, pino, or another logging library

export class Logger {
  private static readonly levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };

  private static level: string = process.env.LOG_LEVEL || "info";

  static error(message: string, meta?: any) {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || "");
    }
  }

  static warn(message: string, meta?: any) {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || "");
    }
  }

  static info(message: string, meta?: any) {
    if (this.shouldLog("info")) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, meta || "");
    }
  }

  static http(message: string, meta?: any) {
    if (this.shouldLog("http")) {
      console.log(`[HTTP] ${new Date().toISOString()} - ${message}`, meta || "");
    }
  }

  static debug(message: string, meta?: any) {
    if (this.shouldLog("debug")) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || "");
    }
  }

  private static shouldLog(level: string): boolean {
    return this.levels[level] <= this.levels[this.level];
  }

  static setLevel(level: string): void {
    if (this.levels[level] !== undefined) {
      this.level = level;
    }
  }
}

export default Logger;
