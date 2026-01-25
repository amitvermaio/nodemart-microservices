import path from "path";
import { fileURLToPath } from "url";
import { jest } from "@jest/globals";
import request from "supertest";

const mockUploadProductImage = jest.fn();
const mockProductCreate = jest.fn();

jest.unstable_mockModule("../services/azureBlob.service.js", () => ({
  uploadProductImage: mockUploadProductImage,
}));

jest.unstable_mockModule("../models/product.model.js", () => ({
  default: { create: mockProductCreate },
}));

const app = (await import("../app.js")).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleImagePath = path.join(__dirname, "fixtures", "sample-image.txt");

describe("POST /api/products", () => {
  afterEach(() => {
    mockUploadProductImage.mockReset();
    mockProductCreate.mockReset();
  });

  it("creates a product when payload and image are valid", async () => {
    mockUploadProductImage.mockResolvedValueOnce({
      url: "https://example.com/blob",
      id: "blob-id",
      thumbnail: "https://example.com/blob-thumb",
    });

    const mockProduct = {
      _id: "67a1b15abf3b0c0012a7b5ac",
      title: "Test Product",
      description: "Test description",
      seller: "507f1f77bcf86cd799439011",
      price: { amount: 1200, currency: "USD" },
      category: ["electronics", "gadgets"],
      images: [
        {
          url: "https://example.com/blob",
          thumbnail: "https://example.com/blob-thumb",
          id: "blob-id",
        },
      ],
    };

    mockProductCreate.mockResolvedValueOnce(mockProduct);

    const response = await request(app)
      .post("/api/products")
      .field("title", mockProduct.title)
      .field("description", mockProduct.description)
      .field("seller", mockProduct.seller)
      .field("priceAmount", `${mockProduct.price.amount}`)
      .field("priceCurrency", mockProduct.price.currency)
      .field("category", mockProduct.category.join(","))
      .attach("image", sampleImagePath);

    expect(response.status).toBe(201);
    expect(mockUploadProductImage).toHaveBeenCalledWith(
      expect.objectContaining({
        buffer: expect.any(Buffer),
        mimeType: "text/plain",
        originalName: "sample-image.txt",
      })
    );
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: mockProduct.title,
        images: [mockProduct.images[0]],
        price: mockProduct.price,
        category: mockProduct.category,
        seller: mockProduct.seller,
      })
    );
    expect(response.body).toEqual({ data: mockProduct });
  });

  it("rejects requests without an image", async () => {
    const response = await request(app)
      .post("/api/products")
      .field("title", "Missing image product")
      .field("description", "Product without file")
      .field("seller", "507f1f77bcf86cd799439011")
      .field("priceAmount", "10");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Product image is required" });
    expect(mockUploadProductImage).not.toHaveBeenCalled();
    expect(mockProductCreate).not.toHaveBeenCalled();
  });
});
