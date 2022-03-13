import {
    AutoIncrement,
    entity,
    Maximum,
    MaxLength,
    MinLength,
    Pattern,
    Positive,
    PrimaryKey,
    Reference,
    t,
    Unique
} from '@deepkit/type';
import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
import { Config } from './config';

const EMAIL_REGEX = /^\S+@\S+$/;

@entity.name('author')
export class Author {
    id: number & PrimaryKey & AutoIncrement = 0;
    created: Date = new Date;

    email?: string & MaxLength<100> & Pattern<typeof EMAIL_REGEX>;

    firstName?: string & MaxLength<100>;
    lastName?: string & MaxLength<100>;

    birthDate?: Date;

    constructor(
        public username: string & MaxLength<100> & Unique
    ) {
    }
}

@entity.name('book')
export class Book {
    id: number & PrimaryKey & AutoIncrement = 0;
    created: Date = new Date;

    description: string & MaxLength<4096> = '';

    price: number & Positive & Maximum<1000> = 0;
    isbn: string & MaxLength<64> = '';

    constructor(
        public author: Author & Reference,
        public title: string & MinLength<3> & MaxLength<128>,
    ) {
    }
}


export class SQLiteDatabase extends Database {
    constructor(dbPath: Config['dbPath']) {
        super(new SQLiteDatabaseAdapter(dbPath), [Author, Book]);
    }
}
