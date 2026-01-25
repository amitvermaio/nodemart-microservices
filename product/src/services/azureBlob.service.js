import 'dotenv/config';
import { BlobServiceClient } from "@azure/storage-blob";
import { extname } from "path";
import crypto from "crypto";

const resolveContainerClient = () => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
  }

  if (!containerName) {
    throw new Error("Missing AZURE_STORAGE_CONTAINER_NAME");
  }

  const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
  return serviceClient.getContainerClient(containerName);
};

export const uploadProductImage = async ({ buffer, mimeType, originalName }) => {
  const containerClient = resolveContainerClient();
  await containerClient.createIfNotExists();

  const extension = extname(originalName || "");
  const blobName = `${crypto.randomUUID()}${extension}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return {
    url: blockBlobClient.url,
    id: blobName,
  };
};
