"use client";
import React, { useState } from 'react';
import { Plus, Minus, MessageSquare } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const questions = [
    { q: "How secure is AADIJAGANNATH for online transactions?", a: "Security is our core foundation. We are PCI DSS Level 1 certified and use industrial-grade AES-256 encryption for all data. Our AI-driven fraud detection system monitors transactions in real-time." },
    { q: "When will I receive settlements in my bank account?", a: "We offer lightning-fast settlements, often within T+1 or even real-time for qualified partners." },
    { q: "Are there any setup fees or hidden maintenance charges?", a: "Zero. No hidden fees. No annual maintenance. Pay only as you grow." },
    { q: "How difficult is it to integrate AADIJAGANNATH with my website?", a: "Our developer-first APIs can be integrated in less than 30 minutes with just a few lines of code." }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-red-100">❓ FAQ</div>
          <h2 className="text-5xl md:text-6xl font-black text-[#0f172a] mb-6">Frequently Asked <br /><span className="text-yellow-500">Questions</span></h2>
          <p className="text-slate-400 text-lg font-medium max-w-md">Have questions? We've got answers. Here are some of the most common inquiries from our partners.</p>
          
          <div className="mt-12 w-64 h-64 bg-slate-50 rounded-[3rem] flex items-center justify-center relative">
             <div className="absolute -top-4 -right-4 bg-red-100 w-12 h-12 rounded-full flex items-center justify-center text-red-500 font-bold shadow-lg shadow-red-100">?</div>
             <div className="absolute top-1/2 -left-8 bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-300">?</div>
             <MessageSquare size={80} className="text-slate-200" />
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className={`rounded-3xl border transition-all ${openIndex === i ? 'bg-white border-yellow-500 shadow-xl shadow-yellow-500/5' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
              <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="w-full flex items-center justify-between p-6 text-left">
                <span className="font-bold text-[#0f172a] md:text-lg">{item.q}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${openIndex === i ? 'bg-yellow-500 text-black' : 'bg-slate-200 text-slate-500'}`}>
                  {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-8 text-slate-500 font-medium leading-relaxed animate-in slide-in-from-top-2">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FAQ;