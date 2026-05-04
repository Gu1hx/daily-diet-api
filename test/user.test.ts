import request from "supertest";
import {execSync} from 'node:child_process'
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";
import { app } from "../src/app.js";

beforeAll(async () => {
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

beforeEach(async () => {
	execSync('npm run knex -- migrate:rollback')
	execSync('npm run knex -- migrate:latest')
})

it("should be able to create a user", async () => {
	const response = await request(app.server).post("/users").send({
		name: "User test",
	});

	expect(response.statusCode).toEqual(201);
});
