const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.SECRET = "test-secret";

jest.mock("../models/propertyModel", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

jest.mock("../models/userModel", () => ({
  findOne: jest.fn(),
}));

const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const app = require("../app");

const validPropertyPayload = {
  title: "Cozy Apartment",
  description: "Beautiful apartment in the heart of the city",
  price: 1500,
  location: "Downtown",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  squarefeet: 1000,
  bedrooms: 2,
};

describe("property routes", () => {
  const authUserId = "507f1f77bcf86cd799439011";
  const propertyId = "507f1f77bcf86cd799439012";
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ _id: authUserId }, process.env.SECRET, { expiresIn: "1h" });

    User.findOne.mockImplementation(({ _id }) => ({
      select: jest.fn().mockResolvedValue({ _id }),
    }));
  });

  test("all property routes return 401 without token", async () => {
    const createRes = await request(app).post("/api/properties").send(validPropertyPayload);
    expect(createRes.status).toBe(401);

    const listRes = await request(app).get("/api/properties");
    expect(listRes.status).toBe(401);

    const getByIdRes = await request(app).get(`/api/properties/${propertyId}`);
    expect(getByIdRes.status).toBe(401);

    const updateRes = await request(app).put(`/api/properties/${propertyId}`).send({ title: "Updated" });
    expect(updateRes.status).toBe(401);

    const deleteRes = await request(app).delete(`/api/properties/${propertyId}`);
    expect(deleteRes.status).toBe(401);
  });

  test("POST /api/properties creates a property", async () => {
    Property.create.mockImplementation(async (payload) => ({
      _id: propertyId,
      ...payload,
    }));

    const res = await request(app)
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .send(validPropertyPayload);

    expect(res.status).toBe(201);
    expect(res.body._id).toBe(propertyId);
    expect(res.body.user_id).toBe(authUserId);
  });

  test("GET /api/properties returns all properties", async () => {
    Property.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: propertyId, ...validPropertyPayload, user_id: authUserId }]),
    });

    const res = await request(app)
      .get("/api/properties")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  test("GET /api/properties/:propertyId returns a property", async () => {
    Property.findById.mockResolvedValue({ _id: propertyId, ...validPropertyPayload, user_id: authUserId });

    const res = await request(app)
      .get(`/api/properties/${propertyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(propertyId);
  });

  test("PUT /api/properties/:propertyId updates a property", async () => {
    Property.findOneAndUpdate.mockResolvedValue({
      _id: propertyId,
      ...validPropertyPayload,
      title: "Updated Apartment",
      user_id: authUserId,
    });

    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Apartment" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Apartment");
  });

  test("DELETE /api/properties/:propertyId deletes a property", async () => {
    Property.findOneAndDelete.mockResolvedValue({ _id: propertyId, user_id: authUserId });

    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
