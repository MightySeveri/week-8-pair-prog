const request = require("supertest");
const bcrypt = require("bcryptjs");

process.env.SECRET = "test-secret";

jest.mock("../models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const User = require("../models/userModel");
const app = require("../app");

describe("user API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/users/signup returns 201 with { email, token }", async () => {
    const payload = {
      fullName: "John Doe",
      email: "john@example.com",
      password: "secret123",
      phoneNumber: "555-123-4567",
      gender: "Male",
      date_of_birth: "1990-01-15",
      accountType: "Active",
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockImplementation(async (data) => ({
      _id: "507f1f77bcf86cd799439011",
      ...data,
    }));

    const res = await request(app).post("/api/users/signup").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      email: "john@example.com",
      token: expect.any(String),
    });

    const createPayload = User.create.mock.calls[0][0];
    expect(createPayload.password).not.toBe("secret123");
    await expect(bcrypt.compare("secret123", createPayload.password)).resolves.toBe(true);
  });

  test("POST /api/users/login returns 200 with { email, token }", async () => {
    const hashed = await bcrypt.hash("secret123", 10);

    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      email: "john@example.com",
      password: hashed,
    });

    const res = await request(app).post("/api/users/login").send({
      email: "john@example.com",
      password: "secret123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      email: "john@example.com",
      token: expect.any(String),
    });
  });

  test("POST /api/users/login returns 400 for invalid credentials", async () => {
    const hashed = await bcrypt.hash("secret123", 10);

    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      email: "john@example.com",
      password: hashed,
    });

    const res = await request(app).post("/api/users/login").send({
      email: "john@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });
});
