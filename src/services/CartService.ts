import { CartModel, ICartItem } from "../databases/models/cart";
import { AppError } from "../utils/AppError";


export class CartService {

    static async getCartByUserId(userId: string) {
        const cart = await CartModel.findOne({ user: userId });
        return cart;
    }

    static async initializeCart(userId: string) {
        return await CartModel.create({
            user: userId,
            cartItems: [],
            totalPrice: 0,
        });
    }

    static findItemInCart(cartItems: ICartItem[], item: ICartItem) {
        const { productId, variantId, size } = item;

        return cartItems.find((i) =>
            i.productId.toString() === productId.toString() &&
            i.variantId.toString() === variantId.toString() &&
            i.size === size
        );
    }

    static filterOutCart(cartItems: ICartItem[], item: ICartItem) {
        const { productId, variantId, size } = item;
        return cartItems.filter((i) =>
            !(i.productId.toString() === productId.toString() &&
                i.variantId.toString() === variantId.toString()
                && i.size === size))
    }

    static findIndexOfItemInCart(cartItems: ICartItem[], item: ICartItem) {
        const { productId, variantId, size } = item;
        const index = cartItems.findIndex(
            (item) =>
                item.productId.toString() === productId.toString() &&
                item.variantId.toString() === variantId.toString() &&
                item.size === size,
        )
        if (index === -1) throw new AppError('Item not found in cart', 404);
        return index;
    }

    static async clearCart(userId: string) {
        const cart = await CartModel.findOneAndDelete({ user: userId });
        if (!cart) throw new AppError('Cart not found', 404);
    }

    static async createCart(userId: string, cartItems: ICartItem[], totalPrice: string) {
        return await CartModel.create({
            user: userId,
            cartItems,
            totalPrice,
        })
     }






}