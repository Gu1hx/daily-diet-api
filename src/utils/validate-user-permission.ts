import type { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database.js";

export async function validateUserPermission(
	request: FastifyRequest,
	reply: FastifyReply,
	id: string,
) {
	const permission = await knex("meals").where({
		id: id,
		user_id: request.user.id,
	});

	if (permission.length === 0) {
		return reply.status(403).send({ error: "Unauthorized" });
	}
}
