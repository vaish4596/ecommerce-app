
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const wishlistQuery = user && db ? query(collection(db, 'users', user.uid, 'wishlist')) : null;
  const { data: wishlistItems, loading: wishlistLoading } = useCollection(wishlistQuery);

  useEffect(() => {
    async function fetchWishlistDetails() {
      if (!wishlistItems || wishlistItems.length === 0) {
        setWishlistProducts([]);
        return;
      }

      setLoadingProducts(true);
      try {
        const productPromises = wishlistItems.map(item => 
          fetch(`/api/products/${item.productId}`).then(res => res.json())
        );
        const products = await Promise.all(productPromises);
        setWishlistProducts(products.filter(p => !p.error));
      } catch (error) {
        console.error("Failed to fetch wishlist products");
      } finally {
        setLoadingProducts(false);
      }
    }

    if (wishlistItems) {
      fetchWishlistDetails();
    }
  }, [wishlistItems]);

  if (userLoading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your wishlist is waiting</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">Login to save your favorite items and see them here anytime.</p>
          <Link href="/login">
            <Button size="lg" className="rounded-xl px-8">Login / Sign Up</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
              My Wishlist
              <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {wishlistProducts.length} items
              </span>
            </h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Wishlist is empty</h3>
            <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
              Save items you love to your wishlist and they'll appear here.
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-6">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
