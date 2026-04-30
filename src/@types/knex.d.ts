// biome-ignore lint: the import is necessary to allow the module augmentation 
import { Knex } from "knex";
import "fastify";

declare module "knex/types/tables" {
	export interface Tables {
		users: {
			id: string;
			session_id: string;
			name: string;
			created_at: string;
		};
		meals: {
			id: string;
			user_id: string;
			name: string;
			description?: string;
			datetime: string;
			is_on_diet: boolean;
			created_at: string;
		};
	}
}

declare module "fastify" {
	export interface FastifyRequest {
		user?: {
			id: string;
		};
	}
}
