import { AuthenticatedRequest } from "../../interfaces/auth";
import { catchError } from "../../middleware/catchError";
import { CartService } from "../../services/CartService";



const getCart = catchError(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user?._id;
    const cart = await CartService.getCartByUserId(user as string);
    res.status(200).json({
        success: true,
        results: cart
    })
})

const addToCart = catchError(async (req: AuthenticatedRequest, res, next) => {
    const { item } = req.body;
    const user = req.user?._id;

    // get cart
    let cart = await CartService.getCartByUserId(user as string);

    // create cart if not exist
    if (!cart) cart = await CartService.initializeCart(user as string);

    // check if item is already in cart
    const getItemInCart = CartService.findItemInCart(cart.cartItems, item);

    // if item is already in cart, update quantity
    if (getItemInCart) {
        getItemInCart.quantity += item.quantity;
        cart.totalPrice += item.price * item.quantity;
    } else {
        cart.cartItems.push(item);
        cart.totalPrice += item.price * item.quantity;
    }

    await cart.save();

    res.status(200).json({
        success: true,
        results: cart
    })
})

const removeFromCart = catchError(async (req: AuthenticatedRequest, res, next) => {
    const removedItem = req.body
    const user = req.user?._id

    const cart = await CartService.getCartByUserId(user as string);
    if (!cart) return res.status(404).json({ success: false });


    // Find the item to be removed to calculate its price
    const itemToRemove = CartService.findItemInCart(cart.cartItems, removedItem);

    if (!itemToRemove) return res.status(404).json({ success: false })

    // Filter out the item
    const updatedItems = CartService.filterOutCart(cart.cartItems, removedItem);

    // update cart
    cart.cartItems = updatedItems
    cart.totalPrice = cart.cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    await cart.save()

    res.status(200).json({
        success: true,
        results: cart,
    })
}
)

const updateQTYofItem = catchError(async (req: AuthenticatedRequest, res, next) => {
    const updatedItem = req.body
    const user = req.user?._id

    const cart = await CartService.getCartByUserId(user as string)
    if (!cart) return res.status(404).json({ success: false })

    // Find the specific item in the cart
    const itemIndex = CartService.findIndexOfItemInCart(cart.cartItems, updatedItem);

    // update cart
    cart.cartItems[itemIndex].quantity = updatedItem.quantity
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    await cart.save()

    res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        results: cart,
    })

})

const clearCart = catchError(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user?._id

    const cart = await CartService.clearCart(user as string);

    res.status(200).json({
        success: true,

    })
})

const syncCart = catchError(async (req: AuthenticatedRequest, res, next) => {
    const { cartItems, totalPrice } = req.body;
    const user = req.user?._id;
    let cart = await CartService.getCartByUserId(user as string);

    if (cart) {
        // check if cart is not empty
        if (cart.cartItems.length > 0) return res.status(200).json({ success: true });

        // update cart
        cart.cartItems = cartItems;
        cart.totalPrice = totalPrice;
        await cart.save();

        res.status(200).json({
            success: true
        })
    }


    await CartService.createCart(user as string, cartItems, totalPrice);

    res.status(200).json({
        success: true
    })

})


export {
    getCart,
    addToCart,
    removeFromCart,
    updateQTYofItem,
    clearCart,
    syncCart
}