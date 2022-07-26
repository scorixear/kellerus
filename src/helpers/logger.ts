export enum WARNINGLEVEL {
  INFO = 'INFO',
  WARN = 'WARNING',
  ERROR = 'ERROR',
  CRIT = 'CRITICAL'
}


export class Logger {
public static Log(message: string, warningLevel: WARNINGLEVEL, ...args: any[]) {
  console.log(`[${warningLevel}] ${message}`, ...args);
  if(warningLevel === WARNINGLEVEL.CRIT) {
    process.exit(1);
  }
}

public static Error(message: string, error: unknown, warningLevel: WARNINGLEVEL, ...args: any[]) {
  if(error instanceof Error) {
    console.error(error.message);
    if(error.stack) {
      console.error(error.stack);
    }
  } else if (error instanceof String) {
    console.error(error);
  }

  this.Log(message, warningLevel, ...args);
}
}