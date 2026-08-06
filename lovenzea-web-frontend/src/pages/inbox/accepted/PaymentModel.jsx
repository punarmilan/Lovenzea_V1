import React, { useState } from 'react';
import Swal from 'sweetalert2';

const PaymentModal = ({ onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            id: 1,
            name: '1 Month',
            price: '999',
            duration: '/mo',
            popular: false,
            features: [
                'Unlimited messaging',
                'View all contacts',
                'Priority listing',
                'Profile boost'
            ]
        },
        {
            id: 2,
            name: '3 Months',
            price: '2,499',
            duration: '/3mo',
            popular: true,
            features: [
                'Everything in 1 Month',
                'Save 17%',
                'Featured profile',
                'Premium support'
            ]
        },
        {
            id: 3,
            name: '6 Months',
            price: '4,499',
            duration: '/6mo',
            popular: false,
            features: [
                'Everything in 3 Months',
                'Save 25%',
                'Dedicated manager',
                'Premium matchmaking'
            ]
        }
    ];

    const premiumBenefits = [
        {
            icon: '💬',
            title: 'Unlimited Messaging',
            description: 'Connect with unlimited profiles'
        },
        {
            icon: '📞',
            title: 'Direct Contact',
            description: 'Call & WhatsApp instantly'
        },
        {
            icon: '🎯',
            title: 'Priority Listing',
            description: 'Appear first in searches'
        },
        {
            icon: '🔥',
            title: 'Profile Boost',
            description: '10x more visibility'
        },
        {
            icon: '✅',
            title: 'Verified Badge',
            description: 'Stand out with verification'
        },
        {
            icon: '🤝',
            title: 'Premium Support',
            description: 'Dedicated assistance'
        }
    ];

    const handleSelectPlan = (planId, planName) => {
        setSelectedPlan(planId);
        Swal.fire({ text: `Processing payment for ${planName} plan...`, confirmButtonColor: '#8C6D39' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-theme-surface rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#d4145a] to-[#8b0a3d] text-white px-8 py-10 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-theme-surface/20 hover:bg-theme-surface/30 rounded-full flex items-center justify-center text-2xl transition-all duration-300"
                    >
                        ×
                    </button>
                    <h1 className="font-playfair text-4xl font-bold mb-2">
                        💎 Upgrade to Premium
                    </h1>
                    <p className="text-lg opacity-95">
                        Unlock unlimited connections and premium features
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Pricing Plans */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`border-2 rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl relative
                  ${plan.popular
                                        ? 'border-[#f4c542] bg-gradient-to-br from-[#fef3c7] to-[#fde68a]'
                                        : 'border-[#e8dfd6] hover:border-[#d4145a]'
                                    }
                  ${selectedPlan === plan.id ? 'ring-4 ring-[#d4145a]/30' : ''}
                `}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3 right-5 bg-[#f4c542] text-[#8b0a3d] px-4 py-1 rounded-full text-sm font-bold">
                                        MOST POPULAR
                                    </span>
                                )}

                                <h3 className="font-playfair text-2xl font-bold text-[#2c1810] mb-4">
                                    {plan.name}
                                </h3>

                                <div className="mb-4">
                                    <span className="text-5xl font-bold text-[#d4145a]">
                                        ₹{plan.price}
                                    </span>
                                    <span className="text-lg text-[#6b5d55]">{plan.duration}</span>
                                </div>

                                <ul className="space-y-3 mb-6 text-left">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-[#6b5d55]">
                                            <span className="text-[#22c55e] font-bold flex-shrink-0">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSelectPlan(plan.id, plan.name)}
                                    className="w-full bg-gradient-to-br from-[#d4145a] to-[#8b0a3d] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    Select Plan
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Premium Benefits */}
                    <div className="bg-[#faf8f5] rounded-2xl p-8">
                        <h3 className="font-playfair text-3xl font-bold text-[#2c1810] text-center mb-8">
                            ✨ Premium Benefits
                        </h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {premiumBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="text-4xl flex-shrink-0">{benefit.icon}</div>
                                    <div>
                                        <h4 className="text-[#2c1810] font-semibold mb-1">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-[#6b5d55] text-sm">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={onClose}
                            className="text-[#d4145a] font-semibold text-lg hover:underline"
                        >
                            ← Back to Profiles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;