import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';
import { IPrismaService } from './prisma.service.interface';

@injectable()
export class PrismaService implements IPrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private loggerService: LoggerService) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.loggerService.log('Successfully connect to the DB');
        } catch (error) {
            if (error instanceof Error) {
                this.loggerService.log('Cant connect to the DB');
            }
        }
    }
    async disconnect(): Promise<void> {
        await this.client.$disconnect();
        this.loggerService.log('Disconnect from the DB');
    }
}
