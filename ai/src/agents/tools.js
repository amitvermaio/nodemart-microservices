import 'dotenv/config';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';

const searchProduct = tool(async ({ query, token }) => {
  const { data } = await axios.get(`${process.env.PRODUCTS_SERVER_BASE_URL}?q=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return JSON.stringify(data);
}, {
  name: 'searchProduct',
  description: 'Use this tool to search for products in the e-commerce store. Input should be a search query string.',
  schema: z.object({
    query: z.string().describe('The search query string to find products.'),
  })
});

const addProductToCart = tool(async ({ productId, quantity = 1, token }) => {
  const { data } = await axios.post(`${process.env.CARTS_SERVER_BASE_URL}/items`, {
    productId,
    quantity,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return `Added product ${productId} (quantity: ${quantity}) to cart.`;
}, {
  name: 'addProductToCart',
  description: 'Use this tool to add a product to the user\'s shopping cart. Input should include productId and quantity.',
  schema: z.object({
    productId: z.string().describe('The ID of the product to add to the cart.'),
    quantity: z.number().optional().describe('The quantity of the product to add. Defaults to 1 if not provided.').default(1),
  })
});

export default { searchProduct, addProductToCart };