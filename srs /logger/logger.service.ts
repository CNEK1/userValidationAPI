import { Logger } from 'tslog';

export class LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: 'hidden',
            displayFunctionName: false
        });
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }
    warn(...args: unknown[]) {
        this.logger.warn(...args);
    }
    error(...args: unknown[]) {
        this.logger.error(...args);
    }
}
