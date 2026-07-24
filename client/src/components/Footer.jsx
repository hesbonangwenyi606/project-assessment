const footerLinks = [
  { title: "Shop", links: ["New arrivals", "Best sellers", "Deals"] },
  { title: "Support", links: ["Shipping", "Returns", "Contact us"] },
  { title: "Company", links: ["About", "Careers", "Privacy"] },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[color:var(--line)] bg-[color:var(--ink)] text-[color:var(--paper)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="display-font text-xl">ShopSavvy</p>
          <p className="mt-2 text-sm text-neutral-300">
            Discover smart deals, save on everyday favorites, and shop with confidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-[color:var(--lime)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-neutral-400">
        © 2026 ShopSavvy.
      </div>
    </footer>
  );
}
