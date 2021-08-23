import { entity, t } from '@deepkit/type';
import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
import { config } from './config';
import { injectable } from '@deepkit/injector';

const EMAIL_REGEX = /^\S+@\S+$/;

@entity.name('author')
export class Author {
    @t.primary.autoIncrement id: number = 0;
    @t created: Date = new Date;

    @t.maximum(100).pattern(EMAIL_REGEX) email?: string;

    @t.maximum(100) firstName?: string;
    @t.maximum(100) lastName?: string;

    @t birthDate?: Date;

    constructor(
        @t.minLength(3).maximum(24).index({ unique: true }) public username: string
    ) {
    }
}

@entity.name('book')
export class Book {
    @t.primary.autoIncrement id: number = 0;
    @t created: Date = new Date;

    @t.maximum(1024 * 4) description: string = '';

    @t price: number = 0;
    @t.maximum(64) isbn: string = '';

    constructor(
        @t.reference() public author: Author,
        @t.maximum(128).minLength(3) public title: string,
    ) {
    }
}

class DbConfig extends config.slice(['dbPath']) {
}

@injectable()
export class SQLiteDatabase extends Database {
    constructor(private config: DbConfig) {
        super(new SQLiteDatabaseAdapter(config.dbPath), [Author, Book]);
    }
}
