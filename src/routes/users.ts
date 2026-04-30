import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database.js";
import { checkSessionIdExist } from "../middlewares/check-session-id-exists.js";

export async function usersRoutes(app: FastifyInstance) {
	app.post("/", async (request, reply) => {
		const createUserBodySchema = z.object({
			name: z.string(),
		});

		const { name } = createUserBodySchema.parse(request.body);

		let session_id = request.cookies.session_id;

		if (!session_id) {
			session_id = randomUUID();

			reply.cookie("session_id", session_id, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7,
			});
		}

		await knex("users").insert({
			id: randomUUID(),
			session_id,
			name,
		});

		return reply.code(201).send();
	});
	app.get("/", { preHandler: [checkSessionIdExist] }, async (request) => {
		const user = await knex("users")
			.select()
			.where({ session_id: request.cookies.session_id })
			.first();

		return { user };
	});
}
