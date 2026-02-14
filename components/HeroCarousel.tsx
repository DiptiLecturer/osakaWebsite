'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link' // Import Link for internal navigation

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Welcome to OSAKA Television",
      description: "Experience the best in visual entertainment across Bangladesh.",
      image: "/hero1.jpg"
    },
    {
      title: "Premium Quality TVs",
      description: "From 24 to 65 - Find the perfect size for your home.",
      image: "/hero2.jpg"
    },
    {
      title: "Smart TV Technology",
      description: "Google TV and Smart features available with 4K resolution.",
      image: "/hero3.jpg"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative h-[600px] bg-black overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 flex items-center h-full px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {slide.title.split('OSAKA')[0]} 
                <span className="text-red-600">OSAKA</span> 
                {slide.title.split('OSAKA')[1]}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-10">
                {slide.description}
              </p>
              
              {/* UPDATED: Navigates to #category on the same page */}
              <Link
                href="#category"
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 inline-block shadow-lg"
              >
                View Product List
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-600 w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}