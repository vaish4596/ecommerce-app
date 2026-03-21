"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Search, Heart, User, LogOut, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const auth = useAuth();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) params.set('q', searchValue);
    else params.delete('q');
    router.push(`/?${params.toString()}`);
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  return (
    <nav style={{ 
      position: 'sticky', top: 0, zIndex: 50, width: '100%', 
      backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', 
      borderBottom: '1px solid #e5e7eb' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#3b82f6' }}>
          <div style={{ width: '2rem', height: '2rem', backgroundColor: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>C</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Catalyst</span>
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search..."
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/wishlist" style={{ color: '#4b5563' }}><Heart /></Link>
          
          <Link href="/cart" style={{ position: 'relative', color: '#4b5563' }}>
            <ShoppingCart />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', backgroundColor: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '999px' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', display: 'none', sm: 'inline' }}>{user.displayName || 'User'}</span>
              <button onClick={handleSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><LogOut /></button>
            </div>
          ) : (
            <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#3b82f6', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
