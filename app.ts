#!/usr/bin/env ts-node-script
import 'reflect-metadata';
import { Application, createCrudRoutes, KernelModule, onServerMainBootstrapDone } from '@deepkit/framework';
import { Author, Book, SQLiteDatabase } from './src/database';
import { ApiConsoleModule } from '@deepkit/api-console-module';
import { config } from './src/config';
import { injectable } from '@deepkit/injector';
import { eventDispatcher } from '@deepkit/event';
import faker from 'faker';

/**
 * This app uses /tmp/app.sqlite as database, so its is reset after each restart (which happens regular on heroku free apps).
 * We add new authors/books on boostrap
 */
@injectable()
class Boostrap {
    constructor(private database: SQLiteDatabase) {
    }
    @eventDispatcher.listen(onServerMainBootstrapDone)
    async onMainBoostrap() {
        await this.database.query(Author).deleteMany();
        await this.database.query(Book).deleteMany();

        const authors: Author[] = [];
        const session = this.database.createSession();

        for (let i = 0; i < 100; i++) {
            let username = ''
            do {
                username = faker.internet.userName();
            } while(authors.find(v => v.username === username));

            const author = new Author(username);
            author.firstName = faker.name.firstName();
            author.lastName = faker.name.lastName();
            author.birthDate = faker.date.past();
            author.created = faker.date.past();

            authors.push(author);
            session.add(author);
        }

        for (let i = 0; i < 100; i++) {
            const book = new Book(authors[authors.length * Math.random() | 0], faker.commerce.productName());
            book.description = faker.commerce.productDescription();
            book.created = faker.date.past();
            book.price = Number(faker.commerce.price());
            session.add(book);
        }

        await session.commit();
    }
}

Application.create({
    config,
    providers: [SQLiteDatabase],
    listeners: [Boostrap],
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
