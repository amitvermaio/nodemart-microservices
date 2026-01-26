import Cart from '../models/cart.model.js';

export const addItemToCart = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: user.id });

    if (!cart) {
      cart = new Cart({ user: user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    return res.status(200).json({
      message: 'Item added to cart successfully',
      cart,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

