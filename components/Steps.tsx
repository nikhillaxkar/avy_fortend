import React from 'react';
import { UserPlus, ShieldCheck, FileCheck, Rocket, CheckCircle2 } from 'lucide-react';

const Steps = () => {
  return (
    <section className="py-20 bg-slate-50/50 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-100">✨ Quick Setup</div>
           <h2 className="text-5xl md:text-6xl font-black text-[#0f172a]">Our Easy Steps for <br /><span className="text-yellow-500">Registration</span></h2>
           <p className="text-slate-400 text-lg max-w-xl font-medium">Getting started is quick and simple. Follow our streamlined registration process and create your account in just a few minutes.</p>
           
           <div className="space-y-4 pt-8">
             {[
               { icon: <UserPlus />, title: "Sign In", desc: "Create your account with basic details" },
               { icon: <ShieldCheck />, title: "KYC Verification", desc: "Complete secure identity verification" },
               { icon: <FileCheck />, title: "Complete Registration", desc: "Finish setup and configure your account", active: true },
               { icon: <Rocket />, title: "Start Transactions", desc: "Begin accepting and processing payments" }
             ].map((step, i) => (
               <div key={i} className={`flex items-center gap-6 p-5 rounded-2xl border transition-all ${step.active ? 'bg-white border-yellow-200 shadow-lg' : 'bg-transparent border-transparent opacity-60'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.active ? 'bg-yellow-500 text-black' : 'bg-slate-200 text-slate-500'}`}>{step.icon}</div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-[#0f172a]">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{step.desc}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right Preview Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500/20 rounded-t-full overflow-hidden">
             <div className="w-2/3 h-full bg-yellow-500" />
          </div>
          <div className="space-y-6 pt-4">
             {["Identity Verified", "Documents Approved", "Setup Complete"].map((text, i) => (
               <div key={i} className="flex items-center gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>
                  <div className="text-left">
                    <h5 className="font-bold text-emerald-900 text-sm">{text}</h5>
                    <p className="text-[10px] text-emerald-600 font-medium">Account processed successfully</p>
                  </div>
               </div>
             ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-12">
             <button className="bg-emerald-500 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">✓ Ready to Launch</button>
             <button className="bg-[#0f172a] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">🚀 Start Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Steps;