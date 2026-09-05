import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function StripeCheckoutForm({ clientSecret, checkoutId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    if (!clientSecret) {
      toast.error("Payment session not created.");
      return;
    }

    setLoading(true);
    setMessage("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setLoading(false);
      toast.error("Card details are required.");
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (error) {
        setMessage(error.message);
        toast.error(error.message);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
          {
            paymentStatus: "Paid",
            paymentDetails: {
              paymentIntentId: paymentIntent.id,
              status: paymentIntent.status,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          },
        );

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          },
        );

        toast.success("Payment successful!");

        navigate("/order-confirmation", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message || error?.message || "Payment failed.";

      setMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Details
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Credit or Debit Card
          </label>

          <div
            className={`p-3 bg-gray-50 border rounded-lg ${
              isFocused
                ? "border-indigo-500 ring-2 ring-indigo-100 bg-white"
                : "border-gray-200"
            }`}
          >
            <CardElement
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    "::placeholder": {
                      color: "#9ca3af",
                    },
                  },
                  invalid: {
                    color: "#ef4444",
                  },
                },
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handlePaymentSubmit}
          disabled={!stripe || loading || !clientSecret}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {message && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
