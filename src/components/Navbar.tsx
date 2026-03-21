
"use client";

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('q', searchValue);
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary font-headline hidden sm:block">
            Catalyst Catalog
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md relative group">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 bg-background border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary transition-all"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </form>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 bg-accent text-accent-foreground text-[10px] flex items-center justify-center border-2 border-white">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu (Simplified for this app) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/" className="block text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/cart" className="block text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>View Cart ({cartCount})</Link>
        </div>
      )}
    </nav>
  );
}
