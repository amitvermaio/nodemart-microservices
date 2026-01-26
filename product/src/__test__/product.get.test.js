import { jest } from "@jest/globals";
import request from "supertest";

const mockLimit = jest.fn();
const mockSkip = jest.fn(() => ({ limit: mockLimit }));
const mockFind = jest.fn(() => ({ skip: mockSkip }));

jest.unstable_mockModule("../models/product.model.js", () => ({
  default: { find: mockFind },
}));

const app = (await import("../app.js")).default;

describe("GET /api/products", () => {
  afterEach(() => {
    mockFind.mockClear();
    mockSkip.mockClear();
    mockLimit.mockClear();
  });

  const sampleProducts = [
    {
      _id: "prod1",
      title: "Product 1",
      price: { amount: 100, currency: "USD" },
    },
    {
      _id: "prod2",
      title: "Product 2",
      price: { amount: 200, currency: "USD" },
    },
  ];

  it("should return a list of products with default pagination", async () => {
    mockLimit.mockResolvedValue(sampleProducts);

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(sampleProducts);
    
    // Check default calls
    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(20);
  });

  it("should filter products by text search query", async () => {
    mockLimit.mockResolvedValue([sampleProducts[0]]);

    const response = await request(app).get("/api/products?q=phone");

    expect(response.status).toBe(200);
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        $text: { $search: "phone" },
      })
    );
  });

  it("should filter products by price range", async () => {
    mockLimit.mockResolvedValue(sampleProducts);

    const response = await request(app).get("/api/products?minprice=50&maxprice=150");

    expect(response.status).toBe(200);
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        "price.amount": { $gte: 50, $lte: 150 },
      })
    );
  });

  it("should handle pagination parameters", async () => {
    mockLimit.mockResolvedValue(sampleProducts);

    const response = await request(app).get("/api/products?skip=10&limit=5");

    expect(response.status).toBe(200);
    expect(mockSkip).toHaveBeenCalledWith(10);
    expect(mockLimit).toHaveBeenCalledWith(5);
  });

  it("should handle unexpected errors gracefully", async () => {
    mockLimit.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
