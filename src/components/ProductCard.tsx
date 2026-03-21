
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product, useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useDoc } from '@/firebase';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  // Check if product is in wishlist
  const wishlistDocRef = user && db ? doc(db, 'users', user.uid, 'wishlist', product.id) : null;
  const { data: wishlistItem, loading: wishlistLoading } = useDoc(wishlistDocRef);
  const isInWishlist = !!wishlistItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !db) {
      toast({
        title: "Login Required",
        description: "Please login to save items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'wishlist', product.id);

    if (isInWishlist) {
      deleteDoc(docRef).catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed.`,
      });
    } else {
      setDoc(docRef, {
        productId: product.id,
        addedAt: serverTimestamp(),
      }).catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: { productId: product.id }
        }));
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been saved.`,
      });
    }
  };

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white relative">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-3 right-3 z-10 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white",
          isInWishlist ? "text-red-500" : "text-muted-foreground"
        )}
        onClick={toggleWishlist}
        disabled={wishlistLoading}
      >
        <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
      </Button>

      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="product image"
          />
          <Badge className="absolute top-3 left-3 bg-white/90 text-primary border-none text-xs backdrop-blur-sm">
            {product.category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-headline font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
            Premium selection
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold text-foreground">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <Button 
          size="icon" 
          onClick={handleAddToCart}
          className="rounded-full w-10 h-10 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
