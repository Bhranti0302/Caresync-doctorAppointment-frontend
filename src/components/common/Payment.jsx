import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import API from "../../services/api";
import { updateBookingAsync } from "../../redux/slices/bookingSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ appointmentId, fees, closeModal }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create Payment Intent
      const { clientSecret } = await API.createPaymentIntent(appointmentId);

      if (!clientSecret) {
        toast.error("Failed to get payment secret. Try again.");
        setLoading(false);
        return;
      }

      // 2️⃣ Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        toast.success("Payment Successful!");

        // 3️⃣ Update backend (paid = true)
        await API.payForAppointment(appointmentId, { paid: true });

        // 4️⃣ Update Redux state
        dispatch(
          updateBookingAsync({ id: appointmentId, data: { paid: true } })
        );

        closeModal();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="p-4 border rounded-2xl shadow-inner bg-gray-50">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full text-white font-semibold py-3 rounded-xl ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : `Pay ₹${fees}`}
      </button>
    </form>
  );
}

export default function StripePayment({ appointmentId, fees, closeModal }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        appointmentId={appointmentId}
        fees={fees}
        closeModal={closeModal}
      />
    </Elements>
  );
}
