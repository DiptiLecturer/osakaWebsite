'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import Footer from '@/components/Footer'
import TVCard from '@/components/TVCard'
import SocialLinks from '@/components/SocialLinks'
import { supabase } from '@/lib/supabase'

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
    
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* HOME SECTION */}
        <section id="home">
          <HeroCarousel />
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center mb-16">
              About <span className="text-red-600">OSAKA Television</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold mb-6">Our Story</h3>
                <p className="text-gray-700 text-lg mb-4">
                  OSAKA Television has been at the forefront of bringing premium television 
                  solutions to homes and businesses across Bangladesh. With years of experience 
                  in the industry, we understand what our customers need.
                </p>
                <p className="text-gray-700 text-lg">
                  Our commitment to quality, innovation, and customer satisfaction has made us 
                  a trusted name in the television industry. We offer a comprehensive range of 
                  televisions from 24 inch to 65 inch.
                </p>
              </div>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-lg">Company Image</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">✓</div>
                <h4 className="text-xl font-bold mb-2 text-red-600">Premium Quality</h4>
                <p className="text-gray-600">
                  All our televisions meet international quality standards
                </p>
              </div>

              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">📺</div>
                <h4 className="text-xl font-bold mb-2 text-red-600">Wide Range</h4>
                <p className="text-gray-600">
                  From 24 inch to 65 inch - perfect size for everyone
                </p>
              </div>

              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-xl font-bold mb-2 text-red-600">Customer Support</h4>
                <p className="text-gray-600">
                  Dedicated support team to assist you anytime
                </p>
              </div>
            </div>
          </div>
        </section>

{/* CATEGORY SECTION */}
        <section id="category" className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center mb-16">
              Our <span className="text-red-600">Categories</span>
            </h2>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* 24 inch */}
                {getProductsByCategory('24 inch').length > 0 && (
                  <div>
                    <h3 className="text-4xl font-bold mb-8 text-center">
                      <span className="text-red-600">24 inch</span> Televisions
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {getProductsByCategory('24 inch').map((product) => (
                        <TVCard
                          key={product.id}
                          name={product.name}
                          price={`৳ ${product.price.toLocaleString()}`}
                          image={product.image_url || ''}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 32 inch */}
                {getProductsByCategory('32 inch').length > 0 && (
                  <div>
                    <h3 className="text-4xl font-bold mb-8 text-center">
                      <span className="text-red-600">32 inch</span> Televisions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {getProductsByCategory('32 inch').map((product) => (
                        <TVCard
                          key={product.id}
                          name={product.name}
                          price={`৳ ${product.price.toLocaleString()}`}
                          image={product.image_url || ''}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 43 inch */}
                {getProductsByCategory('43 inch').length > 0 && (
                  <div>
                    <h3 className="text-4xl font-bold mb-8 text-center">
                      <span className="text-red-600">43 inch</span> Televisions
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      {getProductsByCategory('43 inch').map((product) => (
                        <TVCard
                          key={product.id}
                          name={product.name}
                          price={`৳ ${product.price.toLocaleString()}`}
                          image={product.image_url || ''}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 50 inch */}
                {getProductsByCategory('50 inch').length > 0 && (
                  <div>
                    <h3 className="text-4xl font-bold mb-8 text-center">
                      <span className="text-red-600">50 inch</span> Televisions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {getProductsByCategory('50 inch').map((product) => (
                        <TVCard
                          key={product.id}
                          name={product.name}
                          price={`৳ ${product.price.toLocaleString()}`}
                          image={product.image_url || ''}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 65 inch */}
                {getProductsByCategory('65 inch').length > 0 && (
                  <div>
                    <h3 className="text-4xl font-bold mb-8 text-center">
                      <span className="text-red-600">65 inch</span> Televisions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {getProductsByCategory('65 inch').map((product) => (
                        <TVCard
                          key={product.id}
                          name={product.name}
                          price={`৳ ${product.price.toLocaleString()}`}
                          image={product.image_url || ''}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center mb-16">
              Our <span className="text-red-600">Gallery</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-gray-200 h-64 rounded-lg flex items-center justify-center hover:shadow-xl transition">
                  <p className="text-gray-500">Photo {item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center mb-16">
              Contact <span className="text-red-600">Us</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-red-600 mr-4 text-2xl">📧</div>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <p className="text-gray-600">info@osakatv.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-600 mr-4 text-2xl">📞</div>
                    <div>
                      <h4 className="font-bold">Phone</h4>
                      <p className="text-gray-600">+880 123 456 7890</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-600 mr-4 text-2xl">📍</div>
                    <div>
                      <h4 className="font-bold">Address</h4>
                      <p className="text-gray-600">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-600"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-600"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Message</label>
                    <textarea 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-600 h-32"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
            <SocialLinks />
    </div>
  )
}