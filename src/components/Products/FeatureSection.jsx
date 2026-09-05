import { HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";

export default function FeatureSection() {
    return (
        <section className="px-4 py-16 bg-white ">
            <div className="container mx-auto grid gric-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* feature 1  */}
                <div className="flex flex-col items-center w-full">
                    <div className="p-4 rounded-full mb-4 ">
                        <HiShoppingBag className="text-4xl " />
                    </div>
                    <h4 className="tracking-tighter mb-2 ">FREE INTERNATIONAL SHIPPING </h4>
                    <p className="text-gray-600 text-sm tracking-tighter ">
                        On all orders over $100.00
                    </p>
                </div>
                {/* feature 2  */}
                <div className="flex flex-col items-center w-full">
                    <div className="p-4 rounded-full mb-4">
                        <HiArrowPathRoundedSquare className="text-4xl " />
                    </div>
                    <h4 className="tracking-tighter mb-2 ">45 DAYS RETURNS</h4>
                    <p className="text-gray-600 text-sm tracking-tighter ">
                        Money back guarantee if you are not satisfied with your purchase
                    </p>
                </div>
                {/* feature   3*/}
                <div className="flex flex-col items-center w-full">
                    <div className="p-4 rounded-full mb-4">
                        <HiOutlineCreditCard className="text-4xl " />
                    </div>
                    <h4 className="tracking-tighter mb-2 ">SECURE CHECKOUT</h4>
                    <p className="text-gray-600 text-sm tracking-tighter ">
                        100% secure payment process
                    </p>
                </div>

            </div>

        </section>
    )
}
