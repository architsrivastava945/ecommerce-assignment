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

export { addToCart };
