import React from 'react';
import { Check, CreditCard, Smartphone, Landmark } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      title: "UPI",
      subtitle: "UPI, QR Code & Intent",
      rate: "1.1%",
      features: ["All UPI apps", "Instant confirm", "Deep-link support"],
      icon: <Smartphone className="text-indigo-500" size={20} />,
      isPopular: false
    },
    {
      title: "Cards",
      subtitle: "Credit & Debit Cards",
      rate: "2.0%",
      features: ["Visa, MC & RuPay", "3D Secure", "International"],
      icon: <CreditCard className="text-yellow-500" size={20} />,
      isPopular: true
    },
    {
      title: "Net Banking",
      subtitle: "All Major Banks",
      rate: "1.5%",
      features: ["50+ banks", "Secure redirect", "Real-time"],
      icon: <Landmark className="text-emerald-500" size={20} />,
      isPopular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      {/* Container ki width ko thoda narrow kiya hai (max-w-6xl) taaki compact lage */}
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header - Chota aur clean */}
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <div className="inline-flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-yellow-100">
            Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
            Simple, <span className="text-[#eab308]">Competitive</span> Rates
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-medium">
            Transparent pricing model for your growing business.
          </p>
        </div>

        {/* Pricing Cards Grid - Gap thoda kam kiya hai */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-6 md:p-8 rounded-[2rem] transition-all duration-300 flex flex-col ${
                plan.isPopular 
                ? 'bg-[#0f172a] shadow-2xl py-10 scale-100 lg:scale-105 z-10 text-white' 
                : 'bg-white border border-slate-100 shadow-sm text-slate-900'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Popular
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${plan.isPopular ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
                  {plan.subtitle}
                </p>

                <div className="mb-6">
                  <span className={`text-5xl font-black leading-none ${plan.isPopular ? 'text-yellow-500' : 'text-[#0f172a]'}`}>
                    {plan.rate}
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">per transaction</p>
                </div>

                <ul className="space-y-3 mb-8 w-full text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-semibold">
                      <Check size={14} className={plan.isPopular ? 'text-yellow-500' : 'text-emerald-500'} strokeWidth={3} />
                      <span className={plan.isPopular ? 'text-slate-400' : 'text-slate-500'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  plan.isPopular 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                  : 'bg-[#0f172a] text-white hover:bg-slate-800'
                }`}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;