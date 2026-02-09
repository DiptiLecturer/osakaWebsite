'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

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
          <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
            <span className="text-xl mr-2">+</span> Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-red-600 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-black">{products.length}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-full">
              <span className="text-3xl">📺</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-green-600 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Products</p>
              <p className="text-3xl font-bold text-green-600">
                {products.filter(p => p.is_active).length}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-gray-600 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inactive Products</p>
              <p className="text-3xl font-bold text-gray-600">
                {products.filter(p => !p.is_active).length}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
              <span className="text-3xl">❌</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="shadow-lg">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">All Products</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-black to-red-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Size</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Price</th>
                <th className="px-6 py-4 text-center text-sm font-bold uppercase">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product, index) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-red-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{product.size}</td>
                  <td className="px-6 py-4">
                    <span className="text-xl font-bold text-red-600">
                      ৳ {product.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={() => toggleActive(product.id, product.is_active)}
                        className="data-[state=checked]:bg-red-600"
                      />
                      <span className={`text-sm font-medium ${product.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        ✏️ Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{products.length}</span> products
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{products.filter(p => p.is_active).length}</span> active • 
            <span className="font-semibold text-gray-500 ml-1">{products.filter(p => !p.is_active).length}</span> inactive
          </div>
        </div>
      </Card>
    </div>
  )
}