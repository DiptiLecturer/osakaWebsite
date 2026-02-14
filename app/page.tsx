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
      
      <main>
        {/* HOME SECTION */}
        <section id="home" className="pt-16">
          <HeroCarousel />
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-20 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center mb-16">
              About <span className="text-red-600">OSAKA Television</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Our Story</h3>
                <p className="text-gray-700 text-lg mb-4">
                  OSAKA Television has been at the forefront of bringing premium television 
                  solutions to homes and businesses across Bangladesh.
                </p>
                <p className="text-gray-700 text-lg">
                  Our commitment to quality and innovation has made us a trusted name. 
                  We offer a comprehensive range from 24 inch to 65 inch.
                </p>
              </div>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center overflow-hidden">
                 <img src="/about-us.jpg" alt="About Osaka" className="w-full h-full object-cover" 
                      onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/600x400?text=OSAKA+Showroom'} />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section id="category" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center mb-16">
              Our <span className="text-red-600">Categories</span>
            </h2>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="space-y-24">
                {['24 inch', '32 inch', '43 inch', '50 inch', '65 inch'].map((size) => (
                  getProductsByCategory(size).length > 0 && (
                    <div key={size}>
                      <h3 className="text-4xl font-bold mb-8 text-center text-gray-800">
                        <span className="text-red-600">{size}</span> Televisions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {getProductsByCategory(size).map((product) => (
                          <TVCard
                            key={product.id}
                            name={product.name}
                            price={`৳ ${product.price.toLocaleString()}`}
                            image={product.image_url || ''}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ))}
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
                <div key={item} className="bg-gray-200 h-64 rounded-lg flex items-center justify-center hover:shadow-xl transition group overflow-hidden">
                   <div className="text-gray-400 group-hover:scale-110 transition-transform duration-500">
                      Photo {item}
                   </div>
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
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 mr-4">📧</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@osakatv.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 mr-4">📞</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+880 1XXX-XXXXXX</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <form className="space-y-4">
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="Your Name" />
                  <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="Email Address" />
                  <textarea className="w-full px-4 py-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="Write your message here..."></textarea>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-bold transition-colors shadow-md transform active:scale-95">
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