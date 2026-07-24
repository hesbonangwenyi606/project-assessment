import { Plus, Heart } from "lucide-react";

function savvyScore(price, was) {
  return Math.round(((was - price) / was) * 100);
}

export default function ProductCard({ p, onAdd, onWish, wished }) {
  const score = savvyScore(p.price, p.was);
  return (
    <div className="group relative flex flex-col rounded-2xl border border-[color:var(--line)] bg-white p-3 transition-transform hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={() => onWish(p.id)}
          aria-label="Save for later"
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm"
        >
          <Heart size={16} fill={wished ? "var(--coral)" : "none"} color={wished ? "var(--coral)" : "var(--ink)"} />
        </button>
        <div
          className="absolute left-2 top-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[color:var(--ink)] bg-[color:var(--paper)] text-xs font-bold text-[color:var(--ink)]"
          title="Savvy Score — how good this deal is"
        >
          -{score}%
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{p.cat}</p>
        <h3 className="mt-1 font-semibold leading-snug text-[color:var(--ink)]">{p.name}</h3>
        <div className="mt-1 text-xs text-neutral-500">★ {p.rating}</div>

        <div className="mt-2 flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-[color:var(--ink)]">${p.price}</span>
            <span className="ml-2 text-sm text-neutral-400 line-through">${p.was}</span>
          </div>
        </div>

        <button
          onClick={() => onAdd(p.id)}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[color:var(--ink)] py-2 text-sm font-semibold text-[color:var(--paper)]"
        >
          <Plus size={16} /> Add to cart
        </button>
      </div>
    </div>
  );
}
