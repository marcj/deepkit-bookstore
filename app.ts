#!/usr/bin/env ts-node-script
import 'reflect-metadata';
import { Application, createCrudRoutes, KernelModule } from '@deepkit/framework';
import { SQLiteDatabase, Author, Book } from './src/database';
import { ApiConsoleModule } from '@deepkit/api-console-module';
import { config } from './src/config';

Application.create({
    config,
    providers: [SQLiteDatabase],
    imports: [
        createCrudRoutes([Author], { identifier: 'username', identifierChangeable: true }),
        createCrudRoutes([Book], {}),
        ApiConsoleModule.configure({ basePath: '/api' }),
        KernelModule.configure({
            migrateOnStartup: true
        }),
    ]
})
    .loadConfigFromEnv({ prefix: 'APP_' })
    .run();
