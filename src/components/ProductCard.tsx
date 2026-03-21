
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product, useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
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
