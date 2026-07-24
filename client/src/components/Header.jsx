import { ShoppingCart, Search, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ query, setQuery, itemCount, onOpenCart, onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--ink)]">
            <Sparkles size={18} color="var(--lime)" />
          </div>
          <span className="display-font text-lg text-[color:var(--ink)]">ShopSavvy</span>
        </div>

        <div className="ml-2 hidden flex-1 items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-3 py-2 md:flex">
          <Search size={16} color="#8A8578" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for deals..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {user ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm font-medium text-[color:var(--ink)] sm:inline">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button
              onClick={logout}
              aria-label="Log out"
              className="flex items-center gap-1 rounded-full border border-[color:var(--line)] px-3 py-2 text-sm font-semibold text-[color:var(--ink)]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="ml-auto flex items-center gap-1 rounded-full border border-[color:var(--line)] px-3 py-2 text-sm font-semibold text-[color:var(--ink)]"
          >
            <User size={16} />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        )}

        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
        >
          <ShoppingCart size={16} />
          Cart
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--coral)] text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 pb-3 md:hidden">
        <Search size={16} color="#8A8578" className="shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for deals..."
          className="w-full rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
        />
      </div>
    </header>
  );
}
