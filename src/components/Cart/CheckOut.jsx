import { useState } from "react";
// import PaypalButton from "./PaypalButton";
import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
// import CheckoutForm from "./CheckoutForm";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { createCheckout } from "../../redux/slices/checkoutSlice";
import { createCheckout } from "../../redux/slices/checkoutSlice";
// import axios from "axios";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const [checkoutId, setCheckoutId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [clientSecret, setClientSecret] = useState(null);
  // const navigation=useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    email: "admin@example.com",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  //ensure cart is not loaded before proceding
  // useEffect(() => {
  //   if (!cart && !cart.products && cart.products.length === 0) {
  //     navigate("/");
  //   }
  // }, [cart, navigate]);
  useEffect(() => {
    if (!cart?.products?.length) {
      navigate("/");
    }
  }, [cart, navigate]);
  // useEffect(() => {
  //   if (cart && (!cart.products || cart.products.length === 0)) {
  //     navigate("/");
  //   }
  // }, [cart, navigate]);
  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (!cart?.products?.length) return;

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress: {
            ...shippingAddress,
            email: user?.email,
          },
          paymentMethod: "Stripe",
          totalPrice: cart.totalPrice,
        }),
      ).unwrap();

      // setCheckoutId(res._id);
      setCheckoutId(res.checkout._id);
      setClientSecret(res.clientSecret);

      toast.success("Checkout created successfully");
      //  dispatch(clearCart());
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error?.message || "Failed to create checkout");
    }
  };
  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!cart?.products?.length) {
    return <p>Your Cart is Empty</p>;
  }
  // 1. Dynamic Subtotal Calculation (Price * Quantity)
  const subtotal = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // 2. Shipping Calculation (Total Price - Subtotal)
  const shipping = cart.totalPrice - subtotal;

  if (loading) return <p>Loading checkout...</p>;
  if (error) return <p>Error:{error}</p>;
  if (!cart || !cart.products || cart.products.length === 0)
    return <p>Your checkout is Empty</p>;
  // stripe config
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* LEFT COLUMN: Checkout Form */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 uppercase">
            Checkout
          </h2>

          <form onSubmit={handleCreateCheckout} className="space-y-0">
            {/* Contact Details Section */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Contact Details
              </h3>
              <div>
                <label
                  className="block text-sm text-gray-600 mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user ? user?.email : ""}
                  onChange={handleInputChange}
                  disabled
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
            </div>

            {/* Delivery Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 pt-2">
                Delivery
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm text-gray-600 mb-1"
                    htmlFor="firstName"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-gray-600 mb-1"
                    htmlFor="lastName"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm text-gray-600 mb-1"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm text-gray-600 mb-1"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-gray-600 mb-1"
                    htmlFor="postalCode"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm text-gray-600 mb-1"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm text-gray-600 mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
              <div className="">
                {!checkoutId ? (
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-900 transition-colors duration-200 mt-4"
                  >
                    Continue to Payment
                  </button>
                ) : (
                  <>
                    {/* <div className="">
                      <h3 className="text-lg mb-4 ">Pay with Paypal</h3>
                      paypal button component
                      <PaypalButton
                        amount={cart.totalPrice}
                        success={handlePaymentSuccess}
                        onError={(error) =>
                          alert("PayPal payment error:", error)
                        }
                      />
                    </div> */}
                    <div>
                      <h3 className="text-lg mb-4 ">Pay with Stripe</h3>
                      {/* Wrap your form inside Elements */}
                      {/* <CheckoutForm /> */}
                      <Elements stripe={stripePromise}>
                        <StripeCheckoutForm
                          clientSecret={clientSecret}
                          checkoutId={checkoutId}
                        />
                      </Elements>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary (Ab Dynamic Hai) */}
        <div className="lg:col-span-5 bg-[#F9FAFB] p-6 sm:p-8 rounded-sm border border-gray-100 sticky top-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Order Summary
          </h3>

          {/* Loop over Cart Products */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pt-4">
            {cart.products.map((product) => (
              <div
                key={product.productId}
                className="flex items-start gap-4 pb-4 border-b border-gray-200/60 last:border-0 last:pb-0"
              >
                <div className="relative flex shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-20 object-cover bg-gray-100 rounded-sm"
                  />
                  {/* Quantity Badge overlay */}
                  <span className="absolute -top-2 z-50 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {product.quantity}
                  </span>
                </div>

                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-900 leading-tight">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {product.size}
                  </p>
                  <p className="text-xs text-gray-500">
                    Color: {product.color}
                  </p>
                </div>

                <span className="text-sm font-medium text-gray-900">
                  ${(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Calculations */}
          <div className="space-y-4 pt-6 border-t border-gray-200 text-sm mt-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 items-center">
              <span>Shipping</span>
              {shipping > 0 ? (
                <span className="font-medium text-gray-900">
                  ${shipping.toFixed(2)}
                </span>
              ) : (
                <span className="font-medium text-green-600 tracking-wide text-xs bg-green-50 px-1.5 py-0.5 rounded-sm">
                  FREE
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
