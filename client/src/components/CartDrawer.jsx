import { X, Plus, Minus, ChevronRight } from "lucide-react";

export default function CartDrawer({ open, onClose, items, subtotal, savedTotal, onChangeQty, onCheckout }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[color:var(--line)] p-4">
          <h2 className="font-semibold text-[color:var(--ink)]">Your cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={20} color="var(--ink)" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="mt-8 text-center text-sm text-neutral-500">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((c) => (
                <div key={c.productId} className="flex gap-3">
                  <img
                    src={c.product.img}
                    alt={c.product.name}
                    loading="lazy"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium text-[color:var(--ink)]">{c.product.name}</p>
                    <p className="text-sm font-semibold text-[color:var(--ink)]">${c.product.price}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => onChangeQty(c.productId, -1)}
                        className="rounded-full border border-[color:var(--line)] p-1"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm">{c.qty}</span>
                      <button
                        onClick={() => onChangeQty(c.productId, 1)}
                        className="rounded-full border border-[color:var(--line)] p-1"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[color:var(--line)] p-4">
            <div className="mb-1 flex justify-between text-sm text-neutral-500">
              <span>You're saving</span>
              <span>${savedTotal}</span>
            </div>
            <div className="mb-3 flex justify-between font-semibold text-[color:var(--ink)]">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <button
              onClick={onCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--ink)] py-3 text-sm font-semibold text-[color:var(--paper)]"
            >
              Checkout <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
