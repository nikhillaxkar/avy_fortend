import React from 'react';
import { Shield, Zap, Headphones, Code, CheckCircle2 } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-white px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Dark Card */}
        <div className="bg-[#0f172a] rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-8">
            <Shield size={14} className="text-blue-400" /> Bank Grade Security
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">Safe. Secure. <br /><span className="text-yellow-500">Reliable.</span></h2>
          <p className="text-slate-400 text-lg mb-12">Join 5000+ businesses who trust AADIJAGANNATH with their daily transactions.</p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="text-yellow-500 text-2xl font-bold">99.9%</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Success Rate</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="text-purple-500 text-2xl font-bold">5K+</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Active Partners</p>
            </div>
          </div>
          
          <div className="mt-10 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-bold border border-emerald-500/20">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> All Systems Operational
          </div>
        </div>

        {/* Right List */}
        <div className="space-y-6">
          <h3 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-8">Why businesses choose <span className="text-yellow-600 underline decoration-yellow-200">AADIJAGANNATH</span></h3>
          {[
            { icon: <Shield />, title: "Bank-Grade Security", desc: "PCI DSS Level 1 compliant. Your data is locked safe.", color: "text-blue-500" },
            { icon: <Zap />, title: "Lightning Fast", desc: "Settlements in under 2 seconds. Keep cash flowing.", color: "text-orange-500", highlight: true },
            { icon: <Headphones />, title: "24/7 Expert Support", desc: "Real humans, ready to help you anytime, anywhere.", color: "text-gray-400" },
            { icon: <Code />, title: "Developer APIs", desc: "Plug & Play integration for websites and apps.", color: "text-cyan-500" }
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-6 p-6 rounded-2xl border transition-all ${item.highlight ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-50 hover:bg-slate-50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm ${item.color}`}>{item.icon}</div>
              <div>
                <h4 className="font-bold text-[#0f172a]">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhyChooseUs;