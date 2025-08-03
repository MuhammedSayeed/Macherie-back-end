import { catchError } from '../../middleware/catchError';
import { userModel } from '../../databases/models/user';
import sendError from '../../utils/SendError';
import { stripe } from '../../config/stripe';




const createCheckoutSession = catchError(async (req, res, next) => {
    const { email, isGuest, userId, address, name, totalPrice, cartItems } = req.body;
    let metadata: Record<string, string> = {};

    if (isGuest) {
        const isEmailLinkedToAnotherUser = await userModel.findOne({ email });
        if (isEmailLinkedToAnotherUser) return sendError(next, 'This email is already associated with a registered account. Please log in instead.', 400);
    } else {
        const user = await userModel.findOne({ _id: userId, email: email });
        if (!user) return sendError(next, 'User not found', 404);
        metadata.userId = userId;
    }

    metadata.cartItems = JSON.stringify(cartItems);
    metadata.address = JSON.stringify(address);
    metadata.name = name;
    metadata.totalPrice = String(totalPrice);
    metadata.isGuest = String(isGuest);
    metadata.email = email;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'egp',
                unit_amount: Math.round(totalPrice * 100),
                product_data: {
                    name: "Macherie's Order"
                }
            },
            quantity: 1,
        }],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        metadata: metadata,
    })

    res.status(200).json({ url: session.url });

})