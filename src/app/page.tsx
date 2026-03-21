
"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useUser, db } from '@/firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import { Heart, ShoppingBag, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  const { addToCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    const q = collection(db, 'users', user.uid, 'wishlist');
    return onSnapshot(q, (snapshot) => {
      setWishlistIds(snapshot.docs.map(d => d.id));
    });
  }, [user]);

  const toggleWishlist = async (product: any) => {
    if (!user) {
      toast({ title: "Login required", description: "Please login to save items." });
      return;
    }
    const docRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    if (wishlistIds.includes(product.id)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { productId: product.id, addedAt: new Date().toISOString() });
    }
  };

  const filtered = products
    .filter(p => category === "All" || p.category === category)
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return 0;
    });

  if (loading) return <div className="p-10 text-center">Loading catalog...</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold">Discover Products</h1>
        
        <div className="flex gap-4">
          <select 
            className="border rounded-lg px-3 py-2 bg-white text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All", "Electronics", "Clothing", "Books", "Home & Decor"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            className="border rounded-lg px-3 py-2 bg-white text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition group">
            <div className="relative aspect-square bg-slate-100 overflow-hidden">
              <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
              <button 
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-sm bg-white/80 backdrop-blur-sm transition ${wishlistIds.includes(product.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
              >
                <Heart size={20} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="p-5">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
              <h3 className="font-bold text-lg mt-1 truncate">{product.name}</h3>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                <button 
                  onClick={() => {
                    addToCart(product);
                    toast({ title: "Added!", description: `${product.name} is in your cart.` });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl transition shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
