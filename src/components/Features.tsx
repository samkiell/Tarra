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
      icon: <ShoppingCart className="w-8 h-8 text-primary" />,
    },
    {
      title: "Brands",
      description: "Discover and support verified campus-grown businesses.",
      icon: <Building2 className="w-8 h-8 text-primary" />,
    },
    {
      title: "Services",
      description: "Book essential student services from trusted providers.",
      icon: <Wrench className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <section className="py-20 sm:py-32 transition-colors border-t border-muted/5">
      <div className="container mx-auto px-6">
        <h2 className="sr-only">Our Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center text-center group bg-dark/20 p-8 rounded-2xl border border-transparent hover:border-muted/10 transition-all duration-500">
              <div className="w-20 h-20 bg-dark border border-muted/10 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:border-primary/50 shadow-2xl shadow-black/40 group-hover:scale-105 duration-500">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight transition-colors">
                {pillar.title}
              </h3>
              <p className="text-secondary text-base leading-relaxed transition-colors max-w-sm">
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
