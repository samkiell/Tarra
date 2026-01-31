import React from "react";

/**
 * Hero Component
 * 
 * Design:
 * - Minimalist aesthetic with a focus on typography and clear action.
 * - Neutral color palette (Stone/Zinc) to ensure a premium, professional feel.
 * - No gradients or animations as per technical constraints.
 * 
 * Logic:
 * - Contains a form for email capture.
 * - Placeholder for brand logo and decorative patterns.
 */
const Hero: React.FC = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-white">
      {/* Background Decorative Pattern Placeholder */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 border border-stone-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-stone-900 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Logo Placeholder */}
          <div className="mb-8 w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6">
            The Official OAU Marketplace
          </h1>

          <p className="text-xl text-stone-600 mb-4 font-medium">
            Join the exclusive waitlist for the campus commerce revolution.
          </p>

          <p className="text-stone-500 mb-10 leading-relaxed">
            Connect with verified campus vendors and discover essential services in one secure platform. 
            Trade, buy, and sell within a trusted ecosystem built specifically for the OAU community.
          </p>

          <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your campus email"
              className="flex-grow px-4 py-3 rounded-md border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-stone-900 text-white font-semibold rounded-md hover:bg-stone-800 transition-colors"
            >
              Join Waitlist
            </button>
          </form>

          <div className="mt-8 text-sm text-stone-400">
            Be the first to know when we launch.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
