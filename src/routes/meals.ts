import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database.js";
import { checkSessionIdExist } from "../middlewares/check-session-id-exists.js";
import { countBestStreakOnDiet } from "../utils/count-best-streak-on-diet.js";
import { validateUserPermission } from "../utils/validate-user-permission.js";

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
			description: z.string().optional(),
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

	app.get("/:id", async (request, reply) => {
		const getMealParamsSchema = z.object({
			id: z.uuid(),
		});

		const { id } = getMealParamsSchema.parse(request.params);

		const meal = await knex("meals").where({ id: id }).first();

		if (!meal) {
			return reply.code(404).send({ error: "Meal not found" });
		}

		await validateUserPermission(request, reply, id);

		if (reply.sent) return;

		return meal;
	});

	app.get("/status", async (request) => {
		const RegisteredUserMeals = await knex("meals")
			.where({ user_id: request.user.id })
			.count("id", { as: "total" })
			.first();

		const UserMealsOnDiet = await knex("meals")
			.where({ user_id: request.user.id })
			.count("id", { as: "ondiet" })
			.where("is_on_diet", 1)
			.first();

		const UserMealsOffDiet =
			Number(RegisteredUserMeals?.total) - Number(UserMealsOnDiet?.ondiet);

		const OnDiet = await knex("meals")
			.where({ user_id: request.user.id })
			.select("is_on_diet")
			.orderBy("datetime", "asc");

		const bestStreak = countBestStreakOnDiet(OnDiet);

		return {
			stats: {
				total_meals: RegisteredUserMeals?.total,
				meals_on_diet: UserMealsOnDiet?.ondiet,
				meals_off_diet: UserMealsOffDiet,
				best_streak_on_diet: bestStreak,
			},
		};
	});

	app.put("/:id", async (request, reply) => {
		const getMealParamsSchema = z.object({
			id: z.uuid(),
		});

		const createMealsBodySchema = z.object({
			name: z.string().optional(),
			description: z.string().optional(),
			datetime: z.iso.datetime().optional(),
			is_on_diet: z.boolean().optional(),
		});

		const { id } = getMealParamsSchema.parse(request.params);

		const { name, description, datetime, is_on_diet } =
			createMealsBodySchema.parse(request.body);

		await validateUserPermission(request, reply, id);

		if (reply.sent) return;

		await knex("meals").where({ id: id }).update({
			name,
			description,
			datetime,
			is_on_diet,
		});
	});

	app.delete("/:id", async (request, reply) => {
		const getMealParamsSchema = z.object({
			id: z.uuid(),
		});

		const { id } = getMealParamsSchema.parse(request.params);

		await validateUserPermission(request, reply, id);

		if (reply.sent) return;

		await knex("meals").where({ id: id }).delete();

		return reply.code(204).send();
	});
}
