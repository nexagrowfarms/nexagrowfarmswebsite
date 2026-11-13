"use client";

import { useSession } from "next-auth/react";
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import Benefits from "@/components/Benefits";
import TopPicksForYou from "@/components/organisms/TopPicksForYou";
import ProductPromoCarousel from "@/components/organisms/ProductPromoCarousel";
import ProductExcellence from "@/components/ProductExcellence";
import Spotlight from "@/components/organisms/Spotlight";
import AgricultureCollage from "@/components/organisms/AgricultureCollage";
import BlogSection from "@/components/BlogSection";
import ChatBot from "@/components/organisms/ChatBot";
import About from "@/components/About";


export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--leaf-500)' }} />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <Navbar />
        <Hero />
        
        {/* Benefits Section */}
        <Benefits />

        {/* Top Picks – full viewport width so background has no white sides */}
        <section className="w-full">
          <TopPicksForYou />
        </section>

        {/* Product Excellence - after latest/moringa products */}
        <ProductExcellence />

        {/* Spotlight - product testimonials carousel */}
        <Spotlight />

        {/* Product promo carousel – swiping ads for own products */}
        <ProductPromoCarousel />

        {/* Agriculture / farming collage */}
        <AgricultureCollage title="From Our Farms" />

        {/* Blog Section */}
        <BlogSection />

        {/* About – full viewport width, no side margins */}
        <section className="w-full">
          <About />
        </section>
        
       
      </div>

      {/* Support Chatbot */}
      <ChatBot />
    </>
  );
}