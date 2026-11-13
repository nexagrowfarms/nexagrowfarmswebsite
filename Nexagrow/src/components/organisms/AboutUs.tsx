import Image from 'next/image';
import React from 'react';
import { MapPin, Users, Sprout, Mail, Leaf, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';
import { BRAND } from '@/lib/brand';

const AboutUs = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(to bottom right, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />

      <div className="pt-36 sm:pt-40 md:pt-44" />

      {/* Header */}
      <div className="relative text-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(to right, transparent, var(--leaf-100), transparent)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--leaf-600)' }}>
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ backgroundImage: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Why We Started
          </h1>
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-1" style={{ background: 'linear-gradient(to right, transparent, var(--leaf-600))' }} />
            <div className="w-8 h-8 rotate-45 rounded-sm" style={{ backgroundColor: 'var(--leaf-600)' }} />
            <div className="w-16 h-1" style={{ background: 'linear-gradient(to left, transparent, var(--leaf-600))' }} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-24 space-y-20">

        {/* Why We Started */}
        <section className="space-y-6 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
          <p className="text-lg font-light">
            In most agricultural supply chains, the people who work the soil have the least say in what their crop becomes, how it is sold, and what it earns. A farmer manages the harvest and delivers the crop, but ownership passes to others from that exact point.
          </p>
          <p className="text-lg font-light">
            {BRAND.name} began because five of us, farming in Uttar Pradesh, simply disagreed with that arrangement. We had been cultivating moringa in our village, Kanewra in Prayagraj district, for years. We understood the plant, the soil, and the seasonal rhythms. There was no reason why our community&apos;s skills should earn a fraction of what the product was worth by the time it reached a consumer.
          </p>
          <p className="text-lg font-light">
            At the same time, people buying moringa powder were being asked to trust labels like &ldquo;Pure,&rdquo; &ldquo;Natural,&rdquo; or &ldquo;Organic&rdquo; without any real mechanism to verify them. We realized we could address both problems at once. We wanted to build a company where farmers hold ownership over the value they create, and where every claim made to a customer is backed by a short, verifiable supply chain.
          </p>
          <div className="p-6 rounded-xl" style={{ background: 'linear-gradient(to right, var(--leaf-50), var(--leaf-100))', borderLeft: '4px solid var(--leaf-500)' }}>
            <p className="text-lg font-light">
              To us, these are the exact same goal, approached from either end.
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--leaf-800)' }}>
            Who We Are
          </h2>
          <div className="space-y-6 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
            <p className="text-lg font-light">
              To turn this idea into a reality, we chose a specific legal structure in India that keeps control entirely with the producers. In January 2026, we incorporated {BRAND.name} as a Farmer Producer Company (CIN: {BRAND.cin}).
            </p>
            <p className="text-lg font-light">
              We are not a brand built by external entrepreneurs who contract farmers at the back end. This company is owned and operated directly by the five founding farmer-directors who live and work the land in Kanewra, a village in the Prayagraj district of Uttar Pradesh.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: <Users className="w-7 h-7" />,
                title: '5 Farmer-Directors',
                description: 'Five founding farmers who live here, work the land, and own the enterprise.',
              },
              {
                icon: <MapPin className="w-7 h-7" />,
                title: 'Kanewra, Uttar Pradesh',
                description: 'A single village in Prayagraj district. This is where the company is registered, the crop grows, and all decisions are made.',
              },
              {
                icon: <Sprout className="w-7 h-7" />,
                title: 'Hands-on Management',
                description: 'The founders personally handle everything from soil preparation and irrigation to milling and packaging. There is no head office elsewhere drawing conclusions about what happens on our soil.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-md border border-white"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white mb-4"
                  style={{ background: 'linear-gradient(to right, var(--leaf-500), var(--leaf-400))' }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--leaf-800)' }}>
                  {item.title}
                </h3>
                <p className="text-base font-light leading-relaxed" style={{ color: 'var(--leaf-700)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-lg font-light mt-8 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
            Soil preparation, harvest scheduling, shade-drying, cold-pressing, and packaging are not separate corporate departments. We are the same group of people working across every stage in the very same village.
          </p>
        </section>

        {/* How We Work the Land */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--leaf-800)' }}>
            How We Work the Land
          </h2>
          <p className="text-lg font-light mb-8 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
            Every {BRAND.name} product originates from {BRAND.khasra}, a single agricultural plot here in Kanewra. We cultivate moringa exclusively. Rather than managing a rotating crop calendar designed to scale up quickly, we focus on a single plant on a piece of land we know in detail.
          </p>

          <div className="space-y-6">
            {[
              {
                title: 'The Soil',
                text: 'We maintain the land using composts and microbial preparations made directly on the farm. Synthetic pesticides, chemical fertilizers, and GMO seeds have never been part of our farming approach.',
              },
              {
                title: 'The Drying Process',
                text: 'After the harvest, leaves are hand-picked and shade-dried on raised platforms inside the village. Direct sun and high heat degrade vitamin C and sensitive antioxidants. Keeping temperatures low during drying is the only way to preserve the native quality of what we grow.',
              },
              {
                title: 'The Packaging',
                text: 'Milling, capsule filling, cold-pressing, and packaging all take place within our village facility, operating under a unit compliant with FSSAI standards. The seed oil goes from the press straight to the bottle without ever leaving Kanewra, and our powders and capsules follow the exact same path.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-xl"
                style={{ background: 'linear-gradient(to right, var(--leaf-50), var(--leaf-100))', borderLeft: '4px solid var(--leaf-500)' }}
              >
                <Leaf className="w-5 h-5 mt-1 shrink-0" style={{ color: 'var(--leaf-600)' }} />
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--leaf-700)' }}>
                    {item.title}
                  </h3>
                  <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-lg font-light mt-8 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
            Because the same hands grow, process, and pack the product, the crop never passes between unrelated parties. What we describe on the label is exactly what is inside, because we are the ones who put it there.
          </p>
        </section>

        {/* What This Means For You */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--leaf-800)' }}>
            What This Means For You
          </h2>
          <div className="space-y-6 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
            <p className="text-lg font-light">
              When you buy from {BRAND.name}, you are dealing with a business where the farmer and the owner are the same person. This is a practical reality written directly into how our company was incorporated. For you, this means your purchase reaches the people who worked the soil directly, instead of being filtered through multiple corporate layers of a supply chain. The margin stays with the growers.
            </p>
          </div>

          <div className="mt-8 p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-md border border-white">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 shrink-0 mt-1" style={{ color: 'var(--leaf-600)' }} />
              <div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--leaf-800)' }}>
                  Absolute Traceability
                </h3>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--leaf-700)' }}>
                  Every product is grown on one named plot, in one village, by a small group of people you can contact directly by email. If you have a question about how the moringa was cultivated, dried, or processed, the person answering your email was physically there when it happened. For a product you put into your body every morning, that kind of connection to origin is not an extra. It is the point.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Nexa Way */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--leaf-800)' }}>
            The Nexa Way
          </h2>
          <p className="text-lg font-light mb-6 leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
            Every decision we have made since incorporation comes back to a single question: does this keep ownership with the farmers, and does it keep the product honest?
          </p>
          <ul className="space-y-4 mb-8">
            {[
              'We do not expand beyond moringa because we want to stay exceptionally good at this one thing.',
              'We do not bring in outside processing because our own facility allows us to personally vouch for everything that happens inside it.',
              'We do not add layers to our supply chain because every layer moves value away from the people who created it.',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: 'var(--leaf-500)' }} />
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--leaf-800)' }}>
                  {item}
                </p>
              </li>
            ))}
          </ul>
          <div className="p-6 rounded-xl" style={{ background: 'linear-gradient(to right, var(--leaf-50), var(--leaf-100))', borderLeft: '4px solid var(--leaf-500)' }}>
            <p className="text-lg font-light mb-4" style={{ color: 'var(--leaf-800)' }}>
              We think the best version of a food company is one where the people who grow the food own the company, control the process, and deal directly with the people who buy it. That is what {BRAND.name} is. It is also, we think, what food should be.
            </p>
            <p className="text-lg font-light" style={{ color: 'var(--leaf-700)' }}>
              If this matches the kind of company you want to support, we are glad to have you here.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ background: 'linear-gradient(to bottom right, var(--leaf-600), var(--leaf-500))' }}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative z-10 p-10 sm:p-12 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                <div className="relative shrink-0">
                  <Image
                    src={BRAND.logoLight}
                    alt={BRAND.name}
                    width={120}
                    height={120}
                    className="rounded-2xl border-4 border-white/30 shadow-lg p-3"
                    style={{ backgroundColor: 'var(--moss)' }}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold mb-2">{BRAND.name}</h3>
                  <p style={{ color: 'var(--leaf-100)' }}>
                    {BRAND.legalName}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" style={{ color: 'var(--leaf-200)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--leaf-200)' }}>Email</h4>
                  </div>
                  <a href={`mailto:${BRAND.email}`} className="text-lg hover:underline" style={{ color: 'var(--leaf-100)' }}>
                    {BRAND.email}
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" style={{ color: 'var(--leaf-200)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--leaf-200)' }}>Location</h4>
                  </div>
                  <p className="text-lg" style={{ color: 'var(--leaf-100)' }}>
                    Kanewra, Prayagraj District, Uttar Pradesh
                  </p>
                  <p className="text-sm opacity-90" style={{ color: 'var(--leaf-100)' }}>
                    Khasra no. 355, Village Kanewra, Manda, Meja, Prayagraj 212104
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" style={{ color: 'var(--leaf-200)' }} />
                    <h4 className="font-semibold" style={{ color: 'var(--leaf-200)' }}>Corporate Identity</h4>
                  </div>
                  <p className="text-lg" style={{ color: 'var(--leaf-100)' }}>
                    CIN: {BRAND.cin}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
