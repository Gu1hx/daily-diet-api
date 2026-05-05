import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";

beforeAll(async () => {
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

beforeEach(async () => {
	execSync("npm run knex -- migrate:rollback");
	execSync("npm run knex -- migrate:latest");
});

describe("User Routes", () => {
	it("should be able to create a user", async () => {
		const response = await request(app.server).post("/users").send({
			name: "User test",
		});

		expect(response.statusCode).toEqual(201);
	});

	it("should be able to list the user", async () => {
		const createUser = await request(app.server).post("/users").send({
			name: "User test",
		});

		const cookies = createUser.get("Set-Cookie") ?? [];

		const getUserResponse = await request(app.server)
			.get("/users")
			.set("Cookie", cookies)
			.expect(200);

		expect(getUserResponse.body.user).toEqual(
			expect.objectContaining({
				name: "User test",
			}),
		);
	});
});

describe("Meals Routes", () => {
	it("should be able to create a meal", async () => {
		const createUser = await request(app.server).post("/users").send({
			name: "User test",
		});

		const cookies = createUser.get("Set-Cookie") ?? [];

		await request(app.server)
			.post("/meals")
			.set("Cookie", cookies)
			.send({
				name: "Meal Test",
				description: "Description Test",
				datetime: "2026-05-07T10:00:00Z",
				is_on_diet: false,
			})
			.expect(201);
	});
});
