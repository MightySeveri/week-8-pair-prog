const request = require("supertest");

jest.mock("../models/propertyModel", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Property = require("../models/propertyModel");
const app = require("../app");

const propertyId = "507f1f77bcf86cd799439012";
const propertyPayload = {
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

describe("property CRUD API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/properties creates a property", async () => {
    Property.create.mockResolvedValue({ _id: propertyId, ...propertyPayload });

    const res = await request(app).post("/api/properties").send(propertyPayload);

    expect(res.status).toBe(201);
    expect(res.body._id).toBe(propertyId);
  });

  test("GET /api/properties fetches all properties", async () => {
    Property.find.mockResolvedValue([{ _id: propertyId, ...propertyPayload }]);

    const res = await request(app).get("/api/properties");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  test("GET /api/properties/:propertyId fetches one property", async () => {
    Property.findById.mockResolvedValue({ _id: propertyId, ...propertyPayload });

    const res = await request(app).get(`/api/properties/${propertyId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(propertyId);
  });

  test("PUT /api/properties/:propertyId updates one property", async () => {
    Property.findByIdAndUpdate.mockResolvedValue({
      _id: propertyId,
      ...propertyPayload,
      title: "Updated Apartment",
    });

    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .send({ title: "Updated Apartment" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Apartment");
  });

  test("DELETE /api/properties/:propertyId deletes one property", async () => {
    Property.findByIdAndDelete.mockResolvedValue({ _id: propertyId, ...propertyPayload });

    const res = await request(app).delete(`/api/properties/${propertyId}`);

    expect(res.status).toBe(204);
  });
});
