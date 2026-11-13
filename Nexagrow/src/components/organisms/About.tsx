import React from 'react';
import { Heart, Award, Users, Leaf, Shield } from 'lucide-react';
import Testimonials from './Testimonials';
import AgricultureCollage from './AgricultureCollage';

const About = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(to bottom right, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      {/* Mission Section - full width */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--leaf-100)' }}>
              <Heart className="w-5 h-5" style={{ color: 'var(--leaf-600)' }} />
              <span className="font-medium" style={{ color: 'var(--leaf-800)' }}>Our Mission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Beyond Organic: A Community-First Approach</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Fresh organic produce and high-potency supplements—with fair wages and ethical treatment for farmers and livestock.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Healthy food comes from healthy farms. Our commitment goes beyond the product.
            </p>
            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--leaf-500)' }}></div>
                <p className="text-lg text-gray-700"><strong>Better Lives:</strong> Fair pay and real opportunities for farmers.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--leaf-500)' }}></div>
                <p className="text-lg text-gray-700"><strong>Ethical Farming:</strong> Respect for livestock and land—better, safer crops for you.</p>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed mt-4 italic">
              When you buy from us, you support a system that rewards honest, hard work.
            </p>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'linear-gradient(to bottom right, var(--leaf-200), var(--leaf-300))' }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/80 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl font-bold" style={{ color: 'var(--leaf-600)' }}>100%</div>
                  <div className="text-sm text-gray-600">Chemical-Free</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl font-bold" style={{ color: 'var(--leaf-600)' }}>∞</div>
                  <div className="text-sm text-gray-600">Sustainable Impact</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-2xl backdrop-blur-sm col-span-2">
                  <div className="text-2xl font-bold" style={{ color: 'var(--leaf-600)' }}>Community First</div>
                  <div className="text-sm text-gray-600">Empowering Farmers & Families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image collage – farming & community - full width */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Our World in Pictures</h2>
          <p className="text-lg text-gray-600">Farms, community, and the journey from soil to you</p>
        </div>
        <AgricultureCollage compact fullWidth title="" images={[
          { src: "/world-pictures-2.png", alt: "Wooden spoon of moringa powder on fresh leaves" },
          { src: "/world-pictures-3.png", alt: "Fresh moringa leaves collected after harvest" },
          { src: "/world-pictures-4.png", alt: "Dried moringa leaves ready for processing" },
          { src: "/world-pictures-1.png", alt: "Moringa powder on a wooden spoon with fresh leaves" },
        ]} />
      </div>

      {/* Values Section - full width */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Makes Us Special</h2>
            <p className="text-lg text-gray-600">The foundation of our commitment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Pure & Chemical-Free",
                description: "If it isn't chemical-free, it isn't food. Only the purest, pesticide-free produce touches our products"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community First",
                description: "Fair wages, better opportunities, and ethical treatment for farmers and livestock"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Minimal Processing",
                description: "Advanced, minimal processing to lock in nutrients, creating superfoods that are convenient and powerful"
              }
            ].map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to right, var(--leaf-500), var(--leaf-400))' }}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Testimonials - below What Makes Us Special */}
      <Testimonials />

      {/* Trust Section */}
      <div className="py-16" style={{ background: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Trusted & Certified
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <Shield className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">FSSAI Certified</h3>
              <p className="text-lg opacity-90"></p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <Award className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">GST Registered</h3>
              <p className="text-lg opacity-90"></p>
            </div>
          </div>
          <p className="mt-8 text-lg leading-relaxed text-white/90">
            Your trust is our most precious ingredient. Every product is crafted under 
            the highest standards of quality, hygiene, and ethical sourcing.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;
