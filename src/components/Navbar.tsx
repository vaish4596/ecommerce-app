
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, LogOut, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUser, auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { cartCount } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Catalyst
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/wishlist" className="text-slate-600 hover:text-blue-600 transition">
            <Heart size={24} />
          </Link>
          
          <Link href="/cart" className="relative text-slate-600 hover:text-blue-600 transition">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
