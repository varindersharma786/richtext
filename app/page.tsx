'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { animate } from 'animejs';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Star, Truck, Shield, ArrowRight } from 'lucide-react'

export default function EcommerceHomepage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero section animation
    const heroTl = gsap.timeline()
    heroTl
      .fromTo('.hero-title', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo('.hero-subtitle',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo('.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.3'
      )

    // Floating elements animation with Anime.js
    animate({
      targets: '.floating-element',
      translateY: [-20, 20],
      duration: 2000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    })

    // Product cards stagger animation
    gsap.fromTo('.product-card',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: productRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Features animation
    gsap.fromTo('.feature-item',
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Continuous rotation for decorative elements
    gsap.to('.rotating-element', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })
  }, [])

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: '$299',
      rating: 4.8,
      image: '/api/placeholder/300/300',
      category: 'Audio'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      price: '$399',
      rating: 4.9,
      image: '/api/placeholder/300/300',
      category: 'Wearables'
    },
    {
      id: 3,
      name: 'Laptop Stand',
      price: '$89',
      rating: 4.6,
      image: '/api/placeholder/300/300',
      category: 'Accessories'
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      price: '$159',
      rating: 4.7,
      image: '/api/placeholder/300/300',
      category: 'Accessories'
    }
  ]

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '2-Year Warranty',
      description: 'Comprehensive protection for your products'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Premium Quality',
      description: 'Carefully curated high-quality items'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
          <div className="floating-element absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30"></div>
          <div className="rotating-element absolute bottom-20 left-20 w-12 h-12 border-2 border-blue-300 rounded-full opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="hero-title text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Elevate Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Tech Experience
            </span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover cutting-edge technology and premium accessories designed for modern living.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2">
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuredRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience with premium products and exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Discover our most popular and innovative products</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="product-card group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-lg px-8 py-3">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive deals, and tech innovations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

