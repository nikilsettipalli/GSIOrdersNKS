import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useCart from '../hooks/useCart';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const brands = [
    { name: 'Liquid Heaven', slug: 'liquidheaven', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600', image: '/liquid-heaven.png' },
    { name: 'Motaquila', slug: 'motaquila', color: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Last Genie', slug: 'lastgenie', color: '#6366f1', gradient: 'from-indigo-500 to-indigo-600' }
  ];

  const currentBrandSlug = router.asPath.split('/')[1];
  const currentBrand = brands.find(b => b.slug === currentBrandSlug);
  const brandGradient = currentBrand?.gradient || 'from-blue-500 to-blue-600';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`bg-gradient-to-r ${brandGradient} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/gsi-logo.png"
                alt="GSI Logo"
                width={50}
                height={50}
              />
              <div className="text-white">
                <h1 className="text-xl font-bold">GSI Orders</h1>
                {currentBrand && <p className="text-sm text-white/80">{currentBrand.name}</p>}
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white">Home</Link>
              <Link href="/products" className="text-white">Browse Products</Link>
              <Link href="/orders" className="text-white">Orders</Link>
              <Link href="/admin" className="text-white">Admin</Link>
              <Link href="/contact" className="text-white">Contact</Link>
              <Link href="/cart" className="relative text-white">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13l-1.5 6h13l-1.5-6" />
                </svg>
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.itemCount > 10 ? '10+' : cart.itemCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-sm border-t border-white/20">
            {['/', '/products', '/orders', '/admin', '/contact'].map((path, i) => {
              const names = ['Home', 'Browse Products', 'Orders', 'Admin', 'Contact'];
              return (
                <Link key={path} href={path} className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                  {names[i]}
                </Link>
              );
            })}
            <Link href="/cart" className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
              Cart ({cart.itemCount})
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; 2024 GSI Orders. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
