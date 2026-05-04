import cookie from "@fastify/cookie";
import fastify from "fastify";
import { mealsRoutes } from "./routes/meals.js";
import { usersRoutes } from "./routes/users.js";

export const app = fastify();

app.register(cookie);
app.register(usersRoutes, {
	prefix: "users",
});
app.register(mealsRoutes, {
	prefix: "meals",
});
