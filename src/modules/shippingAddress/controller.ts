import { ShippingAddressModel } from "../../databases/models/shippingAddress";
import { AuthenticatedRequest } from "../../interfaces/auth";
import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";



const getShippingAddress = catchError(
    async (req: AuthenticatedRequest, res, next) => {

        const user = req.user?._id;

        const doc = await ShippingAddressModel.findOne({
            user
        })

        res.status(200).json({
            message: "success",
            results: {
                addresses: doc?.addresses
            }
        })

    }
)

const addShippingAddress = catchError(
    async (req: AuthenticatedRequest, res, next) => {
        const { country, address, city, governorate } = req.body;
        const user = req.user?._id;

        // check if address exist before 
        let addressDoc = await ShippingAddressModel.findOne({ user });

        const isAddressDuplicate = addressDoc && addressDoc.addresses.find((a) =>
            a.address === address &&
            a.country === country &&
            a.city === city &&
            a.governorate === governorate
        )
        if (isAddressDuplicate) return sendError(next, "Address Exists before", 404);

        if (addressDoc?.addresses.length === 2) return sendError(next, "You can only add up to 2 shipping addresses", 404);

        if (!addressDoc) {
            addressDoc = await ShippingAddressModel.create({
                user
            })
        }


        addressDoc.addresses.push({
            address,
            city,
            country,
            governorate
        })

        await addressDoc.save();

        res.status(200).json({
            message: "success",
            results: {
                addresses: addressDoc
            }
        })

    }
)

export {
    addShippingAddress,
    getShippingAddress
}