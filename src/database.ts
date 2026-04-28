import setupknex, { type Knex } from "knex";

export const config: Knex.Config = {
	client: "better-sqlite3",
	connection: {
		filename: "./db/app.db",
	},
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./db/migrations",
	},
};

export const knex = setupknex(config);
