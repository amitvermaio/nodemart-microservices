import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';

const searchProduct = tool(async ({ query, token }) => {
  const response = await axios.get(`http://localhost:4001/api/products?q=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).data;

  return JSON.stringify(response);
}, {
  name: 'search_product',
  description: 'Use this tool to search for products in the e-commerce store. Input should be a search query string.',
  inputSchema: z.object({
    query: z.string().describe('The search query string to find products.'),
  })
});

const addProductToCart = tool(async ({ productId, quantity = 1, token }) => {
  const response = await axios.post(`http://localhost:4002/api/carts/items`, {
    productId,
    quantity,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).data;

  return `Added product ${productId} (quantity: ${quantity}) to cart.`;
}, {
  name: 'add_product_to_cart',
  description: 'Use this tool to add a product to the user\'s shopping cart. Input should include productId and quantity.',
  inputSchema: z.object({
    productId: z.string().describe('The ID of the product to add to the cart.'),
    quantity: z.number().optional().describe('The quantity of the product to add. Defaults to 1 if not provided.').default(1),
  })
});

export { searchProduct, addProductToCart };