import setupknex from "knex";

export const knex = setupknex({
	client: "better-sqlite3",
	connection: {
		filename: "./tmp/app.db",

	},
    useNullAsDefault:true
});
