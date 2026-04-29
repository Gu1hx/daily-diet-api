import fastify from "fastify";
import { knex } from "./database.js";

const app = fastify();

app.get("/hello", async () => {
	const users = await knex("users").select("*");

	return users;
});

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("HTTP Server Running!");
	});
