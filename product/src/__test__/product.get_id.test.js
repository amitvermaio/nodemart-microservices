import { jest } from "@jest/globals";
import request from "supertest";

const mockFindById = jest.fn();

jest.unstable_mockModule("../models/product.model.js", () => ({
  default: { findById: mockFindById },
}));

const app = (await import("../app.js")).default;

describe("GET /api/products/:id", () => {
  afterEach(() => {
    mockFindById.mockReset();
  });

  const sampleProduct = {
    _id: "prod123",
    title: "Test Product",
    description: "A great product",
    price: { amount: 100, currency: "USD" },
    seller: "seller123",
  };

  it("should return a product when a valid ID is provided", async () => {
    mockFindById.mockResolvedValue(sampleProduct);

    const response = await request(app).get("/api/products/prod123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ product: sampleProduct });
    expect(mockFindById).toHaveBeenCalledWith("prod123");
  });

  it("should return 404 when product is not found", async () => {
    mockFindById.mockResolvedValue(null);

    const response = await request(app).get("/api/products/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Product not found" });
    expect(mockFindById).toHaveBeenCalledWith("nonexistent");
  });

  it("should handle internal server errors", async () => {
    mockFindById.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/products/prod123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
