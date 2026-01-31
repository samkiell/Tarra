import React from "react";

import { ShoppingCart, Building2, Wrench } from "lucide-react";

/**
 * Features Component
 * 
 * Logic:
 * Displays the three core pillars of the Tarra platform as specified in the docs.
 */
const Features: React.FC = () => {
  const pillars = [
    {
      title: "Marketplace",
      description: "Buy and sell physical products within the OAU community safely.",
      icon: <ShoppingCart className="w-8 h-8 text-stone-900" />,
    },
    {
      title: "Brands",
      description: "Discover and support verified campus-grown businesses.",
      icon: <Building2 className="w-8 h-8 text-stone-900" />,
    },
    {
      title: "Services",
      description: "Book essential student services from trusted providers.",
      icon: <Wrench className="w-8 h-8 text-stone-900" />,
    },
  ];

  return (
    <section className="py-20 bg-stone-50 border-y border-stone-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border border-stone-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                {pillar.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
