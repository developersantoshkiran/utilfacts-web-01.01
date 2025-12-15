

import * as schema from "../../../db/schema"
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js"

// Declare global to prevent multiple instances during hot reloading in development
declare global {
    // eslint-disable-next-line no-var
    var db: PostgresJsDatabase<typeof schema> | undefined
}

function createDb() {
    const { Pool } = pg
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL!
    });
    return drizzle<typeof schema>(pool, { logger: process.env.NODE_ENV === 'development' ? false : false, schema });
}

let db: PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
    db = createDb();
} else {
    if (!global.db) {
        global.db = createDb();
    }
    db = global.db
}
export { db }


