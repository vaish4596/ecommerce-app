
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-headline mb-8 flex items-center gap-3">
          Your Shopping Cart
          <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              It looks like you haven't added anything to your cart yet. Go ahead and explore our awesome products!
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-xl px-8 h-12 text-base shadow-lg shadow-primary/20">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {cart.map((item, index) => (
                  <div key={item.id}>
                    <div className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group transition-colors hover:bg-muted/30">
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 border bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                          <h3 className="text-lg font-bold line-clamp-2">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">{item.category}</p>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                          <div className="flex items-center bg-muted rounded-lg border">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 h-8"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="text-lg font-bold shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                    {index < cart.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 rounded-2xl shadow-xl border-none bg-white sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-accent font-medium">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Button className="w-full py-7 h-auto text-lg rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                  Proceed to Checkout
                </Button>
                <div className="mt-6 flex flex-col items-center gap-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Secure Payment</p>
                  <div className="flex gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="w-8 h-5 bg-muted rounded"></div>
                    <div className="w-8 h-5 bg-muted rounded"></div>
                    <div className="w-8 h-5 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
