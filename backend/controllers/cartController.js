import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc    Fetch all cart items for a user
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId, qty } = req.body;
    const user = req.user._id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        let cart = await Cart.findOne({ user });
        if (cart) {
            const itemIndex = cart.cartItems.findIndex(
                (p) => p.product.toString() === productId
            );
            if (itemIndex > -1) {
                let item = cart.cartItems[itemIndex];
                item.qty = qty;
                cart.cartItems[itemIndex] = item;
            } else {
                const newItem = {
                    name: product.name,
                    qty,
                    Image: product.image,
                    price: product.price,
                    product: productId,
                };
                cart.cartItems.push(newItem);
            }
            await cart.save();
            res.status(200).json(cart);
        } else {
            const newCart = await Cart.create({
                user,
                cartItems: [
                    {
                        name: product.name,
                        qty,
                        image: product.image,
                        price: product.price,
                        product: productId,
                    },
                ],
            });
            res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ cartItems: [] });
    }
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== req.params.productId
      );
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { addToCart, getCart, removeFromCart }; 