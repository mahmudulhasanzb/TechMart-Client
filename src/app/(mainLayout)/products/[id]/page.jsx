'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Button, Spinner } from '@heroui/react';
import { api } from '@/lib/api';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await api.getProductById(productId);
      setProduct(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    // Persist cart to localStorage
    const cart = JSON.parse(localStorage.getItem('techmart-cart') || '[]');
    const existing = cart.find(item => item.productId === product._id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: 1,
        maxStock: product.stock
      });
    }
    
    localStorage.setItem('techmart-cart', JSON.stringify(cart));
    
    setTimeout(() => {
      setAdding(false);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 2000);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-zinc-950 text-white min-h-screen">
        <Spinner size="lg" color="primary" />
        <p className="text-zinc-400 text-sm mt-3">Loading details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-zinc-950 text-white min-h-screen px-4">
        <div className="text-center p-6 bg-red-950/20 border border-red-900/30 rounded-xl max-w-md">
          <p className="text-red-400 font-bold mb-3">{error || 'Product not found'}</p>
          <Link href="/">
            <Button size="sm" variant="bordered" className="text-zinc-300 border-zinc-700">
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="flex-1 bg-zinc-950 text-white min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-8 transition-colors gap-1">
          <ChevronLeft className="size-4" /> Back to store
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Product Image */}
          <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center p-5 relative overflow-hidden">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              <div className="text-zinc-650 font-mono text-xs uppercase tracking-widest">No Image Available</div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs text-blue-400 tracking-wider uppercase font-black">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl font-black text-blue-400">${product.price.toFixed(2)}</span>
                
                {isOutOfStock ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-650 px-2 py-0.5 rounded shadow">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-amber-500 px-2 py-0.5 rounded shadow">
                    Only {product.stock} units left
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    In Stock ({product.stock})
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed border-t border-b border-zinc-800/60 py-6">
              {product.description || 'Detailed gadget descriptions and product insights are coming soon.'}
            </p>

            {/* Specifications Box */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-sm text-zinc-200 uppercase tracking-wider">Specifications</h3>
                <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
                  {Object.entries(product.specs).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">{key}</span>
                        <span className="text-sm text-zinc-300 font-medium mt-0.5">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4">
              <Button
                color="primary"
                variant="shadow"
                size="lg"
                onClick={handleAddToCart}
                isLoading={adding}
                disabled={isOutOfStock}
                className="w-full font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-14 rounded-xl text-sm"
                startContent={!adding && <ShoppingCart className="size-5" />}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              {addedMessage && (
                <div className="text-center text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg font-bold animate-pulse">
                  Product added to cart!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
