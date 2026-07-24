import { useEffect, useMemo, useState } from "react";
import { Tag, Check, ChevronRight } from "lucide-react";
import { api } from "./api.js";
import { useCart } from "./context/CartContext.jsx";
import Header from "./components/Header.jsx";
import ProductCard from "./components/ProductCard.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CheckoutModal from "./components/CheckoutModal.jsx";
import Footer from "./components/Footer.jsx";

const CATEGORIES = ["All", "Electronics", "Home", "Fashion", "Beauty", "Outdoors"];

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'signin' | 'signup' | null
  const [orderPlaced, setOrderPlaced] = useState(null);

  const { cart, addToCart, changeQty, clearCart } = useCart();

  useEffect(() => {
    api
      .getProducts()
      .then((data) => setProducts(data.products))
      .catch(() => setLoadError("Couldn't reach the store's server. Is the API running?"));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = category === "All" || p.cat === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [products, query, category]);

  const cartItems = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) }))
    .filter((c) => c.product);

  const subtotal = cartItems.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const savedTotal = cartItems.reduce((sum, c) => sum + (c.product.was - c.product.price) * c.qty, 0);
  const itemCount = cartItems.reduce((sum, c) => sum + c.qty, 0);

  function toggleWish(id) {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }

  function handleOrderPlaced(order) {
    setOrderPlaced(order);
    setCheckoutOpen(false);
    clearCart();
  }

  return (
    <div className="min-h-screen w-full">
      <Header
        query={query}
        setQuery={setQuery}
        itemCount={itemCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthMode("signin")}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="rounded-3xl bg-[color:var(--ink)] px-6 py-10 md:px-12 md:py-14">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--lime)] px-3 py-1 text-xs font-semibold text-[color:var(--ink)]">
            <Tag size={14} /> Today's Savvy Picks — up to 55% off
          </p>
          <h1 className="display-font max-w-xl text-3xl leading-tight text-white md:text-4xl">
            Shop smart. Save smarter.
          </h1>
          <p className="mt-3 max-w-md text-sm text-neutral-300">
            Every item is marked with a Savvy Score — our shorthand for how good the deal actually is.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                category === c
                  ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--paper)]"
                  : "border-[color:var(--line)] bg-white text-[color:var(--ink)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {loadError ? (
          <div className="rounded-2xl border border-[color:var(--line)] p-10 text-center">
            <p className="font-semibold text-[color:var(--ink)]">{loadError}</p>
            <p className="mt-1 text-sm text-neutral-500">
              Start the API with <code>npm run dev --prefix server</code> and refresh.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--line)] p-10 text-center">
            <p className="font-semibold text-[color:var(--ink)]">No matches yet.</p>
            <p className="mt-1 text-sm text-neutral-500">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onAdd={addToCart} onWish={toggleWish} wished={wishlist.includes(p.id)} />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        savedTotal={savedTotal}
        onChangeQty={changeQty}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {checkoutOpen && (
        <CheckoutModal
          items={cartItems}
          subtotal={subtotal}
          onClose={() => setCheckoutOpen(false)}
          onOrderPlaced={handleOrderPlaced}
          onNeedsAuth={() => setAuthMode("signin")}
        />
      )}

      {authMode && (
        <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setAuthMode(null)} />
      )}

      {orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOrderPlaced(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--lime)]">
              <Check size={24} color="var(--ink)" />
            </div>
            <h2 className="font-semibold text-[color:var(--ink)]">Order placed</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Order #{orderPlaced.id} · ${orderPlaced.total} · saved to your account
            </p>
            <button
              onClick={() => setOrderPlaced(null)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--ink)] py-3 text-sm font-semibold text-[color:var(--paper)]"
            >
              Continue shopping <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
