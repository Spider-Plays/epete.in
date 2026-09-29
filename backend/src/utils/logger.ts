type LogMeta = unknown;

export const Logger = {
  info(message: string, meta?: LogMeta): void {
    if (meta !== undefined) {
      console.log(`[INFO] ${message}`, meta);
      return;
    }
    console.log(`[INFO] ${message}`);
  },
  error(message: string, meta?: LogMeta): void {
    if (meta !== undefined) {
      console.error(`[ERROR] ${message}`, meta);
      return;
    }
    console.error(`[ERROR] ${message}`);
  },
  warn(message: string, meta?: LogMeta): void {
    if (meta !== undefined) {
      console.warn(`[WARN] ${message}`, meta);
      return;
    }
    console.warn(`[WARN] ${message}`);
  },
};
