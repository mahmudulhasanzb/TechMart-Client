'use client';

import { useState, useEffect } from 'react';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Button, Input, TextArea, Spinner, Modal
} from '@heroui/react';
import { api } from '@/lib/api';
import { Plus, Edit, Trash, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Accessories'];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [color, setColor] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts();
      setProducts(response.data || []);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setCategory(CATEGORIES[0]);
    setImage('');
    setBrand('');
    setModel('');
    setRam('');
    setStorage('');
    setColor('');
    setError('');
  };

  const populateForm = (product) => {
    setName(product.name || '');
    setDescription(product.description || '');
    setPrice(product.price?.toString() || '');
    setStock(product.stock?.toString() || '');
    setCategory(product.category || CATEGORIES[0]);
    setImage(product.images?.[0] || '');
    setBrand(product.specs?.brand || '');
    setModel(product.specs?.model || '');
    setRam(product.specs?.ram || '');
    setStorage(product.specs?.storage || '');
    setColor(product.specs?.color || '');
    setError('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        images: image ? [image] : [],
        specs: { brand, model, ram, storage, color }
      };

      await api.createProduct(productData);
      setIsAddOpen(false);
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        images: image ? [image] : [],
        specs: { brand, model, ram, storage, color }
      };

      await api.updateProduct(selectedProduct._id, productData);
      setIsEditOpen(false);
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setActionLoading(true);
    setError('');
    try {
      await api.deleteProduct(selectedProduct._id);
      setIsDeleteOpen(false);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 text-white min-h-screen p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black">Product Inventory</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage gadget catalog, specs, and stock levels.</p>
        </div>
        <Button 
          color="primary" 
          className="font-bold rounded-xl"
          startContent={<Plus className="size-4" />}
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
        >
          Add Gadget
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Spinner size="lg" color="primary" />
          <p className="text-zinc-400 text-sm">Loading inventory database...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 text-lg">Inventory database is empty.</p>
          <Button 
            color="primary" 
            variant="flat" 
            className="mt-4 font-bold"
            onClick={() => setIsAddOpen(true)}
          >
            Create First Product
          </Button>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <Table aria-label="Inventory Table" removeWrapper className="w-full text-white">
            <TableHeader className="bg-zinc-900 border-b border-zinc-800">
              <TableColumn className="text-zinc-400 py-4 px-6 text-left font-bold">GADGET</TableColumn>
              <TableColumn className="text-zinc-400 py-4 px-6 text-left font-bold">CATEGORY</TableColumn>
              <TableColumn className="text-zinc-400 py-4 px-6 text-left font-bold">PRICE</TableColumn>
              <TableColumn className="text-zinc-400 py-4 px-6 text-left font-bold">STOCK</TableColumn>
              <TableColumn className="text-zinc-400 py-4 px-6 text-right font-bold">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {products.map(product => {
                const isLowStock = product.stock > 0 && product.stock < 5;
                const isOutOfStock = product.stock === 0;

                return (
                  <TableRow key={product._id} className="border-b border-zinc-800/60 hover:bg-zinc-850/40 transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-950 border border-zinc-850 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-zinc-650">N/A</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-100">{product.name}</p>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5">{product.specs?.brand || 'Generic'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 font-bold text-zinc-200">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-zinc-300'}`}>
                          {product.stock}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-0.5 rounded font-black uppercase">Out</span>
                        ) : isLowStock ? (
                          <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-black uppercase inline-flex items-center gap-0.5">
                            <AlertTriangle className="size-3" /> Low
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="warning" 
                          isIconOnly
                          onClick={() => {
                            setSelectedProduct(product);
                            populateForm(product);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="danger" 
                          isIconOnly
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Modal */}
      <Modal.Root isOpen={isAddOpen} onOpenChange={setIsAddOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-lg bg-zinc-900 border border-zinc-800 text-white rounded-2xl overflow-hidden shadow-2xl">
            <Modal.Dialog className="outline-none">
              <form onSubmit={handleAddProduct}>
                <Modal.Header className="p-6 border-b border-zinc-800/80">
                  <Modal.Heading className="text-xl font-bold">Add New Gadget</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <Input 
                    label="Gadget Name" 
                    placeholder="e.g., MacBook Pro 16" 
                    value={name} 
                    onValueChange={setName} 
                    required 
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="number" 
                      step="0.01" 
                      label="Price ($)" 
                      placeholder="999.99" 
                      value={price} 
                      onValueChange={setPrice} 
                      required 
                      variant="bordered"
                      classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                    />
                    <Input 
                      type="number" 
                      label="Stock Count" 
                      placeholder="10" 
                      value={stock} 
                      onValueChange={setStock} 
                      required 
                      variant="bordered"
                      classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/80 transition-colors"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <Input 
                    label="Image URL" 
                    placeholder="https://..." 
                    value={image} 
                    onValueChange={setImage} 
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                  />
                  <TextArea 
                    label="Description" 
                    placeholder="Product specification details..." 
                    value={description} 
                    onValueChange={setDescription} 
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                  />
                  
                  <div className="border-t border-zinc-850 pt-4">
                    <p className="text-xs text-zinc-400 font-bold mb-3 uppercase tracking-wider">Specs (Optional)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Brand" placeholder="e.g., Apple" value={brand} onValueChange={setBrand} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="Model" placeholder="e.g., M3 Max" value={model} onValueChange={setModel} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="RAM" placeholder="e.g., 32GB" value={ram} onValueChange={setRam} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="Storage" placeholder="e.g., 1TB SSD" value={storage} onValueChange={setStorage} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="Color" placeholder="e.g., Space Black" value={color} onValueChange={setColor} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                    </div>
                  </div>

                  {error && <div className="text-xs text-red-500 font-bold mt-2 bg-red-950/20 p-2.5 rounded-lg border border-red-900/30">{error}</div>}
                </Modal.Body>
                <Modal.Footer className="p-6 border-t border-zinc-800/80 flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="bordered" 
                    className="border-zinc-800 text-zinc-400"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="primary" 
                    className="font-bold"
                    isLoading={actionLoading}
                  >
                    Create Product
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>

      {/* Edit Modal */}
      <Modal.Root isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-lg bg-zinc-900 border border-zinc-800 text-white rounded-2xl overflow-hidden shadow-2xl">
            <Modal.Dialog className="outline-none">
              <form onSubmit={handleEditProduct}>
                <Modal.Header className="p-6 border-b border-zinc-800/80">
                  <Modal.Heading className="text-xl font-bold">Edit Gadget Details</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <Input 
                    label="Gadget Name" 
                    value={name} 
                    onValueChange={setName} 
                    required 
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="number" 
                      step="0.01" 
                      label="Price ($)" 
                      value={price} 
                      onValueChange={setPrice} 
                      required 
                      variant="bordered"
                      classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                    />
                    <Input 
                      type="number" 
                      label="Stock Count" 
                      value={stock} 
                      onValueChange={setStock} 
                      required 
                      variant="bordered"
                      classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/80 transition-colors"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <Input 
                    label="Image URL" 
                    value={image} 
                    onValueChange={setImage} 
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                  />
                  <TextArea 
                    label="Description" 
                    value={description} 
                    onValueChange={setDescription} 
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }}
                  />
                  
                  <div className="border-t border-zinc-850 pt-4">
                    <p className="text-xs text-zinc-400 font-bold mb-3 uppercase tracking-wider">Specs (Optional)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Brand" value={brand} onValueChange={setBrand} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="Model" value={model} onValueChange={setModel} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="RAM" value={ram} onValueChange={setRam} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="Storage" value={storage} onValueChange={setStorage} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                      <Input label="Color" value={color} onValueChange={setColor} variant="bordered" classNames={{ inputWrapper: 'border-zinc-800 bg-zinc-950' }} />
                    </div>
                  </div>

                  {error && <div className="text-xs text-red-500 font-bold mt-2 bg-red-950/20 p-2.5 rounded-lg border border-red-900/30">{error}</div>}
                </Modal.Body>
                <Modal.Footer className="p-6 border-t border-zinc-800/80 flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="bordered" 
                    className="border-zinc-800 text-zinc-400"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="primary" 
                    className="font-bold"
                    isLoading={actionLoading}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>

      {/* Delete Modal */}
      <Modal.Root isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-sm bg-zinc-900 border border-zinc-800 text-white rounded-2xl overflow-hidden shadow-2xl">
            <Modal.Dialog className="outline-none p-6 space-y-4">
              <Modal.Header>
                <Modal.Heading className="text-lg font-bold text-red-400">Delete Product</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-white">{selectedProduct?.name}</span>? This action cannot be undone.
                </p>
                {error && <div className="text-xs text-red-500 font-bold mt-2 bg-red-950/20 p-2.5 rounded-lg border border-red-900/30">{error}</div>}
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-3 pt-2">
                <Button 
                  size="sm"
                  variant="bordered" 
                  className="border-zinc-800 text-zinc-400"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  color="danger" 
                  className="font-bold"
                  isLoading={actionLoading}
                  onClick={handleDeleteProduct}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </div>
  );
}
