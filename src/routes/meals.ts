import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database.js";
import { checkSessionIdExist } from "../middlewares/check-session-id-exists.js";

export async function mealsRoutes(app: FastifyInstance) {
	app.addHook("preHandler", checkSessionIdExist);

	app.addHook("preHandler", async (request) => {
		const user = await knex("users")
			.where({ session_id: request.cookies.session_id })
			.select("id")
			.first();

		request.user = user;
	});

	app.post("/", async (request, reply) => {
		const createMealsBodySchema = z.object({
			name: z.string(),
			description: z.string(),
			datetime: z.iso.datetime(),
			is_on_diet: z.boolean(),
		});

		const { name, description, datetime, is_on_diet } =
			createMealsBodySchema.parse(request.body);

		await knex("meals").insert({
			id: randomUUID(),
			user_id: request.user.id,
			name,
			description,
			datetime,
			is_on_diet,
		});

		return reply.code(201).send();
	});

	app.get("/", async (request) => {
		const meals = await knex("meals")
			.where({ user_id: request.user.id })
			.select("*");

		return meals;
	});

	app.get("/:id", async (request) => {
		const getMealParamsSchema = z.object({
			id: z.uuid(),
		});

		const { id } = getMealParamsSchema.parse(request.params);

		const meal = await knex("meals").where({ id: id }).first();

		return meal;
	});
}
