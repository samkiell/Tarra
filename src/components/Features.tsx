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
    <section className="py-12 sm:py-20 transition-colors border-t border-muted/5">
      <div className="container mx-auto px-6">
        <h2 className="sr-only">Our Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-dark border border-muted/10 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:border-primary/50 shadow-xl shadow-black/20">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight transition-colors">
                {pillar.title}
              </h3>
              <p className="text-secondary leading-relaxed transition-colors max-w-sm">
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
