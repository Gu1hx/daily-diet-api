import setupknex, { type Knex } from "knex";
import { env } from "./env/index.js";

export const config: Knex.Config = {
	client: "better-sqlite3",
	connection: {
		filename: env.DATABASE_URL,
	},
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./db/migrations",
	},
};

export const knex = setupknex(config);
