import 'dotenv/config';
import { BlobServiceClient } from "@azure/storage-blob";
import { extname } from "path";
import crypto from "crypto";

const resolveContainerClient = () => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!connectionString || !containerName) {
    throw new Error("Azure storage config missing");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  return blobServiceClient.getContainerClient(containerName);
};

export const uploadProductImage = async ({ buffer, mimeType, originalName }) => {
  const containerClient = resolveContainerClient();

  await containerClient.createIfNotExists({
    access: "blob", // public read access
  });

  
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
