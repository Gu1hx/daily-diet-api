import request from "supertest";
import { afterAll, beforeAll, expect, it } from "vitest";
import { app } from "../src/app.js";

beforeAll(async () => {
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

it("should be able to create a user", async () => {
	const response = await request(app.server).post("/users").send({
		name: "User test",
	});

	expect(response.statusCode).toEqual(201);
});
