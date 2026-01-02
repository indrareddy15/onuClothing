import React from 'react'
import { Truck, Shield, Clock, RotateCcw, CreditCard, Package } from 'lucide-react'

const FeatureIcons = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $50'
    },
    {
      icon: Shield,
      title: 'Quality Products',
      description: 'Carefully curated premium items'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Dedicated customer service team'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day hassle-free returns'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: Package,
      title: 'Fast Delivery',
      description: 'Quick delivery to your doorstep'
    }
  ]

  return (
    <section className="py-16 bg-[#f9f9f9]" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-6 rounded-lg bg-white border border-[#e0e0e0] hover-lift cursor-pointer"
                style={{ borderColor: '#e0e0e0' }}
              >
                <div className="mb-4 p-4 bg-black rounded-full group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  {feature.title}
                </h3>
                <p className="text-base" style={{ color: '#666666' }}>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureIcons