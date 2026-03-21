
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home & Decor"];

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>("default");
  
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentCategory !== 'All') params.set('category', currentCategory);
      if (searchQuery) params.set('q', searchQuery);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [currentCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline text-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : currentCategory === 'All' ? 'Discover Products' : currentCategory}
            </h1>
            <p className="text-muted-foreground mt-1">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:flex bg-white rounded-lg p-1 border shadow-sm">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-lg">Categories</h3>
              </div>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={currentCategory === cat ? 'default' : 'ghost'}
                    className="w-full justify-start text-sm font-medium"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (cat === 'All') params.delete('category');
                      else params.set('category', cat);
                      window.history.pushState(null, '', `?${params.toString()}`);
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" 
                : "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => window.location.href = '/'}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Catalyst Catalog. Built with efficiency and elegance.
          </p>
        </div>
      </footer>
    </div>
  );
}
