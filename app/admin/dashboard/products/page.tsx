'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit2, Trash2, Package, ShieldCheck, ShieldAlert, Plus, Upload, X, Loader2, ImageIcon } from 'lucide-react'

const PRODUCT_MAPPING = {
  "24 inch": { size: "24\"", models: ["Basic Frameless", "Basic Double Glass", "Smart Frameless", "Smart Double Glass"] },
  "32 inch": { size: "32\"", models: ["Regular Series", "Gold Series", "Google TV"] },
  "43 inch": { size: "43\"", models: ["Regular Series", "Gold Series", "Google TV"] },
  "50 inch": { size: "50\"", models: ["Regular Series", "Gold Series", "Google TV"] },
  "65 inch": { size: "65\"", models: ["Regular Series", "Gold Series", "Google TV"] }
}

type CategoryKey = keyof typeof PRODUCT_MAPPING;

interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [addDialog, setAddDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [formData, setFormData] = useState({
    name: '',
    category: '' as CategoryKey | '',
    size: '',
    price: 0,
    description: '',
    image_url: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })

    if (error) toast.error("Failed to load inventory")
    else setProducts(data || [])
    setLoading(false)
  }

  const validateForm = () => {
    if (!formData.category) { toast.error("Please select a size category"); return false; }
    if (!formData.name) { toast.error("Please select a model name"); return false; }
    if (formData.price <= 0) { toast.error("Price must be greater than 0"); return false; }
    return true;
  }

  const handleCategoryChange = (value: CategoryKey) => {
    setFormData({
      ...formData,
      category: value,
      size: PRODUCT_MAPPING[value].size,
      name: ''
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `product-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      setImagePreview(publicUrl)
      toast.success("Image uploaded successfully!")
    } catch (err: any) {
      console.error("Upload Error:", err)
      toast.error(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
    setImagePreview('')
  }

  const openAddDialog = () => {
    setFormData({ name: '', category: '', size: '', price: 0, description: '', image_url: '' })
    setImagePreview('')
    setAddDialog(true)
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      category: product.category as CategoryKey,
      size: product.size,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url || ''
    })
    setImagePreview(product.image_url || '')
    setEditDialog(true)
  }

  const handleAdd = async () => {
    if (!validateForm()) return
    const { error } = await supabase.from('products').insert([{ ...formData, is_active: true }])
    if (!error) {
      toast.success(`${formData.name} added to catalog`)
      setAddDialog(false)
      fetchProducts()
    } else toast.error("Failed to add product")
  }

  const handleEdit = async () => {
    if (!selectedProduct || !validateForm()) return
    const { error } = await supabase
      .from('products')
      .update({ ...formData })
      .eq('id', selectedProduct.id)

    if (!error) {
      toast.success("Changes saved successfully")
      setEditDialog(false)
      fetchProducts()
    } else toast.error("Failed to update product")
  }

  const handleDelete = async () => {
    if (!selectedProduct) return
    const { error } = await supabase.from('products').delete().eq('id', selectedProduct.id)
    if (!error) {
      toast.success("Product deleted permanently")
      setDeleteDialog(false)
      fetchProducts()
    } else toast.error("Delete failed")
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) {
      toast.info(currentStatus ? "Product hidden from site" : "Product is now live")
      fetchProducts()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-red-600 border-r-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black via-red-950 to-red-900 px-8 py-10 mb-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Products Management</h1>
          <p className="text-red-200 mt-2 font-medium">Add, update, and manage your TV inventory</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-white text-red-700 hover:bg-gray-100 font-bold px-8 py-6 h-auto text-lg rounded-xl shadow-lg transition-transform active:scale-95"
        >
          <Plus className="mr-2 h-6 w-6" /> Add New Product
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-black overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Inventory</CardTitle>
            <Package className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Online</CardTitle>
            <ShieldCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">{products.filter(p => p.is_active).length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Out of Stock</CardTitle>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">{products.filter(p => !p.is_active).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="p-5 font-bold text-gray-600">Image</th>
                <th className="p-5 font-bold text-gray-600">Product Details</th>
                <th className="p-5 font-bold text-gray-600">Category & Size</th>
                <th className="p-5 font-bold text-gray-600">Price</th>
                <th className="p-5 font-bold text-gray-600">Active Status</th>
                <th className="p-5 font-bold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-red-50/30 transition-colors">
                  <td className="p-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-gray-900 text-lg">{product.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-tighter">
                        {product.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                        {product.size}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 font-mono font-bold text-red-700 text-lg">
                    ৳{product.price.toLocaleString()}
                  </td>
                  <td className="p-5">
                    <Switch
                      checked={product.is_active}
                      onCheckedChange={() => toggleActive(product.id, product.is_active)}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-600"
                    />
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full">
                        <Edit2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedProduct(product); setDeleteDialog(true); }} className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={addDialog || editDialog} onOpenChange={(open) => { if (!open) { setAddDialog(false); setEditDialog(false); } }}>
        <DialogContent className="max-w-3xl bg-white p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-black to-red-900 p-8">
            <DialogTitle className="text-3xl font-black text-white">
              {addDialog ? "Create New Listing" : "Update Product Info"}
            </DialogTitle>
            <DialogDescription className="text-red-200 text-lg mt-1">
              Select product category and model specifications
            </DialogDescription>
          </div>

          <div className="p-8 space-y-8">
            {/* Product Image Upload Section */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700">Product Image</Label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                        <p className="text-sm text-gray-600 font-medium">Uploading image...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Click to upload product image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-64 object-contain bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              )}

              {/* Manual URL Input (Optional) */}
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  Or paste image URL manually
                </summary>
                <Input 
                  value={formData.image_url} 
                  onChange={e => {
                    setFormData({...formData, image_url: e.target.value})
                    setImagePreview(e.target.value)
                  }} 
                  placeholder="https://supabase-url.com/product.jpg"
                  className="mt-2 h-10 border text-xs"
                />
              </details>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="space-y-3">
                <Label className="text-xs font-black text-red-800 uppercase tracking-widest">1. Select Category</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category}>
                  <SelectTrigger className="h-14 bg-white border-2 border-gray-200 text-lg font-medium focus:ring-red-500">
                    <SelectValue placeholder="e.g. 32 inch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white opacity-100 shadow-2xl border border-gray-200 z-[100]">
                    {Object.keys(PRODUCT_MAPPING).map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-lg py-3">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-red-800 uppercase tracking-widest">2. Choose Model</Label>
                <Select
                  onValueChange={(val) => setFormData({ ...formData, name: val })}
                  value={formData.name}
                  disabled={!formData.category}
                >
                  <SelectTrigger className={`h-14 bg-white opacity-100 border-2 text-lg font-medium transition-all ${formData.category ? 'border-red-200 ring-2 ring-red-50' : 'border-gray-100 opacity-60'}`}>
                    <SelectValue placeholder={formData.category ? "Select Model" : "← Pick size first"} />
                  </SelectTrigger>

                  <SelectContent className="bg-white opacity-100 border border-gray-200 shadow-2xl z-[100]">
                    {formData.category && PRODUCT_MAPPING[formData.category as CategoryKey].models.map((model) => (
                      <SelectItem key={model} value={model} className="text-lg py-3 hover:bg-gray-100 focus:bg-gray-100">
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Price (৳)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                  <Input
                    type="number"
                    step="1000"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="h-12 pl-8 border-2 text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Screen Size (Auto)</Label>
                <Input
                  value={formData.size}
                  readOnly
                  className="h-12 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-500 font-bold text-lg"
                  placeholder='Based on category'
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700">Product Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="resize-none border-2 text-base p-4"
                placeholder="Briefly describe features (e.g. 4K, Android 11, Voice Control...)"
              />
            </div>
          </div>

          <DialogFooter className="p-8 bg-gray-50 border-t flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => { setAddDialog(false); setEditDialog(false); }}
              className="px-10 h-14 font-bold border-2 hover:bg-white rounded-xl flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={addDialog ? handleAdd : handleEdit}
              disabled={isUploading}
              className="bg-red-700 hover:bg-red-800 text-white px-12 h-14 font-black text-lg shadow-lg rounded-xl flex-1 sm:flex-none"
            >
              {addDialog ? "Save & Publish" : "Apply Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Delete Product?</DialogTitle>
            <DialogDescription className="py-4 text-gray-600 text-base">
              This will permanently remove <span className="font-bold text-red-600">"{selectedProduct?.name}"</span> from your database. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setDeleteDialog(false)} className="rounded-lg h-12 px-6">Keep Product</Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-lg h-12 px-6 font-bold">Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}