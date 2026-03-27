import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Phone } from "lucide-react";

import logoImage from "../../../images/logo.png";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      "/": "Sri Amman Jewellery - Premium Gold & Diamond Jewellery",
      "/gold-rate": "Today's Gold Rate - Sri Amman Jewellery",
      "/products": "Our Collection - Sri Amman Jewellery",
      "/about": "About Us - Sri Amman Jewellery",
      "/contact": "Contact Us - Sri Amman Jewellery",
      "/admin": "Admin Dashboard - Sri Amman Jewellery",
      "/admin/products": "Manage Products - Admin",
      "/admin/gold-rate": "Manage Gold Rate - Admin",
    };

    const title = pageTitles[location.pathname] || "Sri Amman Jewellery";
    document.title = title;

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

  const mainNavLinks = [
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

  const navLinks = isAdmin ? adminNavLinks : mainNavLinks;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-clip">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img
                src={logoImage}
                alt="Sri Amman Jewellery"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl tracking-wide text-gray-900 truncate">
                  Sri Amman Jewellery
                </h1>
                <p className="text-[11px] sm:text-xs text-gray-600 truncate">
                  Premium Gold & Diamond
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    location.pathname === link.path
                      ? "text-yellow-600"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAdmin && (
                <a
                  href="tel:+919363161304"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-yellow-600 text-white rounded-lg shadow-sm hover:bg-yellow-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              )}
              {!isAdmin && (
                <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                  Admin
                </Link>
              )}
              {isAdmin && (
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                  Exit Admin
                </Link>
              )}
            </nav>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="md:hidden inline-flex items-center justify-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block rounded-lg px-4 py-3 transition-colors ${
                    location.pathname === link.path
                      ? "bg-yellow-50 text-yellow-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAdmin && (
                <a
                  href="tel:+919363161304"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-yellow-600 text-white rounded-lg shadow-sm hover:bg-yellow-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              )}
              {!isAdmin && (
                <Link
                  to="/admin"
                  className="block rounded-lg px-4 py-3 text-gray-500 hover:bg-gray-50"
                >
                  Admin
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/"
                  className="block rounded-lg px-4 py-3 text-gray-500 hover:bg-gray-50"
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
        <footer className="bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={logoImage}
                    alt="Sri Amman Jewellery"
                    className="w-10 h-10 object-contain"
                  />
                  <h3 className="text-white">Sri Amman Jewellery</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your trusted destination for authentic gold and diamond jewellery.
                  Serving customers with quality and trust since 1990.
                </p>
              </div>
              <div>
                <h3 className="text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/gold-rate" className="hover:text-yellow-400 transition-colors">
                      Gold Rate
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-yellow-400 transition-colors">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-yellow-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-yellow-400 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white mb-4">Contact Info</h3>
                <ul className="space-y-2 text-sm">
                  <li>ST-2, Kollar Theru, Veeraganur, Tamil Nadu 636116</li>
                  <li>Phone: 9363161304</li>
                  <li>Email: info@sriammanjewellery.com</li>
                  <li>Open: Mon - Sat, 10AM - 8PM</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              <p>&copy; 2026 Sri Amman Jewellery. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
