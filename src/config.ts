import { createModuleConfig } from '@deepkit/app';
import { t } from '@deepkit/type';

export const config = createModuleConfig({
    dbPath: t.string.default('/tmp/app.sqlite').description('The path to the SQLite file.'),
});
