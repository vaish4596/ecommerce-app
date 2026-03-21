
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Product, useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Added to Bag",
        description: `${product.name} is now ready for checkout.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/">
          <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to listing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              data-ai-hint="high quality product photo"
            />
          </div>

          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-primary bg-primary/10 border-none px-3 py-1">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold font-headline leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{(product.price * 1.2).toLocaleString('en-IN')}
                </span>
                <Badge className="bg-accent text-white border-none ml-2">20% OFF</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90 text-lg py-7 h-auto rounded-xl shadow-lg shadow-primary/20"
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 text-lg py-7 h-auto rounded-xl border-2"
              >
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold">Free Delivery</span>
                <span className="text-[10px] text-muted-foreground">Orders over ₹500</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold">Genuine Product</span>
                <span className="text-[10px] text-muted-foreground">100% Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RotateCcw className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold">Easy Returns</span>
                <span className="text-[10px] text-muted-foreground">7 Days Window</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
