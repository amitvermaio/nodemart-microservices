import Cart from '../models/cart.model.js';
import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

const computeTotals = (items, enrichedItems) => {
  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + (item.product?.price?.amount || 0) * item.quantity,
    0
  );
  return {
    itemCount: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
  };
};

const populateCartItems = async (items) => {
  if (!items || items.length === 0) return [];

  const results = await Promise.all(
    items.map(async (item) => {
      try {
        const { data } = await axios.get(`${PRODUCT_SERVICE_URL}/${item.productId}`);
        return {
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          product: data?.product ?? data ?? null,
        };
      } catch {
        return {
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          product: null,
        };
      }
    })
  );

  return results;
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const items = await populateCartItems(cart.items);
    const totals = computeTotals(cart.items, items);

    return res.status(200).json({
      cart: {
        _id: cart._id,
        user: cart.user,
        items,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
      totals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity + quantity > 5) {
        cart.items[itemIndex].quantity = 5;
      } else {
        cart.items[itemIndex].quantity += quantity;
      }
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const items = await populateCartItems(cart.items);
    const totals = computeTotals(cart.items, items);

    return res.status(200).json({
      message: 'Item added to cart successfully',
      cart: { _id: cart._id, user: cart.user, items, createdAt: cart.createdAt, updatedAt: cart.updatedAt },
      totals,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    const items = await populateCartItems(cart.items);
    const totals = computeTotals(cart.items, items);

    return res.status(200).json({
      message: 'Cart item updated successfully',
      cart: { _id: cart._id, user: cart.user, items, createdAt: cart.createdAt, updatedAt: cart.updatedAt },
      totals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const deleteCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const items = await populateCartItems(cart.items);
    const totals = computeTotals(cart.items, items);

    return res.status(200).json({
      message: 'Cart item removed successfully',
      cart: { _id: cart._id, user: cart.user, items, createdAt: cart.createdAt, updatedAt: cart.updatedAt },
      totals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const deleteCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        message: 'Cart already empty',
        cart: { user: userId, items: [] },
        totals: { itemCount: 0, totalQuantity: 0, subtotal: 0 },
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: 'Cart cleared successfully',
      cart: { _id: cart._id, user: cart.user, items: [], createdAt: cart.createdAt, updatedAt: cart.updatedAt },
      totals: { itemCount: 0, totalQuantity: 0, subtotal: 0 },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}