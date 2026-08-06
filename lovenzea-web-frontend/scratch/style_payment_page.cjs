const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/payment/Payment.jsx';

let content = fs.readFileSync(path, 'utf8');

// I will extract the imports and state logic, then replace the entire return block.
const returnIndex = content.indexOf('return (');
const logicPart = content.substring(0, returnIndex);

const newReturnBlock = `return (
        <div className="w-full bg-transparent font-sans min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Hero Banner with Glassmorphism */}
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl mb-12 group border border-white/50" 
                     style={{ backgroundImage: \`url(\${bannerBg})\`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    
                    {/* Dark Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5A2332]/90 via-[#8C6D39]/80 to-transparent backdrop-blur-[2px]"></div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-400/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-left max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-rose-100 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                                <Crown size={14} className="text-amber-300" /> Premium Membership
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white font-serif mb-4 leading-tight drop-shadow-md">
                                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200">Perfect Match</span> Faster
                            </h1>
                            <p className="text-rose-100 text-lg md:text-xl font-medium max-w-xl opacity-90 drop-shadow-sm leading-relaxed">
                                Upgrade now to unlock exclusive privileges and save up to 85% on our premium plans. Limited time offer!
                            </p>
                        </div>
                        
                        <div className="hidden lg:block shrink-0 animate-pulse">
                            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                                <Sparkles size={60} className="text-amber-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid lg:grid-cols-3 gap-8 relative z-10 pb-16">
                    {plans.map((plan, index) => {
                        const isPopular = index === 1;
                        
                        return (
                            <div key={plan.id} className="relative h-full flex group">
                                <div className={\`w-full flex flex-col rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden backdrop-blur-xl \${
                                    isPopular 
                                    ? "bg-gradient-to-b from-[#FFF2EF]/90 to-white/95 border-2 border-[#E86D8A]/50 shadow-xl" 
                                    : "bg-white/80 border border-white/60 shadow-lg"
                                }\`}>
                                    
                                    {/* Popular Ribbon */}
                                    {isPopular && (
                                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#E86D8A] to-[#D89A74]"></div>
                                    )}
                                    {isPopular && plan.design.ribbon && (
                                        <div className="absolute top-6 right-6 bg-gradient-to-r from-[#E86D8A] to-[#D89A74] text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-md">
                                            {plan.design.ribbon}
                                        </div>
                                    )}

                                    <div className="p-8 md:p-10 flex-1 flex flex-col">
                                        {/* Icon & Title */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner \${
                                                isPopular 
                                                ? "bg-gradient-to-tr from-[#E86D8A] to-[#D89A74] text-white" 
                                                : "bg-[#FAF6F0] text-[#8C6D39]"
                                            }\`}>
                                                {plan.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold font-serif text-[#3B2F2F]">{plan.name}</h3>
                                                <p className="text-sm font-medium text-theme-text-secondary">{plan.duration}</p>
                                            </div>
                                        </div>

                                        {/* Pricing Block */}
                                        <div className="mb-8">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-gray-400 line-through text-sm font-semibold">
                                                    ₹{plan.originalPrice.toLocaleString("en-IN")}
                                                </span>
                                                <span className={\`text-xs font-bold px-3 py-1 rounded-full \${
                                                    isPopular ? "bg-[#E86D8A]/10 text-[#E86D8A]" : "bg-emerald-50 text-emerald-600"
                                                }\`}>
                                                    Save {plan.discount}%
                                                </span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black text-[#3B2F2F] tracking-tighter">
                                                    ₹{plan.discountedPrice.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-theme-text-secondary font-medium mt-2">
                                                Just ₹{plan.perMonth}/month
                                            </p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

                                        {/* Features List */}
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <div className={\`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 \${
                                                        isPopular ? "bg-[#E86D8A] text-white shadow-sm" : "bg-gray-100 text-gray-500"
                                                    }\`}>
                                                        <Check size={12} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-medium leading-relaxed">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => handleContinue(plan)}
                                            className={\`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md \${
                                                isPopular 
                                                ? "bg-gradient-to-r from-[#E86D8A] to-[#D89A74] text-white hover:shadow-[0_10px_25px_rgba(232,109,138,0.3)] hover:scale-[1.02]" 
                                                : "bg-[#FAF6F0] text-[#3B2F2F] hover:bg-white hover:shadow-lg border border-white/50"
                                            }\`}
                                        >
                                            Choose {plan.name} <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center pb-12">
                    <p className="text-[#8C6D39] text-sm font-bold tracking-wide uppercase">
                        <ShieldCheck className="inline-block w-4 h-4 mr-1 -mt-1" /> 100% Secure & Trusted Payment Options
                    </p>
                </div>

                {/* Modal (Redesigned) */}
                {showModal && selectedPlan && createPortal(
                    <div className="fixed inset-0 bg-[#3B2F2F]/40 backdrop-blur-sm flex items-center justify-center z-[99999] p-4" onClick={(e) => { if(e.target === e.currentTarget) setShowModal(false) }}>
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-lg max-h-[90vh] flex flex-col border border-white/60 animate-slideUp overflow-hidden" onClick={e => e.stopPropagation()}>
                            
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                                <h3 className="text-2xl font-black text-[#5A2332] font-serif flex items-center gap-3">
                                    <ShieldCheck className="text-[#E86D8A]" /> Checkout
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E86D8A]/10 text-gray-500 hover:text-[#E86D8A] flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                                {/* Plan Details Box */}
                                <div className="bg-[#FAF6F0] rounded-2xl p-5 mb-6 border border-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-lg font-bold text-[#3B2F2F]">
                                                {selectedPlan.name} Plan
                                            </p>
                                            <p className="text-sm font-medium text-theme-text-secondary">{selectedPlan.duration} Validity</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-[#E86D8A]">
                                                ₹{selectedPlan.discountedPrice.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-xs text-gray-400 line-through">₹{selectedPlan.originalPrice.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                                        <Sparkles size={12} /> You saved ₹{calculateSavings().toLocaleString('en-IN')}
                                    </div>
                                </div>

                                {/* Add-ons */}
                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">Value Add-ons</h4>
                                <div className="space-y-3">
                                    {/* Extra Contacts */}
                                    <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#E86D8A]/30 bg-white cursor-pointer transition-colors group has-[:checked]:border-[#E86D8A] has-[:checked]:bg-[#FFF8F5]">
                                        <input
                                            type="checkbox"
                                            checked={orderDetails.addContacts}
                                            onChange={(e) => setOrderDetails({...orderDetails, addContacts: e.target.checked})}
                                            className="w-5 h-5 rounded text-[#E86D8A] border-gray-300 focus:ring-[#E86D8A] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-[#E86D8A] transition-colors">Add {selectedPlan.extraContacts} Extra Contacts</p>
                                            <p className="text-xs text-gray-500">View more profiles directly</p>
                                        </div>
                                        <span className="font-bold text-[#3B2F2F]">₹{selectedPlan.extraContactPrice}</span>
                                    </label>

                                    {/* Promote Profile */}
                                    <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#E86D8A]/30 bg-white cursor-pointer transition-colors group has-[:checked]:border-[#E86D8A] has-[:checked]:bg-[#FFF8F5]">
                                        <input
                                            type="checkbox"
                                            checked={orderDetails.promoteProfile}
                                            onChange={(e) => setOrderDetails({...orderDetails, promoteProfile: e.target.checked})}
                                            className="w-5 h-5 rounded text-[#E86D8A] border-gray-300 focus:ring-[#E86D8A] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-bold text-gray-800 group-hover:text-[#E86D8A] transition-colors">Promote my Profile</p>
                                                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500">Get highlighted in search results</p>
                                        </div>
                                        <span className="font-bold text-[#3B2F2F]">₹{selectedPlan.promotePrice}</span>
                                    </label>

                                    {/* Contribute */}
                                    <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#E86D8A]/30 bg-white cursor-pointer transition-colors group has-[:checked]:border-[#E86D8A] has-[:checked]:bg-[#FFF8F5]">
                                        <input
                                            type="checkbox"
                                            checked={orderDetails.contributePunarMilan}
                                            onChange={(e) => setOrderDetails({...orderDetails, contributePunarMilan: e.target.checked})}
                                            className="w-5 h-5 rounded text-[#E86D8A] border-gray-300 focus:ring-[#E86D8A] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-[#E86D8A] transition-colors">Support PunarMilan.org</p>
                                            <p className="text-xs text-gray-500">Small contribution towards community</p>
                                        </div>
                                        <span className="font-bold text-[#3B2F2F]">₹{selectedPlan.contribution}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Modal Footer (Total & Pay) */}
                            <div className="p-6 border-t border-gray-100 bg-white">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Payable</p>
                                    <p className="text-3xl font-black text-[#5A2332]">
                                        ₹{calculateTotal().toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <button 
                                    onClick={handlPayment}
                                    className="w-full bg-gradient-to-r from-[#E86D8A] to-[#D89A74] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-[0_10px_30px_rgba(232,109,138,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                                >
                                    Proceed to Secure Payment
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                <style>{\`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                \`}</style>

                <FaqSection />
                <TestimalCarousel />
            </div>
        </div>
    );
}

export default Payment;
`;

const finalContent = logicPart + newReturnBlock;
fs.writeFileSync(path, finalContent);
console.log('Payment page styled beautifully');
