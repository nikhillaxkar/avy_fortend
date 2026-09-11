import React from 'react';

const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-lg">
      {/* Background Glow Effect */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-100 rounded-full blur-[100px] opacity-50 -z-10"></div>
      
      {/* Main Dashboard Card */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-50 p-8 sm:p-10 relative">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a2b3c]">₹1,24,500.00</h2>
          </div>
          
          {/* Notification Toast */}
          <div className="bg-green-50 px-3 py-2 rounded-2xl border border-green-100 flex items-center gap-3 shadow-sm animate-bounce-slow">
             <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
             <div className="pr-1">
                <p className="text-[9px] text-gray-400 font-bold leading-none uppercase">Payment Received</p>
                <p className="text-xs font-bold text-green-600">+₹450.00</p>
             </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end gap-3 sm:gap-4 h-40 mb-8 px-2">
          {[40, 60, 45, 75, 90, 65, 100].map((height, i) => (
            <div 
              key={i} 
              className={`w-full rounded-t-xl transition-all duration-700 hover:opacity-80 cursor-pointer ${i === 4 || i === 6 ? 'bg-[#1a2b3c]' : 'bg-gray-100'}`}
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-gray-50 pt-6">
           <div className="flex items-center gap-3">
             <div className="flex -space-x-3">
               <div className="w-9 h-9 rounded-full border-2 border-white bg-red-400 shadow-sm"></div>
               <div className="w-9 h-9 rounded-full border-2 border-white bg-yellow-400 shadow-sm"></div>
               <div className="w-9 h-9 rounded-full border-2 border-white bg-orange-400 shadow-sm"></div>
               <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">+2k</div>
             </div>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">+2k Users</span>
           </div>
           <button className="text-[#eab308] font-extrabold text-sm hover:translate-x-1 transition-transform uppercase tracking-wider">
             View Report
           </button>
        </div>

        {/* Floating Card UI Element */}
        <div className="absolute -bottom-4 -left-4 sm:-left-10 bg-[#0f172a] text-white p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-2xl z-20 border border-slate-700">
           <div className="bg-blue-600 p-2 rounded-lg">
             <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
           </div>
           <span className="font-mono tracking-[0.3em] text-sm sm:text-base font-semibold text-slate-300 italic">•••• 4829</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;