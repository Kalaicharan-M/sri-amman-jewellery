import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { ChevronRight, Menu, Phone, ShieldCheck, X } from "lucide-react";

import logoImage from "../../../images/logo.png";

const publicNavLinks = [
  { path: "/", label: "Home" },
  { path: "/gold-rate", label: "Gold Rate" },
  { path: "/products", label: "Products" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const adminNavLinks = [
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/products", label: "Products" },
  { path: "/admin/gold-rate", label: "Gold Rate" },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const navLinks = isAdmin ? adminNavLinks : publicNavLinks;

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      "/": "Sri Amman Jewellery - Premium Gold & Diamond Jewellery",
      "/gold-rate": "Today's Gold Rate - Sri Amman Jewellery",
      "/products": "Our Collection - Sri Amman Jewellery",
      "/about": "About Us - Sri Amman Jewellery",
      "/contact": "Contact Us - Sri Amman Jewellery",
      "/admin": "Admin Dashboard - Sri Amman Jewellery",
      "/admin/products": "Manage Products - Sri Amman Jewellery",
      "/admin/gold-rate": "Gold Rate Monitor - Sri Amman Jewellery",
    };

    document.title = pageTitles[location.pathname] || "Sri Amman Jewellery";

    const existingLink = document.querySelector("link[rel~='icon']") as
      | HTMLLinkElement
      | null;
    const link = existingLink || document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = logoImage;

    if (!existingLink) {
      document.head.appendChild(link);
    }

    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdf8] text-slate-900">
      {!isAdmin && (
        <div className="border-b border-[#eadfc5] bg-[#1f1712] px-4 py-2 text-[11px] text-[#f4e9cf] sm:text-xs">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#d8b15a]" />
              BIS hallmarked jewellery with live gold-rate updates
            </p>
            <p>ST-2, Kollar Theru, Veeraganur, Tamil Nadu 636116</p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-[#eadfc5] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="rounded-2xl border border-[#eadfc5] bg-[#fff9ec] p-2 shadow-sm">
              <img
                src={logoImage}
                alt="Sri Amman Jewellery"
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm tracking-[0.22em] text-[#b88a2f] sm:text-xs">
                PREMIUM GOLD & DIAMOND
              </p>
              <h1 className="truncate text-base text-slate-900 sm:text-xl">
                Sri Amman Jewellery
              </h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-[#b88a2f]"
                      : "text-slate-700 hover:text-[#b88a2f]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!isAdmin ? (
              <>
                <a
                  href="tel:+919363161304"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-sm text-white shadow-md transition hover:bg-[#b88a2f]"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <Link
                  to="/admin"
                  className="text-sm text-slate-500 transition hover:text-slate-800"
                >
                  Admin
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
              >
                Exit Admin
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-xl border border-[#eadfc5] bg-white p-3 text-slate-700 shadow-sm transition hover:bg-[#fff9ec] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute left-0 top-full w-full border-t border-[#eadfc5] bg-white shadow-xl md:hidden animate-[navSlideDown_220ms_ease-out]">
            <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-[#fff6df] text-[#b88a2f]"
                        : "text-slate-700 hover:bg-[#fff9ec]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {!isAdmin ? (
                <>
                  <a
                    href="tel:+919363161304"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-sm text-white shadow-md transition hover:bg-[#b88a2f]"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                  <Link
                    to="/admin"
                    className="rounded-xl border border-[#eadfc5] px-4 py-3 text-center text-sm text-slate-600 transition hover:bg-[#fff9ec]"
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <Link
                  to="/"
                  className="rounded-xl border border-[#eadfc5] px-4 py-3 text-center text-sm text-slate-600 transition hover:bg-[#fff9ec]"
                >
                  Exit Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAdmin && (
        <footer className="border-t border-[#eadfc5] bg-[#1f1712] text-[#f5ecd9]">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#fff9ec] p-2">
                    <img
                      src={logoImage}
                      alt="Sri Amman Jewellery"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl text-white">Sri Amman Jewellery</h3>
                    <p className="text-sm text-[#d8c6a0]">
                      Fine jewellery with heritage craftsmanship
                    </p>
                  </div>
                </div>
                <p className="max-w-md text-sm leading-7 text-[#d8c6a0]">
                  Discover premium gold jewellery shaped for weddings, gifting,
                  and everyday elegance, backed by transparent pricing and
                  trusted service.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg text-white">Explore</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {publicNavLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-[#d8c6a0] transition hover:text-[#f5ecd9]"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href="https://wa.me/919363161304"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#d8c6a0] transition hover:text-[#f5ecd9]"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg text-white">Contact</h3>
                <div className="space-y-2 text-sm leading-7 text-[#d8c6a0]">
                  <p>ST-2, Kollar Theru, Veeraganur, Tamil Nadu 636116</p>
                  <p>Phone: 9363161304</p>
                  <p>Email: sriammanjewells@gmail.com</p>
                  <p>Open: Monday to Saturday, 10 AM - 8 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-[#bca77b]">
              <p>&copy; 2026 Sri Amman Jewellery. Crafted for timeless celebrations.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
