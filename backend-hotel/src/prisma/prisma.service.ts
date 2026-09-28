import { Injectable } from '@nestjs/common';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    /* Construct and connect this "service" to the database */
    constructor(){
        /* assign database url from .env */
        const dataBaseUrl = process.env.DATABASE_URL;
        
        if(!dataBaseUrl){
            /* construct logger (I don't know why this works instead of assign to a local variable) */
            (new Logger('PrismaService')).warn('Problem occured with DATABASE_URL');
            throw new Error('Problem occured with DATABASE_URL');
        }

        /* maria adapter thingy */
        const adapter = new PrismaMariaDb(dataBaseUrl);
        super({adapter});
    }

    /* The module init and destruct thingy*/
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
