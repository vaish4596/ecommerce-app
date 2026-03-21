
"use client";

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Trash2, Plus, Minus, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const checkout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      clearCart();
    }, 2000);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <CheckCircle2 size={80} className="text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Order Placed!</h1>
      <p className="text-slate-500 mb-10 max-w-sm">Thank you for your purchase. Your order is on the way!</p>
      <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Continue Shopping</Link>
    </div>
  );

  if (cart.length === 0) return (
    <div className="text-center py-32">
      <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      <Link href="/" className="text-blue-600 font-semibold hover:underline">Start Shopping →</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-10">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 bg-white p-6 rounded-2xl border border-slate-200">
              <img src={item.image} className="w-24 h-24 rounded-lg object-cover bg-slate-100" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{item.category}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-slate-50 border-r text-lg">-</button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-slate-50 border-l text-lg">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="text-xl font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 h-fit sticky top-28">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 text-slate-600 mb-8">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-bold uppercase">Free</span></div>
            <div className="h-px bg-slate-100"></div>
            <div className="flex justify-between text-2xl font-bold text-slate-900"><span>Total</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
          </div>
          <button 
            disabled={loading}
            onClick={checkout}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
