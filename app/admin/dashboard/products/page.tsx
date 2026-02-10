'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Product {
  id: string
  name: string
  category: string
  size: string
  price: number
  description: string
  image_url: string | null
  is_active: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [addDialog, setAddDialog] = useState(false) // Added Add State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    size: '',
    price: 0,
    description: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (!error) {
      fetchProducts()
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      size: product.size,
      price: product.price,
      description: product.description || ''
    })
    setEditDialog(true)
  }

  const handleEdit = async () => {
    if (!selectedProduct) return

    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        category: formData.category,
        size: formData.size,
        price: formData.price,
        description: formData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedProduct.id)

    if (!error) {
      setEditDialog(false)
      fetchProducts()
    } else {
      alert('Error updating product')
    }
  }

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!selectedProduct) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', selectedProduct.id)

    if (!error) {
      setDeleteDialog(false)
      setSelectedProduct(null)
      fetchProducts()
    } else {
      alert('Error deleting product')
    }
  }

  // --- New Add Functions ---
  const handleAdd = async () => {
    const { error } = await supabase
      .from('products')
      .insert([{
        name: formData.name,
        category: formData.category,
        size: formData.size,
        price: formData.price,
        description: formData.description,
        is_active: true
      }])

    if (!error) {
      setAddDialog(false)
      setFormData({ name: '', category: '', size: '', price: 0, description: '' })
      fetchProducts()
    } else {
      alert('Error adding product')
    }
  }

  const openAddDialog = () => {
    setFormData({ name: '', category: '', size: '', price: 0, description: '' })
    setAddDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-red-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Products Management
            </h1>
            <p className="text-gray-300">Manage your TV inventory</p>
          </div>
          <Button 
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
            onClick={openAddDialog}
          >
            <span className="text-xl mr-2">+</span> Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Cards Section (Omitted for brevity, keep your original) */}
      {/* ... (Total/Active/Inactive cards code) ... */}

      {/* Products Table Section (Omitted for brevity, keep your original) */}
      {/* ... (Table code with Edit/Delete buttons) ... */}

      {/* Edit Dialog (Keep your current Edit dialog) */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        {/* ... (Your Edit dialog content) ... */}
      </Dialog>

      {/* Delete Confirmation Dialog (Keep your current Delete dialog) */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        {/* ... (Your Delete dialog content) ... */}
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Add New Product</DialogTitle>
            <DialogDescription>Add a new TV to your inventory</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right font-semibold">Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Smart Frameless"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-category" className="text-right font-semibold">Category</Label>
              <Input
                id="add-category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="col-span-3"
                placeholder="e.g., 24 inch, 32 inch"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-size" className="text-right font-semibold">Size</Label>
              <Input
                id="add-size"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="col-span-3"
                placeholder='e.g., 24", 32"'
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-price" className="text-right font-semibold">Price (৳)</Label>
              <Input
                id="add-price"
                type="number"
                step="1000"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-description" className="text-right font-semibold">Description</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleAdd}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}