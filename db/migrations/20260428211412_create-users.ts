import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("users", (table) => {
		table.uuid("id").primary();
		table.uuid("session_id");
		table.text("name").notNullable();
		table.timestamp("created_at").defaultTo;
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("users");
}
