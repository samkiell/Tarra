import React from "react";
import { ScrollText, UserPlus, Share2, Download, CalendarDays, ShieldCheck, Banknote } from "lucide-react";

/**
 * RulesSection — Server Component
 * 
 * Official Rules for the Tarra 300K Peace Prize.
 * Rendered server-side for SEO crawlability.
 */
const RulesSection: React.FC = () => {
  const steps = [
    {
      icon: <UserPlus className="w-5 h-5 text-primary" />,
      text: "Sign up using your school email and phone number",
    },
    {
      icon: <Share2 className="w-5 h-5 text-primary" />,
      text: "The system generates a Unique Referral Link",
    },
    {
      icon: <Share2 className="w-5 h-5 text-primary" />,
      text: "Share the link on WhatsApp, Twitter, and with friends",
    },
    {
      icon: <UserPlus className="w-5 h-5 text-primary" />,
      text: "Your counter increases when they join",
    },
  ];

  const dates = [
    {
      icon: <CalendarDays className="w-4 h-4 text-primary" />,
      label: "Launch Day",
      value: "April 15, 2026",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      label: "Verification Window",
      value: "April 15–22 (7 days)",
    },
    {
      icon: <Banknote className="w-4 h-4 text-primary" />,
      label: "Winners Paid",
      value: "April 24 via Bank Transfer",
    },
  ];

  return (
    <section
      id="official-rules"
      className="pt-10 pb-10 sm:pt-16 sm:pb-16 transition-colors scroll-mt-24 border-t border-muted/5"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <ScrollText className="w-3.5 h-3.5" />
              Contest Rules
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight transition-colors leading-tight">
              📜 Official Rules:<br className="hidden sm:block" /> The Tarra 300K Peace Prize
            </h2>
            <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto transition-colors leading-relaxed">
              We are giving away <span className="text-primary font-bold">₦300,000</span> to the Top 20 students who help us build the Tarra community.
            </p>
          </div>

          {/* How To Participate */}
          <div className="bg-dark/40 border border-muted/10 rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-sm shadow-2xl transition-colors">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 border-b border-muted/10 pb-4">
              How To Participate
            </h3>
            <ol className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-dark border border-muted/10 flex items-center justify-center text-xs font-black text-primary">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    {step.icon}
                    <span className="text-white/90 text-sm sm:text-base leading-relaxed">{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Verification Rule */}
          <div className="bg-dark/40 border border-primary/15 rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-sm shadow-2xl transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-2">
                  Verification Rule
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  A referral only counts as <span className="text-primary font-bold">&quot;Verified&quot;</span> if the invited person downloads the Tarra App and logs in.
                </p>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-dark/40 border border-muted/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl transition-colors">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 border-b border-muted/10 pb-4">
              Important Dates
            </h3>
            <div className="flex flex-col gap-4">
              {dates.map((date, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-dark border border-muted/10 flex items-center justify-center">
                    {date.icon}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                    <span className="text-secondary text-xs font-bold uppercase tracking-wider">{date.label}</span>
                    <span className="hidden sm:inline text-muted/20">—</span>
                    <span className="text-white font-semibold text-sm sm:text-base">{date.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
