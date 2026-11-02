import { Injectable } from '@nestjs/common';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const dataBaseUrl = process.env.DATABASE_URL;
        if (!dataBaseUrl) {
            (new Logger('PrismaService')).warn('Problem occured with DATABASE_URL');
            throw new Error('Problem occured with DATABASE_URL');
        }
        const adapter = new PrismaMariaDb(dataBaseUrl);
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
