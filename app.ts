#!/usr/bin/env ts-node-script
import { App } from '@deepkit/app';
import { createCrudRoutes, FrameworkModule, onServerMainBootstrapDone } from '@deepkit/framework';
import { Author, Book, SQLiteDatabase } from './src/database';
import { ApiConsoleModule } from '@deepkit/api-console-module';
import { eventDispatcher } from '@deepkit/event';
import faker from 'faker';
import { Logger } from '@deepkit/logger';
import { MainController } from './src/main.controller';
import { RpcController } from './src/rpc.controller';
import { Config } from './src/config';

/**
 * This app uses /tmp/app.sqlite as database, so it is reset after each restart (which happens regularly on heroku free apps).
 * We add new authors/books on boostrap using a faker library.
 */
class Boostrap {
    constructor(private database: SQLiteDatabase, private logger: Logger) {
    }

    @eventDispatcher.listen(onServerMainBootstrapDone)
    async onMainBoostrap() {
        await this.database.query(Author).deleteMany();
        await this.database.query(Book).deleteMany();

        const authors: Author[] = [];
        const session = this.database.createSession();

        for (let i = 0; i < 100; i++) {
            let username = '';
            do {
                username = faker.internet.userName();
            } while (authors.find(v => v.username === username));

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

        this.logger.log('Bookstore database filled with data. Open https://127.0.0.1/api to visit the API.');
    }
}

new App({
    config: Config,
    controllers: [MainController, RpcController],
    providers: [SQLiteDatabase],
    listeners: [Boostrap],
    imports: [
        createCrudRoutes([Author], { identifier: 'username', identifierChangeable: true }),
        createCrudRoutes([Book], {}),
        new ApiConsoleModule({
            path: '/api',
            markdown: `
        # Bookstore Example API
        
        This is an example project demonstrating [Deepkit API Console](https://deepkit.io/framework). It's a simple Deepkit Framework application
        with the Deepkit API module and AutoCrud loaded. There are [two entities](https://github.com/marcj/deepkit-bookstore/blob/master/src/database.ts): 
        Author and Book, which you can both manipulate via the JSON REST API directly in this application. Just open a route and click "Open console".
        
        The code is hosted at [github.com/marcj/deepkit-bookstore](https://github.com/marcj/deepkit-bookstore).
        
        Click on a route and press "Open console" to execute a HTTP call right in your browser.
        
        Have fun!
        `
        }),
        new FrameworkModule({
            migrateOnStartup: true,
            debug: true,
        }),
    ]
})
    .loadConfigFromEnv({ prefix: 'APP_' })
    .run();
