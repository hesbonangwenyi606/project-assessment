import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

const emptyDetails = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutModal({ items, subtotal, onClose, onOrderPlaced, onNeedsAuth }) {
  const { user, token } = useAuth();
  const [customerDetails, setCustomerDetails] = useState(emptyDetails);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomerDetails((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
    }));
  }, [user?.name, user?.email]);

  function handleChange(e) {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      onNeedsAuth();
      return;
    }

    const missing = Object.entries(customerDetails).find(([, value]) => !String(value).trim());
    if (missing) {
      setError("Please fill in all required customer details.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await api.createOrder(token, {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        address: customerDetails.address,
        customerDetails: {
          ...customerDetails,
          name: customerDetails.name.trim(),
          email: customerDetails.email.trim(),
          city: customerDetails.city.trim(),
          postalCode: customerDetails.postalCode.trim(),
          country: customerDetails.country.trim(),
        },
      });
      onOrderPlaced(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-[color:var(--ink)]">Checkout</h2>
          <button type="button" onClick={onClose}>
            <X size={20} color="var(--ink)" />
          </button>
        </div>

        {!user && (
          <div className="mb-4 rounded-lg bg-neutral-100 p-3 text-sm text-[color:var(--ink)]">
            You'll need to sign in to place an order.{" "}
            <button
              type="button"
              onClick={onNeedsAuth}
              className="font-semibold underline"
            >
              Sign in or create an account
            </button>
          </div>
        )}

        <div className="grid gap-3">
          <input
            required
            name="name"
            placeholder="Full name"
            value={customerDetails.name}
            onChange={handleChange}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={customerDetails.email}
            onChange={handleChange}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
          <input
            required
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={customerDetails.phone}
            onChange={handleChange}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
          <input
            required
            name="address"
            placeholder="Street address"
            value={customerDetails.address}
            onChange={handleChange}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              name="city"
              placeholder="City"
              value={customerDetails.city}
              onChange={handleChange}
              className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
            />
            <input
              required
              name="postalCode"
              placeholder="Postal code"
              value={customerDetails.postalCode}
              onChange={handleChange}
              className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
            />
          </div>
          <input
            required
            name="country"
            placeholder="Country"
            value={customerDetails.country}
            onChange={handleChange}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
        </div>

        {error && <p className="mt-3 text-sm text-[color:var(--coral)]">{error}</p>}

        <div className="mt-4 flex justify-between text-sm font-semibold text-[color:var(--ink)]">
          <span>Total</span>
          <span>${subtotal}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-[color:var(--ink)] py-3 text-sm font-semibold text-[color:var(--paper)] disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
        <p className="mt-2 text-center text-xs text-neutral-400">
          Order total is calculated and verified by the server. No real payment is collected yet.
        </p>
      </form>
    </div>
  );
}
