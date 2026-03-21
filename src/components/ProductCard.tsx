"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Heart } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const wishlistDocRef = user && db ? doc(db, 'users', user.uid, 'wishlist', product.id) : null;
  const { data: wishlistItem } = useDoc(wishlistDocRef);
  const isInWishlist = !!wishlistItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({ title: "Added to Cart", description: `${product.name} is in your bag.` });
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !db) {
      toast({ title: "Login Required", description: "Please login to save items.", variant: "destructive" });
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    if (isInWishlist) {
      deleteDoc(docRef).catch(() => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' })));
    } else {
      setDoc(docRef, { productId: product.id, addedAt: serverTimestamp() }).catch(() => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'create' })));
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', position: 'relative' }}>
      <button 
        onClick={toggleWishlist}
        style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: isInWishlist ? '#ef4444' : '#9ca3af' }}
      >
        <Heart style={{ width: '1.25rem', height: '1.25rem', fill: isInWishlist ? 'currentColor' : 'none' }} />
      </button>

      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', aspectRatio: '1/1', backgroundColor: '#f3f4f6' }}>
          <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{product.name}</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>{product.category}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</span>
            <button 
              onClick={handleAddToCart}
              style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '50%', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Plus />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
