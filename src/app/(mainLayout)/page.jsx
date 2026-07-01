'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Input, Button, Spinner } from '@heroui/react';
import { api } from '@/lib/api';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Accessories'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts({
        search,
        category: selectedCategory
      });
      setProducts(response.data || []);
    } catch (err) {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 text-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative py-20 px-4 text-center bg-gradient-to-b from-blue-950/30 to-zinc-950 border-b border-zinc-800">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          TechMart Gadgets
        </h1>
        <p className="text-zinc-400 mt-4 max-w-xl mx-auto text-base md:text-lg">
          Explore smart devices, powerful hardware, and cool tech gear. Next-day delivery available.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Search and Categories Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <Input
            type="text"
            placeholder="Search gadgets..."
            startContent={<Search className="text-zinc-400 size-5" />}
            value={search}
            onValueChange={setSearch}
            className="w-full md:max-w-md"
            variant="bordered"
            classNames={{
              inputWrapper: 'border-zinc-800 bg-zinc-900/50 text-white hover:border-zinc-700',
            }}
          />

          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'solid' : 'bordered'}
                className={`font-semibold border-zinc-800 text-zinc-300 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'hover:bg-zinc-900 bg-zinc-900/20'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-zinc-400 text-sm">Loading gadgets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl max-w-md mx-auto p-6">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-400 text-lg">No gadgets found matching filters.</p>
            <p className="text-zinc-500 text-sm mt-1">Try adjusting search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const isLowStock = product.stock > 0 && product.stock < 5;
              const isOutOfStock = product.stock === 0;

              return (
                <Card
                  key={product._id}
                  className="bg-zinc-900 border border-zinc-800 text-white hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden"
                >
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-contain max-h-full max-w-full rounded-2xl"
                    />
                  ) : (
                    <div className="text-zinc-700 text-xs font-mono uppercase">
                      No Image Available
                    </div>
                  )}

                  {/* Stock badging */}
                  {isOutOfStock ? (
                    <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase text-white bg-red-600 px-2 py-0.5 rounded shadow">
                      Sold Out
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase text-black bg-amber-500 px-2 py-0.5 rounded shadow">
                      Only {product.stock} Left
                    </span>
                  ) : null}

                  <CardHeader className="flex flex-col items-start gap-0.5 p-4 pb-2">
                    <span className="text-[10px] text-blue-400 tracking-wider uppercase font-extrabold">
                      {product.category}
                    </span>
                    <h2 className="text-base font-bold text-zinc-100 line-clamp-1">
                      {product.name}
                    </h2>
                  </CardHeader>

                  <CardContent className="px-4 py-0 flex-1">
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {product.description ||
                        'Premium gadget details not configured.'}
                    </p>
                  </CardContent>

                  <div className="p-4 flex justify-between items-center border-t border-zinc-800/60 mt-4 bg-zinc-900/40">
                    <span className="text-lg font-black text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <Link href={`/products/${product._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-md border border-white/20 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
                      >
                        Specs & Buy
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
