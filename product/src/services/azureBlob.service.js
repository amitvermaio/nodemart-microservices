import 'dotenv/config';
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";
import { extname } from "path";
import crypto from "crypto";

const resolveContainerClient = () => {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!accountName || !sasToken || !containerName) {
    throw new Error("Missing Azure Storage credentials (Account Name, SAS Token, or Container Name)");
  }

  // Construct the URL: https://<accountname>.blob.core.windows.net?<sasToken>
  // Ensure the SAS token starts with '?' if it doesn't already
  const token = sasToken.startsWith('?') ? sasToken : `?${sasToken}`;
  const blobServiceUri = `https://${accountName}.blob.core.windows.net${token}`;

  const serviceClient = new BlobServiceClient(blobServiceUri, new AnonymousCredential());
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
    url: blockBlobClient.url.split('?')[0], // Returning the URL without the SAS token attached
    id: blobName,
  };
};